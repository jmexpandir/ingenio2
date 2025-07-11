import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'licenses.db'));

export function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      version TEXT DEFAULT '1.0.0',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create licenses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_key TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      domain_allowed TEXT,
      domain_registered TEXT,
      max_activations INTEGER DEFAULT 1,
      current_activations INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      last_validated DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Create license_logs table for audit trail
  db.exec(`
    CREATE TABLE IF NOT EXISTS license_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_key TEXT NOT NULL,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      domain TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Insert sample products
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, slug, version) VALUES (?, ?, ?)
  `);
  
  insertProduct.run('Advanced SEO Plugin', 'advanced-seo-plugin', '2.1.0');
  insertProduct.run('WooCommerce Booster', 'woocommerce-booster', '1.5.2');
  insertProduct.run('Security Shield Pro', 'security-shield-pro', '3.0.1');

  // Insert admin user (password: admin123)
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)
  `);
  
  insertUser.run('admin@example.com', '$2b$10$rQvHcYIKJFIGRbgPaAzF7u9BgJNGJCvEVGnJRCjGbgXJFJFJFJFJF', 'admin');
  insertUser.run('customer@example.com', '$2b$10$rQvHcYIKJFIGRbgPaAzF7u9BgJNGJCvEVGnJRCjGbgXJFJFJFJFJF', 'customer');

  console.log('Database initialized with sample data');
}

export { db };