import express from 'express';
import { db } from '../database.js';
import { generateLicenseKey, addDaysToDate } from '../utils/licenseGenerator.js';

const router = express.Router();

// Simple auth middleware (in production, use proper JWT validation)
const requireAdmin = (req, res, next) => {
  // In production, validate JWT token and check role
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get all licenses with pagination
router.get('/licenses', requireAdmin, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = `
      SELECT l.*, p.name as product_name, p.slug as product_slug,
             u.email as user_email
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];

    if (search) {
      query += ` AND (l.license_key LIKE ? OR l.email LIKE ? OR p.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ` AND l.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const licenses = db.prepare(query).all(...params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (l.license_key LIKE ? OR l.email LIKE ? OR p.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      countQuery += ` AND l.status = ?`;
      countParams.push(status);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

// Get license statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM licenses').get().count,
      active: db.prepare('SELECT COUNT(*) as count FROM licenses WHERE status = ?').get('active').count,
      expired: db.prepare('SELECT COUNT(*) as count FROM licenses WHERE expires_at < datetime("now")').get().count,
      revoked: db.prepare('SELECT COUNT(*) as count FROM licenses WHERE status = ?').get('revoked').count
    };

    // Get recent activity
    const recentActivity = db.prepare(`
      SELECT license_key, action, created_at, details
      FROM license_logs
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    // Get product distribution
    const productStats = db.prepare(`
      SELECT p.name, COUNT(l.id) as count
      FROM products p
      LEFT JOIN licenses l ON p.id = l.product_id
      GROUP BY p.id, p.name
    `).all();

    res.json({
      stats,
      recentActivity,
      productStats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Generate bulk licenses
router.post('/licenses/bulk', requireAdmin, (req, res) => {
  try {
    const { emails, productId, expiresIn = 365 } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Email array is required' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const results = [];
    const expiresAt = addDaysToDate(new Date(), expiresIn);

    for (const email of emails) {
      try {
        // Create or get user
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
          const insertUser = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
          const result = insertUser.run(email, '', 'customer');
          user = { id: result.lastInsertRowid, email };
        }

        // Generate license
        const licenseKey = generateLicenseKey(product.slug);
        
        const insertLicense = db.prepare(`
          INSERT INTO licenses (license_key, user_id, product_id, email, expires_at)
          VALUES (?, ?, ?, ?, ?)
        `);

        insertLicense.run(licenseKey, user.id, productId, email, expiresAt.toISOString());

        results.push({
          email,
          licenseKey,
          status: 'success'
        });

      } catch (error) {
        results.push({
          email,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({ results });

  } catch (error) {
    console.error('Bulk license generation error:', error);
    res.status(500).json({ error: 'Failed to generate bulk licenses' });
  }
});

// Get all products
router.get('/products', requireAdmin, (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY name').all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export { router as adminRoutes };