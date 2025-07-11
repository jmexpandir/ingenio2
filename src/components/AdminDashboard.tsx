import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PluginManagement from './PluginManagement';
import { 
  Shield, 
  Key, 
  Users, 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  LogOut,
  Package
} from 'lucide-react';

interface License {
  id: number;
  license_key: string;
  email: string;
  product_name: string;
  status: string;
  expires_at: string;
  created_at: string;
  domain_registered: string;
}

interface Stats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, expired: 0, revoked: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchDashboardData = async () => {
    try {
      // Demo data - in production, this would fetch from your backend
      const demoLicenses = [
        {
          id: 1,
          license_key: 'WP-A1B2-C3D4-E5F6',
          email: 'customer@example.com',
          product_name: 'Advanced SEO Plugin',
          status: 'active',
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          domain_registered: 'example.com'
        },
        {
          id: 2,
          license_key: 'WP-B2C3-D4E5-F6G7',
          email: 'john@example.com',
          product_name: 'WooCommerce Booster',
          status: 'active',
          expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          domain_registered: 'shop.example.com'
        },
        {
          id: 3,
          license_key: 'WP-C3D4-E5F6-G7H8',
          email: 'expired@example.com',
          product_name: 'Security Shield Pro',
          status: 'expired',
          expires_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
          domain_registered: 'secure.example.com'
        }
      ];

      // Filter demo data based on search and status
      let filteredLicenses = demoLicenses;
      
      if (searchTerm) {
        filteredLicenses = filteredLicenses.filter(license => 
          license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          license.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredLicenses = filteredLicenses.filter(license => license.status === statusFilter);
      }

      setLicenses(filteredLicenses);
      setTotalPages(1);
      
      // Demo stats
      setStats({
        total: demoLicenses.length,
        active: demoLicenses.filter(l => l.status === 'active').length,
        expired: demoLicenses.filter(l => l.status === 'expired').length,
        revoked: demoLicenses.filter(l => l.status === 'revoked').length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Demo products data
      const demoProducts = [
        { id: 1, name: 'Advanced SEO Plugin' },
        { id: 2, name: 'WooCommerce Booster' },
        { id: 3, name: 'Security Shield Pro' },
        { id: 4, name: 'Performance Optimizer' },
        { id: 5, name: 'Backup Manager Pro' }
      ];
      setProducts(demoProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleGenerateLicense = async (formData: FormData) => {
    try {
      // Demo license generation
      const email = formData.get('email') as string;
      const productId = formData.get('productId') as string;
      
      if (email && productId) {
        alert(`Demo: License generated for ${email}!\nIn production, this would create a real license.`);
        setShowGenerateForm(false);
      }
    } catch (error) {
      console.error('Error generating license:', error);
    }
  };

  const handleRevokeLicense = async (licenseKey: string) => {
    if (!confirm('Are you sure you want to revoke this license?')) return;

    try {
      // Demo revocation
      alert(`Demo: License ${licenseKey} revoked!\nIn production, this would revoke the actual license.`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error revoking license:', error);
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
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
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('plugins')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'plugins'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Plugin Management
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'plugins' ? (
          <PluginManagement />
        ) : (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revoked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.revoked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search licenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchDashboardData()}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowGenerateForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate License
              </button>
            </div>
          </div>
        </div>

        {/* Licenses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {licenses.map((license) => (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{license.license_key}</div>
                      {license.domain_registered && (
                        <div className="text-xs text-gray-500">{license.domain_registered}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{license.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{license.product_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                        {getStatusIcon(license.status)}
                        <span className="ml-1 capitalize">{license.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {license.status === 'active' && (
                        <button
                          onClick={() => handleRevokeLicense(license.license_key)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Generate License Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New License</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleGenerateLicense(new FormData(e.target as HTMLFormElement));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    name="productId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain (Optional)
                  </label>
                  <input
                    type="text"
                    name="domainAllowed"
                    placeholder="example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    name="expiresIn"
                    defaultValue={365}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;