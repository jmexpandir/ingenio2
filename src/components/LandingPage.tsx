import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Key, 
  Users, 
  BarChart3, 
  Lock, 
  Globe, 
  Clock, 
  CheckCircle,
  Download,
  ChevronRight,
  Package
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">WP License Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure License Management
              <span className="block text-blue-600">for WordPress Plugins</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Protect your WordPress plugins with professional license management. 
              Generate, validate, and manage licenses with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your WordPress plugin licenses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">License Generation</h3>
              <p className="text-gray-600">
                Generate secure, unique license keys with custom formats and expiration dates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">License Validation</h3>
              <p className="text-gray-600">
                Real-time license validation with domain binding and activation limits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Complete customer dashboard for license management and renewals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">
                Comprehensive analytics and reporting for license usage and trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Security First</h3>
              <p className="text-gray-600">
                Built with security in mind, featuring rate limiting and audit trails.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">REST API</h3>
              <p className="text-gray-600">
                Complete REST API for seamless integration with your existing systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plugins Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium WordPress Plugins
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Supercharge your WordPress site with our professionally crafted plugins. 
              Trusted by thousands of developers worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Plugin Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Advanced SEO Plugin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Bestseller
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    $79
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced SEO Plugin</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Complete SEO solution with advanced meta tags, XML sitemaps, and analytics dashboard.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      15.4k
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-yellow-500" />
                      4.8
                    </span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    SEO & Marketing
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/marketplace"
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Plugin Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="WooCommerce Booster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Popular
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    $99
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">WooCommerce Booster</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Enhance your WooCommerce store with advanced features and powerful analytics.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      8.9k
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-yellow-500" />
                      4.6
                    </span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    E-commerce
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/marketplace"
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Plugin Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-red-500 to-pink-600 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Security Shield Pro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🛡️ Secure
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    $149
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Security Shield Pro</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Advanced security features to protect your WordPress site from threats.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      12.2k
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-yellow-500" />
                      4.9
                    </span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Security
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/marketplace"
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/marketplace"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Plugins
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Plugin Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plugin Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect plugin for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Link
              to="/marketplace?category=seo"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-center"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                SEO & Marketing
              </h3>
              <p className="text-sm text-gray-500 mt-1">12 plugins</p>
            </Link>

            <Link
              to="/marketplace?category=ecommerce"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 text-center"
            >
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                E-commerce
              </h3>
              <p className="text-sm text-gray-500 mt-1">8 plugins</p>
            </Link>

            <Link
              to="/marketplace?category=security"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-200 text-center"
            >
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                Security
              </h3>
              <p className="text-sm text-gray-500 mt-1">6 plugins</p>
            </Link>

            <Link
              to="/marketplace?category=performance"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 text-center"
            >
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Performance
              </h3>
              <p className="text-sm text-gray-500 mt-1">5 plugins</p>
            </Link>

            <Link
              to="/marketplace?category=backup"
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all duration-200 text-center"
            >
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                Backup
              </h3>
              <p className="text-sm text-gray-500 mt-1">4 plugins</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of satisfied customers who trust our plugins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Active Installations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.8★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">35+</div>
              <div className="text-blue-100">Premium Plugins</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple three-step process to secure your WordPress plugins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Licenses</h3>
              <p className="text-gray-600">
                Create secure license keys for your customers with custom expiration dates and domain restrictions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrate Plugin</h3>
              <p className="text-gray-600">
                Add our validation code to your WordPress plugin to check licenses in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage & Monitor</h3>
              <p className="text-gray-600">
                Monitor license usage, manage renewals, and track analytics from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">WP License Manager</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2024 WP License Manager. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;