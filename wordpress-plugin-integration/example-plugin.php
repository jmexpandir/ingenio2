<?php
/**
 * Plugin Name: Example Premium Plugin
 * Description: Example WordPress plugin with license management integration
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include the license manager
require_once plugin_dir_path(__FILE__) . 'license-manager.php';

class Example_Premium_Plugin {
    
    private $license_manager;
    
    public function __construct() {
        // Initialize license manager
        $this->license_manager = new WP_License_Manager(
            'https://your-license-server.com/', // Replace with your actual license server URL
            'example-premium-plugin',           // Your product slug
            __FILE__                           // Main plugin file
        );
        
        // Hook into WordPress
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Add shortcode
        add_shortcode('example_premium', array($this, 'premium_shortcode'));
        
        // Add AJAX handlers for premium features
        add_action('wp_ajax_example_premium_action', array($this, 'handle_premium_ajax'));
        add_action('wp_ajax_nopriv_example_premium_action', array($this, 'handle_premium_ajax'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Check if license is valid
        if (!$this->license_manager->is_license_valid()) {
            // Disable premium features or show warnings
            add_action('admin_notices', array($this, 'license_warning'));
            return;
        }
        
        // License is valid, enable premium features
        $this->enable_premium_features();
    }
    
    /**
     * Enable premium features
     */
    private function enable_premium_features() {
        // Add premium hooks, filters, and functionality here
        add_filter('the_content', array($this, 'add_premium_content'));
        add_action('wp_footer', array($this, 'add_premium_footer'));
        
        // Register premium post types, taxonomies, etc.
        add_action('init', array($this, 'register_premium_post_types'));
    }
    
    /**
     * Show license warning
     */
    public function license_warning() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        $license_page_url = admin_url('options-general.php?page=example-premium-plugin_license');
        ?>
        <div class="notice notice-warning is-dismissible">
            <p>
                <strong>Example Premium Plugin:</strong> 
                <a href="<?php echo esc_url($license_page_url); ?>">Please activate your license</a> 
                to access premium features.
            </p>
        </div>
        <?php
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'Example Premium',
            'Example Premium',
            'manage_options',
            'example-premium',
            array($this, 'admin_page'),
            'dashicons-star-filled',
            30
        );
    }
    
    /**
     * Admin page
     */
    public function admin_page() {
        $is_licensed = $this->license_manager->is_license_valid();
        $license_info = $this->license_manager->get_license_info();
        ?>
        <div class="wrap">
            <h1>Example Premium Plugin</h1>
            
            <div class="license-status-card">
                <h2>License Status</h2>
                <?php if ($is_licensed): ?>
                    <div class="license-active">
                        <p><strong>✓ License Active</strong></p>
                        <?php if ($license_info): ?>
                            <p>Product: <?php echo esc_html($license_info['productName']); ?></p>
                            <p>Version: <?php echo esc_html($license_info['productVersion']); ?></p>
                            <?php if (isset($license_info['expiresAt'])): ?>
                                <p>Expires: <?php echo esc_html(date('F j, Y', strtotime($license_info['expiresAt']))); ?></p>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <div class="license-inactive">
                        <p><strong>✗ License Inactive</strong></p>
                        <p>
                            <a href="<?php echo admin_url('options-general.php?page=example-premium-plugin_license'); ?>" 
                               class="button button-primary">
                                Activate License
                            </a>
                        </p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="premium-features">
                <h2>Premium Features</h2>
                
                <?php if ($is_licensed): ?>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Advanced Analytics</h3>
                            <p>Track detailed user engagement and conversion metrics.</p>
                            <button class="button button-primary" onclick="activateAnalytics()">
                                Activate Analytics
                            </button>
                        </div>
                        
                        <div class="feature-card">
                            <h3>Custom Layouts</h3>
                            <p>Design custom layouts with our drag-and-drop builder.</p>
                            <button class="button button-primary" onclick="openLayoutBuilder()">
                                Open Builder
                            </button>
                        </div>
                        
                        <div class="feature-card">
                            <h3>Advanced Integrations</h3>
                            <p>Connect with popular third-party services and APIs.</p>
                            <button class="button button-primary" onclick="manageIntegrations()">
                                Manage Integrations
                            </button>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="features-locked">
                        <p>🔒 Premium features are locked. Please activate your license to access:</p>
                        <ul>
                            <li>Advanced Analytics Dashboard</li>
                            <li>Custom Layout Builder</li>
                            <li>Third-party Integrations</li>
                            <li>Priority Support</li>
                            <li>Automatic Updates</li>
                        </ul>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <style>
        .license-status-card {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }
        .license-active {
            color: #46b450;
        }
        .license-inactive {
            color: #dc3232;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .feature-card {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
        }
        .features-locked {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
            margin-top: 20px;
        }
        .features-locked ul {
            margin: 10px 0;
        }
        </style>
        
        <script>
        function activateAnalytics() {
            // Premium feature function
            alert('Analytics activated! (Premium Feature)');
        }
        
        function openLayoutBuilder() {
            // Premium feature function
            alert('Layout Builder opened! (Premium Feature)');
        }
        
        function manageIntegrations() {
            // Premium feature function
            alert('Integrations manager opened! (Premium Feature)');
        }
        </script>
        <?php
    }
    
    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        if ($this->license_manager->is_license_valid()) {
            wp_enqueue_script('example-premium-script', 
                plugins_url('js/premium-features.js', __FILE__), 
                array('jquery'), 
                '1.0.0', 
                true
            );
            
            wp_enqueue_style('example-premium-style', 
                plugins_url('css/premium-features.css', __FILE__), 
                array(), 
                '1.0.0'
            );
        }
    }
    
    /**
     * Premium shortcode
     */
    public function premium_shortcode($atts) {
        if (!$this->license_manager->is_license_valid()) {
            return '<div class="premium-locked">🔒 Premium feature - License required</div>';
        }
        
        $atts = shortcode_atts(array(
            'type' => 'default',
            'color' => 'blue',
        ), $atts);
        
        ob_start();
        ?>
        <div class="premium-widget premium-<?php echo esc_attr($atts['type']); ?>">
            <h3>Premium Widget</h3>
            <p>This is a premium feature only available to licensed users.</p>
            <div class="premium-content" style="color: <?php echo esc_attr($atts['color']); ?>;">
                <p>Advanced premium content goes here...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Add premium content to posts
     */
    public function add_premium_content($content) {
        if (!$this->license_manager->is_license_valid()) {
            return $content;
        }
        
        if (is_single() && in_the_loop() && is_main_query()) {
            $premium_content = '<div class="premium-content-addon">';
            $premium_content .= '<h4>Premium Content</h4>';
            $premium_content .= '<p>This additional content is only shown to licensed users.</p>';
            $premium_content .= '</div>';
            
            $content .= $premium_content;
        }
        
        return $content;
    }
    
    /**
     * Add premium footer
     */
    public function add_premium_footer() {
        if (!$this->license_manager->is_license_valid()) {
            return;
        }
        
        echo '<div class="premium-footer">Premium features enabled</div>';
    }
    
    /**
     * Register premium post types
     */
    public function register_premium_post_types() {
        register_post_type('premium_portfolio', array(
            'labels' => array(
                'name' => 'Premium Portfolio',
                'singular_name' => 'Portfolio Item',
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail'),
            'menu_icon' => 'dashicons-portfolio',
        ));
    }
    
    /**
     * Handle premium AJAX requests
     */
    public function handle_premium_ajax() {
        if (!$this->license_manager->is_license_valid()) {
            wp_send_json_error('License required for premium features');
        }
        
        // Handle premium AJAX functionality
        $action = sanitize_text_field($_POST['premium_action']);
        
        switch ($action) {
            case 'get_analytics':
                $data = array(
                    'visits' => 1250,
                    'conversions' => 45,
                    'revenue' => 2340.50
                );
                wp_send_json_success($data);
                break;
                
            default:
                wp_send_json_error('Unknown action');
        }
    }
}

// Initialize the plugin
new Example_Premium_Plugin();

// Plugin activation hook
register_activation_hook(__FILE__, function() {
    // Create any necessary database tables or options
    add_option('example_premium_plugin_version', '1.0.0');
});

// Plugin deactivation hook
register_deactivation_hook(__FILE__, function() {
    // Cleanup scheduled events
    wp_clear_scheduled_hook('wp_license_check_example-premium-plugin');
});