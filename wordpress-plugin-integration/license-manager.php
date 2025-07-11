<?php
/**
 * WordPress Plugin License Manager Integration
 * 
 * This file provides the core functionality to integrate license validation
 * into your WordPress plugin.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class WP_License_Manager {
    
    private $license_server_url;
    private $product_slug;
    private $plugin_file;
    private $license_key_option;
    private $license_status_option;
    
    public function __construct($license_server_url, $product_slug, $plugin_file) {
        $this->license_server_url = trailingslashit($license_server_url);
        $this->product_slug = $product_slug;
        $this->plugin_file = $plugin_file;
        $this->license_key_option = $this->product_slug . '_license_key';
        $this->license_status_option = $this->product_slug . '_license_status';
        
        // Hook into WordPress
        add_action('admin_init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_license_menu'));
        add_action('admin_notices', array($this, 'license_notices'));
        
        // Check license status on plugin activation
        register_activation_hook($this->plugin_file, array($this, 'activate'));
        
        // Periodic license check
        add_action('wp_scheduled_event', array($this, 'check_license_status'));
        
        // Schedule daily license check
        if (!wp_next_scheduled('wp_license_check_' . $this->product_slug)) {
            wp_schedule_event(time(), 'daily', 'wp_license_check_' . $this->product_slug);
        }
        
        add_action('wp_license_check_' . $this->product_slug, array($this, 'check_license_status'));
    }
    
    /**
     * Initialize the license manager
     */
    public function init() {
        // Process license form submission
        if (isset($_POST['submit_license'])) {
            $this->process_license_form();
        }
        
        // Deactivate license on plugin deactivation
        register_deactivation_hook($this->plugin_file, array($this, 'deactivate'));
    }
    
    /**
     * Add license menu to WordPress admin
     */
    public function add_license_menu() {
        add_options_page(
            'License Settings',
            'License',
            'manage_options',
            $this->product_slug . '_license',
            array($this, 'license_page')
        );
    }
    
    /**
     * Display license settings page
     */
    public function license_page() {
        $license_key = get_option($this->license_key_option);
        $license_status = get_option($this->license_status_option);
        
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <form method="post" action="">
                <?php wp_nonce_field('license_nonce', 'license_nonce'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">License Key</th>
                        <td>
                            <input type="text" 
                                   name="license_key" 
                                   value="<?php echo esc_attr($license_key); ?>" 
                                   class="regular-text" 
                                   placeholder="Enter your license key" />
                            <p class="description">
                                Enter the license key you received after purchase.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">License Status</th>
                        <td>
                            <?php $this->display_license_status($license_status); ?>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Save License', 'primary', 'submit_license'); ?>
            </form>
            
            <div class="license-info">
                <h3>How to Use Your License</h3>
                <ol>
                    <li>Enter your license key in the field above</li>
                    <li>Click "Save License" to validate your key</li>
                    <li>Your premium features will be activated automatically</li>
                </ol>
                
                <p>
                    <strong>Need help?</strong> 
                    <a href="mailto:support@example.com">Contact Support</a>
                </p>
            </div>
        </div>
        
        <style>
        .license-status-active {
            color: #46b450;
            font-weight: bold;
        }
        .license-status-inactive {
            color: #dc3232;
            font-weight: bold;
        }
        .license-status-expired {
            color: #ffb900;
            font-weight: bold;
        }
        .license-info {
            margin-top: 20px;
            padding: 15px;
            background: #f1f1f1;
            border-radius: 5px;
        }
        </style>
        <?php
    }
    
    /**
     * Display license status with styling
     */
    private function display_license_status($status) {
        switch ($status) {
            case 'active':
                echo '<span class="license-status-active">✓ Active</span>';
                break;
            case 'expired':
                echo '<span class="license-status-expired">⚠ Expired</span>';
                break;
            case 'revoked':
                echo '<span class="license-status-inactive">✗ Revoked</span>';
                break;
            default:
                echo '<span class="license-status-inactive">✗ Inactive</span>';
        }
    }
    
    /**
     * Process license form submission
     */
    private function process_license_form() {
        if (!wp_verify_nonce($_POST['license_nonce'], 'license_nonce')) {
            wp_die('Security check failed');
        }
        
        $license_key = sanitize_text_field($_POST['license_key']);
        
        if (empty($license_key)) {
            add_settings_error('license_messages', 'license_error', 'Please enter a license key.', 'error');
            return;
        }
        
        // Validate license with server
        $validation_result = $this->validate_license($license_key);
        
        if ($validation_result['valid']) {
            update_option($this->license_key_option, $license_key);
            update_option($this->license_status_option, 'active');
            
            // Store license data in transient for caching
            set_transient($this->product_slug . '_license_data', $validation_result, DAY_IN_SECONDS);
            
            add_settings_error('license_messages', 'license_success', 'License activated successfully!', 'success');
        } else {
            update_option($this->license_status_option, 'inactive');
            delete_transient($this->product_slug . '_license_data');
            
            add_settings_error('license_messages', 'license_error', 
                'License validation failed: ' . $validation_result['error'], 'error');
        }
    }
    
    /**
     * Validate license key with the license server
     */
    public function validate_license($license_key, $check_domain = true) {
        $domain = $check_domain ? $this->get_site_domain() : null;
        
        $request_data = array(
            'licenseKey' => $license_key,
            'productSlug' => $this->product_slug,
            'domain' => $domain
        );
        
        $response = wp_remote_post($this->license_server_url . 'api/licenses/validate', array(
            'body' => json_encode($request_data),
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 15,
            'sslverify' => true
        ));
        
        if (is_wp_error($response)) {
            return array(
                'valid' => false,
                'error' => 'Connection to license server failed: ' . $response->get_error_message()
            );
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);
        
        if ($response_code !== 200) {
            return array(
                'valid' => false,
                'error' => isset($data['error']) ? $data['error'] : 'License validation failed'
            );
        }
        
        return array(
            'valid' => true,
            'data' => $data
        );
    }
    
    /**
     * Check if license is valid and active
     */
    public function is_license_valid() {
        $license_key = get_option($this->license_key_option);
        $license_status = get_option($this->license_status_option);
        
        if (empty($license_key) || $license_status !== 'active') {
            return false;
        }
        
        // Check cached license data
        $cached_data = get_transient($this->product_slug . '_license_data');
        if ($cached_data && isset($cached_data['valid']) && $cached_data['valid']) {
            return true;
        }
        
        // Validate with server if no cached data
        $validation_result = $this->validate_license($license_key);
        
        if ($validation_result['valid']) {
            set_transient($this->product_slug . '_license_data', $validation_result, DAY_IN_SECONDS);
            return true;
        } else {
            update_option($this->license_status_option, 'inactive');
            delete_transient($this->product_slug . '_license_data');
            return false;
        }
    }
    
    /**
     * Get the current site domain
     */
    private function get_site_domain() {
        $url = home_url();
        $parsed_url = parse_url($url);
        return isset($parsed_url['host']) ? $parsed_url['host'] : '';
    }
    
    /**
     * Scheduled license status check
     */
    public function check_license_status() {
        $license_key = get_option($this->license_key_option);
        
        if (empty($license_key)) {
            return;
        }
        
        $validation_result = $this->validate_license($license_key);
        
        if ($validation_result['valid']) {
            update_option($this->license_status_option, 'active');
            set_transient($this->product_slug . '_license_data', $validation_result, DAY_IN_SECONDS);
        } else {
            update_option($this->license_status_option, 'inactive');
            delete_transient($this->product_slug . '_license_data');
        }
    }
    
    /**
     * Display admin notices for license status
     */
    public function license_notices() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        $license_status = get_option($this->license_status_option);
        $current_screen = get_current_screen();
        
        if ($license_status !== 'active' && $current_screen->id !== 'settings_page_' . $this->product_slug . '_license') {
            ?>
            <div class="notice notice-warning">
                <p>
                    <strong>License Required:</strong> 
                    Please <a href="<?php echo admin_url('options-general.php?page=' . $this->product_slug . '_license'); ?>">activate your license</a> 
                    to access premium features.
                </p>
            </div>
            <?php
        }
    }
    
    /**
     * Plugin activation hook
     */
    public function activate() {
        // Check license status on activation
        $this->check_license_status();
    }
    
    /**
     * Plugin deactivation hook
     */
    public function deactivate() {
        // Clear scheduled events
        wp_clear_scheduled_hook('wp_license_check_' . $this->product_slug);
        
        // Clear cached license data
        delete_transient($this->product_slug . '_license_data');
    }
    
    /**
     * Get license information
     */
    public function get_license_info() {
        $cached_data = get_transient($this->product_slug . '_license_data');
        
        if ($cached_data && isset($cached_data['data'])) {
            return $cached_data['data'];
        }
        
        return null;
    }
    
    /**
     * Helper method to disable premium features
     */
    public function disable_premium_features() {
        // This method can be overridden by the plugin using this class
        // to disable specific premium features when license is invalid
    }
}

// Usage example in your main plugin file:
/*
// Initialize license manager
$license_manager = new WP_License_Manager(
    'https://your-license-server.com/', // License server URL
    'your-plugin-slug',                  // Product slug
    __FILE__                            // Main plugin file
);

// Check if license is valid before enabling premium features
if ($license_manager->is_license_valid()) {
    // Enable premium features
    add_action('init', 'enable_premium_features');
} else {
    // Show license prompt or disable premium features
    add_action('admin_notices', 'show_license_prompt');
}
*/