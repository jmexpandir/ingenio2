import express from 'express';
import { db } from '../database.js';
import { generateLicenseKey, validateLicenseKeyFormat, isLicenseExpired, hashDomain, isValidDomain } from '../utils/licenseGenerator.js';

const router = express.Router();

// Generate new license key
router.post('/generate', (req, res) => {
  try {
    const { email, productId, domainAllowed, expiresIn = 365 } = req.body;

    if (!email || !productId) {
      return res.status(400).json({ error: 'Email and product ID are required' });
    }

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate license key
    const licenseKey = generateLicenseKey(product.slug);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    // Create or get user
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      const insertUser = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
      const result = insertUser.run(email, '', 'customer');
      user = { id: result.lastInsertRowid, email };
    }

    // Insert license
    const insertLicense = db.prepare(`
      INSERT INTO licenses (license_key, user_id, product_id, email, domain_allowed, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertLicense.run(
      licenseKey,
      user.id,
      productId,
      email,
      domainAllowed || null,
      expiresAt.toISOString()
    );

    // Log the action
    const logAction = db.prepare(`
      INSERT INTO license_logs (license_key, action, ip_address, details)
      VALUES (?, ?, ?, ?)
    `);
    logAction.run(licenseKey, 'generated', req.ip, `Generated for ${email}`);

    res.json({
      licenseKey,
      productName: product.name,
      email,
      domainAllowed,
      expiresAt: expiresAt.toISOString(),
      status: 'active'
    });

  } catch (error) {
    console.error('License generation error:', error);
    res.status(500).json({ error: 'Failed to generate license' });
  }
});

// Validate license key
router.post('/validate', (req, res) => {
  try {
    const { licenseKey, domain, productSlug } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ 
        valid: false, 
        error: 'License key is required' 
      });
    }

    if (!validateLicenseKeyFormat(licenseKey)) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid license key format' 
      });
    }

    // Get license with product info
    const license = db.prepare(`
      SELECT l.*, p.name as product_name, p.slug as product_slug, p.version
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.license_key = ?
    `).get(licenseKey);

    if (!license) {
      return res.status(404).json({ 
        valid: false, 
        error: 'License key not found' 
      });
    }

    // Check if license is revoked
    if (license.status === 'revoked') {
      return res.status(403).json({ 
        valid: false, 
        error: 'License has been revoked' 
      });
    }

    // Check expiration
    if (isLicenseExpired(license.expires_at)) {
      return res.status(403).json({ 
        valid: false, 
        error: 'License has expired' 
      });
    }

    // Check product match
    if (productSlug && license.product_slug !== productSlug) {
      return res.status(403).json({ 
        valid: false, 
        error: 'License not valid for this product' 
      });
    }

    // Check domain restrictions
    if (domain && license.domain_allowed) {
      if (!isValidDomain(domain)) {
        return res.status(400).json({ 
          valid: false, 
          error: 'Invalid domain format' 
        });
      }

      if (license.domain_allowed !== domain) {
        return res.status(403).json({ 
          valid: false, 
          error: 'Domain not authorized for this license' 
        });
      }
    }

    // Update last validated timestamp
    const updateLicense = db.prepare(`
      UPDATE licenses 
      SET last_validated = CURRENT_TIMESTAMP,
          domain_registered = COALESCE(domain_registered, ?)
      WHERE license_key = ?
    `);
    updateLicense.run(domain || null, licenseKey);

    // Log validation
    const logAction = db.prepare(`
      INSERT INTO license_logs (license_key, action, ip_address, user_agent, domain, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    logAction.run(
      licenseKey, 
      'validated', 
      req.ip, 
      req.get('User-Agent') || '', 
      domain || '', 
      'License validated successfully'
    );

    res.json({
      valid: true,
      licenseKey,
      productName: license.product_name,
      productVersion: license.version,
      email: license.email,
      expiresAt: license.expires_at,
      domainAllowed: license.domain_allowed,
      domainRegistered: license.domain_registered
    });

  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
});

// Revoke license
router.post('/revoke', (req, res) => {
  try {
    const { licenseKey, reason } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: 'License key is required' });
    }

    const license = db.prepare('SELECT * FROM licenses WHERE license_key = ?').get(licenseKey);
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Update license status
    const updateLicense = db.prepare('UPDATE licenses SET status = ? WHERE license_key = ?');
    updateLicense.run('revoked', licenseKey);

    // Log revocation
    const logAction = db.prepare(`
      INSERT INTO license_logs (license_key, action, ip_address, details)
      VALUES (?, ?, ?, ?)
    `);
    logAction.run(licenseKey, 'revoked', req.ip, reason || 'License revoked');

    res.json({ success: true, message: 'License revoked successfully' });

  } catch (error) {
    console.error('License revocation error:', error);
    res.status(500).json({ error: 'Failed to revoke license' });
  }
});

export { router as licenseRoutes };