-- WordPress Plugin License Management System
-- Database Schema for SQLite/MySQL

-- Users table (for customers and admins)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table (WordPress plugins)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    price DECIMAL(10,2) DEFAULT 0.00,
    active INTEGER DEFAULT 1,
    download_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Licenses table (main license data)
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
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- License logs table (audit trail)
CREATE TABLE IF NOT EXISTS license_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    domain TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- License activations table (track domain activations)
CREATE TABLE IF NOT EXISTS license_activations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT NOT NULL,
    domain TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    first_activated DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1,
    UNIQUE(license_key, domain)
);

-- License renewals table (track renewals and payments)
CREATE TABLE IF NOT EXISTS license_renewals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT NOT NULL,
    old_expires_at DATETIME,
    new_expires_at DATETIME,
    renewal_period INTEGER, -- in days
    payment_amount DECIMAL(10,2),
    payment_method TEXT,
    payment_reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email notifications table (track sent emails)
CREATE TABLE IF NOT EXISTS email_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'expiry_warning', 'expired', 'renewed', etc.
    recipient_email TEXT NOT NULL,
    subject TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'sent' -- 'sent', 'failed', 'pending'
);

-- API keys table (for webhook integrations)
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    permissions TEXT, -- JSON array of permissions
    last_used DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    active INTEGER DEFAULT 1
);

-- Settings table (system configuration)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires ON licenses(expires_at);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_license_logs_key ON license_logs(license_key);
CREATE INDEX IF NOT EXISTS idx_license_logs_action ON license_logs(action);
CREATE INDEX IF NOT EXISTS idx_license_activations_key ON license_activations(license_key);
CREATE INDEX IF NOT EXISTS idx_license_activations_domain ON license_activations(domain);

-- Insert sample data
INSERT OR IGNORE INTO products (name, slug, description, version, price) VALUES
('Advanced SEO Plugin', 'advanced-seo-plugin', 'Complete SEO solution for WordPress', '2.1.0', 79.00),
('WooCommerce Booster', 'woocommerce-booster', 'Enhance your WooCommerce store', '1.5.2', 99.00),
('Security Shield Pro', 'security-shield-pro', 'Advanced security features', '3.0.1', 149.00),
('Performance Optimizer', 'performance-optimizer', 'Speed up your WordPress site', '1.2.3', 59.00),
('Backup Manager Pro', 'backup-manager-pro', 'Automated backup solution', '2.0.0', 89.00);

-- Insert sample admin user (password: admin123)
INSERT OR IGNORE INTO users (email, password, role, first_name, last_name) VALUES
('admin@example.com', '$2b$10$rQvHcYIKJFIGRbgPaAzF7u9BgJNGJCvEVGnJRCjGbgXJFJFJFJFJF', 'admin', 'Admin', 'User');

-- Insert sample customer (password: customer123)
INSERT OR IGNORE INTO users (email, password, role, first_name, last_name) VALUES
('customer@example.com', '$2b$10$rQvHcYIKJFIGRbgPaAzF7u9BgJNGJCvEVGnJRCjGbgXJFJFJFJFJF', 'customer', 'John', 'Doe');

-- Insert sample license
INSERT OR IGNORE INTO licenses (license_key, user_id, product_id, email, status, expires_at) VALUES
('WP-A1B2-C3D4-E5F6', 2, 1, 'customer@example.com', 'active', date('now', '+365 days'));

-- Insert sample settings
INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES
('site_name', 'WP License Manager'),
('admin_email', 'admin@example.com'),
('license_expiry_warning_days', '30'),
('max_activations_per_license', '1'),
('enable_domain_verification', '1'),
('enable_email_notifications', '1');

-- Views for common queries
CREATE VIEW IF NOT EXISTS license_overview AS
SELECT 
    l.license_key,
    l.email,
    l.status,
    l.created_at,
    l.expires_at,
    l.domain_registered,
    p.name as product_name,
    p.slug as product_slug,
    p.version as product_version,
    u.first_name,
    u.last_name,
    CASE 
        WHEN l.expires_at IS NULL THEN 'never'
        WHEN l.expires_at < datetime('now') THEN 'expired'
        WHEN l.expires_at < datetime('now', '+30 days') THEN 'expiring_soon'
        ELSE 'active'
    END as expiry_status
FROM licenses l
JOIN products p ON l.product_id = p.id
JOIN users u ON l.user_id = u.id;

-- Function to clean up old logs (for databases that support it)
-- This would be implemented in the application layer for SQLite

-- Triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
    AFTER UPDATE ON products
    FOR EACH ROW
    BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_settings_timestamp 
    AFTER UPDATE ON settings
    FOR EACH ROW
    BEGIN
        UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;