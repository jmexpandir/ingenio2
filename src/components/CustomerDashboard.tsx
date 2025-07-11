import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Key, 
  Download, 
  Calendar, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface License {
  id: number;
  license_key: string;
  product_name: string;
  product_slug: string;
  version: string;
  status: string;
  expires_at: string;
  created_at: string;
  domain_registered: string;
  domain_allowed: string;
}

function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterDomain, setShowRegisterDomain] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerLicenses();
  }, []);

  const fetchCustomerLicenses = async () => {
    try {
      // Demo customer licenses data
      const demoLicenses = [
        {
          id: 1,
          license_key: 'WP-A1B2-C3D4-E5F6',
          product_name: 'Advanced SEO Plugin',
          product_slug: 'advanced-seo-plugin',
          version: '2.1.0',
          status: 'active',
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          domain_registered: 'example.com',
          domain_allowed: 'example.com'
        },
        {
          id: 2,
          license_key: 'WP-B2C3-D4E5-F6G7',
          product_name: 'WooCommerce Booster',
          product_slug: 'woocommerce-booster',
          version: '1.5.2',
          status: 'active',
          expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          domain_registered: '',
          domain_allowed: ''
        }
      ];
      
      setLicenses(demoLicenses);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDomain = async (licenseKey: string, domain: string) => {
    try {
      // Demo domain registration
      alert(`Demo: Domain ${domain} registered for license ${licenseKey}!\nIn production, this would register the actual domain.`);
      setShowRegisterDomain(null);
      fetchCustomerLicenses();
    } catch (error) {
      console.error('Error registering domain:', error);
    }
  };

  const handleDownloadPlugin = async (license: License) => {
    try {
      // In production, this would:
      // 1. Validate the license is still active
      // 2. Log the download for analytics
      // 3. Provide the actual plugin file
      
      // For demo purposes, we'll create a sample download
      const pluginContent = `
<?php
/**
 * Plugin Name: ${license.product_name}
 * Description: Licensed plugin for ${license.email}
 * Version: ${license.version}
 * License: ${license.license_key}
 */

// Your plugin code would go here
echo "Hello from ${license.product_name}!";
?>
      `;
      
      const blob = new Blob([pluginContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${license.product_slug}-v${license.version}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert(`Demo: ${license.product_name} downloaded successfully!\nIn production, this would download the actual plugin file.`);
      
    } catch (error) {
      console.error('Error downloading plugin:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'revoked': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">My Licenses</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your License Dashboard</h1>
          <p className="text-blue-100 text-lg">
            Manage your WordPress plugin licenses and downloads in one place.
          </p>
        </div>

        {/* Licenses Grid */}
        {licenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Key className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Licenses Found</h3>
            <p className="text-gray-600">
              You don't have any licenses yet. Contact support to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license) => (
              <div key={license.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{license.product_name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(license.status)}`}>
                      {getStatusIcon(license.status)}
                      <span className="ml-1 capitalize">{license.status}</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Key className="h-4 w-4 mr-2" />
                      <span className="font-mono text-xs">{license.license_key}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {license.expires_at ? (
                          <>
                            Expires: {new Date(license.expires_at).toLocaleDateString()}
                            {isExpired(license.expires_at) && (
                              <span className="ml-2 text-red-600 font-medium">(Expired)</span>
                            )}
                          </>
                        ) : (
                          'Never expires'
                        )}
                      </span>
                    </div>

                    {license.domain_registered && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <span>Registered: {license.domain_registered}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Version: {license.version}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <button
                      disabled={license.status !== 'active'}
                      onClick={() => handleDownloadPlugin(license)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Plugin
                    </button>

                    {license.status === 'active' && !license.domain_registered && (
                      <button
                        onClick={() => setShowRegisterDomain(license.license_key)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Register Domain
                      </button>
                    )}

                    <a
                      href={`https://docs.example.com/${license.product_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentation
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Installation Guide</h3>
              <p className="text-gray-600 text-sm mb-3">
                Learn how to install and activate your plugins with your license key.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Installation Guide →
              </a>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm mb-3">
                Contact our support team for help with your licenses and plugins.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Register Domain Modal */}
      {showRegisterDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Register Domain</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const domain = formData.get('domain') as string;
              handleRegisterDomain(showRegisterDomain, domain);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Name
                </label>
                <input
                  type="text"
                  name="domain"
                  placeholder="example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the domain where you'll use this license (without http:// or https://)
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterDomain(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;