import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get customer licenses
router.get('/licenses/:email', (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const licenses = db.prepare(`
      SELECT l.*, p.name as product_name, p.slug as product_slug, p.version
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.email = ?
      ORDER BY l.created_at DESC
    `).all(email);

    res.json(licenses);

  } catch (error) {
    console.error('Error fetching customer licenses:', error);
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

// Register domain for license
router.post('/licenses/:licenseKey/register-domain', (req, res) => {
  try {
    const { licenseKey } = req.params;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const license = db.prepare('SELECT * FROM licenses WHERE license_key = ?').get(licenseKey);
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Update domain registration
    const updateLicense = db.prepare('UPDATE licenses SET domain_registered = ? WHERE license_key = ?');
    updateLicense.run(domain, licenseKey);

    res.json({ success: true, message: 'Domain registered successfully' });

  } catch (error) {
    console.error('Domain registration error:', error);
    res.status(500).json({ error: 'Failed to register domain' });
  }
});

export { router as customerRoutes };