# WordPress Plugin License Management System

A comprehensive license management platform for WordPress plugin developers to protect, manage, and monetize their plugins.

## Features

### 🔐 License Management
- **Secure License Generation**: Create unique, tamper-proof license keys
- **Real-time Validation**: Instant license verification with domain binding
- **Flexible Expiration**: Set custom expiration dates or lifetime licenses
- **Activation Limits**: Control how many sites can use each license
- **Bulk Operations**: Generate multiple licenses at once

### 👥 User Management
- **Admin Dashboard**: Comprehensive admin interface for license management
- **Customer Portal**: Self-service dashboard for customers
- **Role-based Access**: Separate admin and customer permissions
- **User Registration**: Automatic user creation on license generation

### 📊 Analytics & Reporting
- **License Statistics**: Track active, expired, and revoked licenses
- **Usage Analytics**: Monitor license validation patterns
- **Audit Trail**: Complete log of all license activities
- **Export Options**: Export license data and reports

### 🛡️ Security Features
- **Rate Limiting**: Prevent abuse of validation endpoints
- **Domain Verification**: Bind licenses to specific domains
- **Secure Headers**: Helmet.js security middleware
- **CORS Protection**: Configurable cross-origin policies

### 🔌 WordPress Integration
- **Easy Integration**: Drop-in PHP class for WordPress plugins
- **Automatic Validation**: Background license checking
- **Feature Gating**: Disable premium features for unlicensed users
- **Admin Notices**: User-friendly license prompts

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wp-license-manager.git
cd wp-license-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 2. Configuration

The system uses environment variables for configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database (SQLite is used by default)
DATABASE_PATH=./server/licenses.db

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# License Server URL for WordPress integration
LICENSE_SERVER_URL=https://your-domain.com
```

### 3. WordPress Plugin Integration

1. Copy the `wordpress-plugin-integration` folder to your plugin directory
2. Include the license manager in your main plugin file:

```php
<?php
// Include the license manager
require_once plugin_dir_path(__FILE__) . 'license-manager.php';

// Initialize license manager
$license_manager = new WP_License_Manager(
    'https://your-license-server.com/',
    'your-plugin-slug',
    __FILE__
);

// Check license before enabling features
if ($license_manager->is_license_valid()) {
    // Enable premium features
    add_action('init', 'enable_premium_features');
}
```

## API Endpoints

### License Operations

#### Generate License
```http
POST /api/licenses/generate
Content-Type: application/json

{
  "email": "customer@example.com",
  "productId": 1,
  "domainAllowed": "example.com",
  "expiresIn": 365
}
```

#### Validate License
```http
POST /api/licenses/validate
Content-Type: application/json

{
  "licenseKey": "WP-A1B2-C3D4-E5F6",
  "domain": "example.com",
  "productSlug": "your-plugin-slug"
}
```

#### Revoke License
```http
POST /api/licenses/revoke
Content-Type: application/json

{
  "licenseKey": "WP-A1B2-C3D4-E5F6",
  "reason": "Refund requested"
}
```

### Admin Operations

#### Get All Licenses
```http
GET /api/admin/licenses?page=1&limit=10&search=email@example.com&status=active
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Bulk Generate Licenses
```http
POST /api/admin/licenses/bulk
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "emails": ["user1@example.com", "user2@example.com"],
  "productId": 1,
  "expiresIn": 365
}
```

## Database Schema

The system uses SQLite by default but can be adapted for MySQL/PostgreSQL. Key tables include:

- **users**: Customer and admin accounts
- **products**: WordPress plugins/products
- **licenses**: License keys and metadata
- **license_logs**: Audit trail of all license activities
- **license_activations**: Track domain activations

See `database-schema.sql` for the complete schema.

## WordPress Plugin Integration

### Basic Integration

```php
// In your main plugin file
class Your_Plugin {
    private $license_manager;
    
    public function __construct() {
        $this->license_manager = new WP_License_Manager(
            'https://your-license-server.com/',
            'your-plugin-slug',
            __FILE__
        );
        
        // Only enable premium features if licensed
        if ($this->license_manager->is_license_valid()) {
            $this->enable_premium_features();
        }
    }
    
    private function enable_premium_features() {
        // Add premium functionality here
        add_action('init', array($this, 'register_premium_features'));
    }
}
```

### Advanced Features

```php
// Check license info
$license_info = $license_manager->get_license_info();
if ($license_info) {
    echo "Licensed to: " . $license_info['email'];
    echo "Expires: " . $license_info['expiresAt'];
}

// Validate specific features
if ($license_manager->is_license_valid()) {
    // Enable advanced analytics
    add_action('wp_dashboard_setup', 'add_premium_dashboard_widgets');
}
```

## Security Best Practices

1. **Use HTTPS**: Always serve the license server over HTTPS
2. **Rate Limiting**: Implement rate limiting on validation endpoints
3. **Domain Verification**: Bind licenses to specific domains
4. **Secure Storage**: Store license keys securely in WordPress options
5. **Regular Updates**: Keep the license system updated

## Customization

### Adding New Product Types

1. Insert new products in the database:
```sql
INSERT INTO products (name, slug, version, price) 
VALUES ('New Plugin', 'new-plugin', '1.0.0', 99.00);
```

2. Update the admin interface to include the new product in dropdowns

### Custom License Key Format

Modify the `generateLicenseKey` function in `server/utils/licenseGenerator.js`:

```javascript
export function generateLicenseKey(productSlug = 'WP') {
    // Custom format: PROD-YYYY-XXXX-XXXX
    const year = new Date().getFullYear();
    const segments = [];
    
    for (let i = 0; i < 2; i++) {
        segments.push(crypto.randomBytes(2).toString('hex').toUpperCase());
    }
    
    return `${productSlug.toUpperCase()}-${year}-${segments.join('-')}`;
}
```

### Email Notifications

Add email notifications for license expiry:

```javascript
// In your server code
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendExpiryWarning(email, licenseKey, expiryDate) {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'License Expiry Warning',
        html: `Your license ${licenseKey} expires on ${expiryDate}`
    });
}
```

## Deployment

### Production Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use PostgreSQL or MySQL for production
3. **SSL Certificate**: Ensure HTTPS is configured
4. **Process Manager**: Use PM2 or similar for Node.js process management
5. **Reverse Proxy**: Use Nginx or Apache as reverse proxy

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **License Validation Fails**
   - Check network connectivity
   - Verify license server URL
   - Ensure license key format is correct

2. **Database Connection Issues**
   - Check database file permissions
   - Verify database path in configuration

3. **CORS Errors**
   - Update CORS configuration in server
   - Ensure correct origin URLs

### Debug Mode

Enable debug logging:

```javascript
// In your server configuration
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, req.body);
        next();
    });
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@example.com
- Documentation: https://docs.example.com
- Issues: https://github.com/yourusername/wp-license-manager/issues

## Changelog

### v1.0.0
- Initial release
- Basic license generation and validation
- Admin and customer dashboards
- WordPress plugin integration
- SQLite database support
- Rate limiting and security features