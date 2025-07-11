import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Save, 
  X, 
  Package,
  DollarSign,
  Tag,
  FileText,
  Image,
  Globe,
  Download,
  Star,
  Users,
  Calendar
} from 'lucide-react';

interface Plugin {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  version: string;
  price: number;
  category: string;
  tags: string[];
  features: string[];
  requirements: {
    wordpress: string;
    php: string;
    mysql: string;
  };
  images: string[];
  demoUrl: string;
  documentationUrl: string;
  downloadUrl: string;
  active: boolean;
  featured: boolean;
  bestseller: boolean;
  downloads: number;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at: string;
}

const categories = [
  'SEO & Marketing',
  'E-commerce',
  'Security',
  'Performance',
  'Backup & Migration',
  'Forms & Surveys',
  'Social Media',
  'Analytics',
  'Content Management',
  'Design & Layout'
];

function PluginManagement() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<Plugin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      // Demo plugins data
      const demoPlugins: Plugin[] = [
        {
          id: 1,
          name: 'Advanced SEO Plugin',
          slug: 'advanced-seo-plugin',
          description: 'Complete SEO solution for WordPress with advanced features',
          longDescription: 'Transform your WordPress site into an SEO powerhouse with our comprehensive plugin. Features include advanced meta tag management, XML sitemaps, schema markup, social media optimization, and detailed SEO analytics.',
          version: '2.1.0',
          price: 79.00,
          category: 'SEO & Marketing',
          tags: ['seo', 'optimization', 'meta-tags', 'sitemaps'],
          features: [
            'Advanced Meta Tag Management',
            'XML Sitemap Generation',
            'Schema Markup Integration',
            'Social Media Optimization',
            'SEO Analytics Dashboard',
            'Keyword Tracking',
            'Content Analysis',
            'Local SEO Features'
          ],
          requirements: {
            wordpress: '5.0+',
            php: '7.4+',
            mysql: '5.6+'
          },
          images: [
            'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          demoUrl: 'https://demo.example.com/seo-plugin',
          documentationUrl: 'https://docs.example.com/seo-plugin',
          downloadUrl: 'https://downloads.example.com/seo-plugin.zip',
          active: true,
          featured: true,
          bestseller: true,
          downloads: 15420,
          rating: 4.8,
          reviews: 342,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'WooCommerce Booster',
          slug: 'woocommerce-booster',
          description: 'Enhance your WooCommerce store with powerful features',
          longDescription: 'Supercharge your WooCommerce store with advanced features including bulk pricing, advanced product filters, wishlist functionality, and comprehensive analytics.',
          version: '1.5.2',
          price: 99.00,
          category: 'E-commerce',
          tags: ['woocommerce', 'ecommerce', 'shop', 'sales'],
          features: [
            'Bulk Pricing Rules',
            'Advanced Product Filters',
            'Wishlist Functionality',
            'Quick View Products',
            'Sales Analytics',
            'Inventory Management',
            'Customer Segmentation',
            'Abandoned Cart Recovery'
          ],
          requirements: {
            wordpress: '5.0+',
            php: '7.4+',
            mysql: '5.6+'
          },
          images: [
            'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          demoUrl: 'https://demo.example.com/woo-booster',
          documentationUrl: 'https://docs.example.com/woo-booster',
          downloadUrl: 'https://downloads.example.com/woo-booster.zip',
          active: true,
          featured: false,
          bestseller: false,
          downloads: 8930,
          rating: 4.6,
          reviews: 187,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setPlugins(demoPlugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    }
  };

  const handleSavePlugin = async (pluginData: Partial<Plugin>) => {
    setLoading(true);
    try {
      if (editingPlugin) {
        // Update existing plugin
        const updatedPlugins = plugins.map(plugin =>
          plugin.id === editingPlugin.id
            ? { ...plugin, ...pluginData, updated_at: new Date().toISOString() }
            : plugin
        );
        setPlugins(updatedPlugins);
      } else {
        // Add new plugin
        const newPlugin: Plugin = {
          id: Date.now(),
          name: pluginData.name || '',
          slug: pluginData.slug || pluginData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          description: pluginData.description || '',
          longDescription: pluginData.longDescription || '',
          version: pluginData.version || '1.0.0',
          price: pluginData.price || 0,
          category: pluginData.category || categories[0],
          tags: pluginData.tags || [],
          features: pluginData.features || [],
          requirements: pluginData.requirements || {
            wordpress: '5.0+',
            php: '7.4+',
            mysql: '5.6+'
          },
          images: pluginData.images || [],
          demoUrl: pluginData.demoUrl || '',
          documentationUrl: pluginData.documentationUrl || '',
          downloadUrl: pluginData.downloadUrl || '',
          active: pluginData.active !== undefined ? pluginData.active : true,
          featured: pluginData.featured || false,
          bestseller: pluginData.bestseller || false,
          downloads: 0,
          rating: 0,
          reviews: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setPlugins([...plugins, newPlugin]);
      }
      
      setShowForm(false);
      setEditingPlugin(null);
    } catch (error) {
      console.error('Error saving plugin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlugin = async (pluginId: number) => {
    if (!confirm('Are you sure you want to delete this plugin?')) return;
    
    try {
      setPlugins(plugins.filter(plugin => plugin.id !== pluginId));
    } catch (error) {
      console.error('Error deleting plugin:', error);
    }
  };

  const handleToggleStatus = async (pluginId: number, field: 'active' | 'featured' | 'bestseller') => {
    try {
      const updatedPlugins = plugins.map(plugin =>
        plugin.id === pluginId
          ? { ...plugin, [field]: !plugin[field], updated_at: new Date().toISOString() }
          : plugin
      );
      setPlugins(updatedPlugins);
    } catch (error) {
      console.error('Error updating plugin status:', error);
    }
  };

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || plugin.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plugin Management</h2>
          <p className="text-gray-600">Manage your WordPress plugins and products</p>
        </div>
        <button
          onClick={() => {
            setEditingPlugin(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Plugin
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlugins.map((plugin) => (
          <div key={plugin.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {plugin.images.length > 0 ? (
                <img
                  src={plugin.images[0]}
                  alt={plugin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {plugin.featured && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
                {plugin.bestseller && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Bestseller
                  </span>
                )}
                {!plugin.active && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{plugin.name}</h3>
                <span className="text-lg font-bold text-blue-600">${plugin.price}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plugin.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {plugin.downloads.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {plugin.rating}
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  v{plugin.version}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {plugin.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPlugin(plugin);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlugin(plugin.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(plugin.id, 'active')}
                    className={`flex-1 px-3 py-1 rounded text-xs font-medium ${
                      plugin.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {plugin.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(plugin.id, 'featured')}
                    className={`flex-1 px-3 py-1 rounded text-xs font-medium ${
                      plugin.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Featured
                  </button>
                  <button
                    onClick={() => handleToggleStatus(plugin.id, 'bestseller')}
                    className={`flex-1 px-3 py-1 rounded text-xs font-medium ${
                      plugin.bestseller
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Bestseller
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Plugin Modal */}
      {showForm && (
        <PluginForm
          plugin={editingPlugin}
          onSave={handleSavePlugin}
          onCancel={() => {
            setShowForm(false);
            setEditingPlugin(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}

interface PluginFormProps {
  plugin: Plugin | null;
  onSave: (plugin: Partial<Plugin>) => void;
  onCancel: () => void;
  loading: boolean;
}

function PluginForm({ plugin, onSave, onCancel, loading }: PluginFormProps) {
  const [formData, setFormData] = useState<Partial<Plugin>>({
    name: plugin?.name || '',
    description: plugin?.description || '',
    longDescription: plugin?.longDescription || '',
    version: plugin?.version || '1.0.0',
    price: plugin?.price || 0,
    category: plugin?.category || categories[0],
    tags: plugin?.tags || [],
    features: plugin?.features || [],
    requirements: plugin?.requirements || {
      wordpress: '5.0+',
      php: '7.4+',
      mysql: '5.6+'
    },
    images: plugin?.images || [],
    demoUrl: plugin?.demoUrl || '',
    documentationUrl: plugin?.documentationUrl || '',
    downloadUrl: plugin?.downloadUrl || '',
    active: plugin?.active !== undefined ? plugin.active : true,
    featured: plugin?.featured || false,
    bestseller: plugin?.bestseller || false
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include uploaded file information in form data
    const finalFormData = {
      ...formData,
      uploadedFile: uploadedFile,
      // If file is uploaded, use a generated download URL
      downloadUrl: uploadedFile ? generateDownloadUrl(uploadedFile) : formData.downloadUrl
    };
    
    onSave(finalFormData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.zip', '.tar.gz'];
      const fileExtension = file.name.toLowerCase();
      const isValidType = allowedTypes.some(type => fileExtension.endsWith(type));
      
      if (!isValidType) {
        alert('Please upload a .zip or .tar.gz file');
        return;
      }
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }
      
      setUploadedFile(file);
      
      // Simulate upload progress (in production, this would be real upload progress)
      simulateUploadProgress();
    }
  };
  
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const generateDownloadUrl = (file: File) => {
    // In production, this would return the actual uploaded file URL
    // For demo purposes, we'll create a blob URL
    return URL.createObjectURL(file);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features?.filter(feature => feature !== featureToRemove) || []
    });
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images?.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImage.trim()]
      });
      setNewImage('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images?.filter(image => image !== imageToRemove) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {plugin ? 'Edit Plugin' : 'Add New Plugin'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plugin Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description
                </label>
                <textarea
                  rows={5}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Additional Details</h4>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add feature"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.features?.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="WordPress"
                    value={formData.requirements?.wordpress}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements!, wordpress: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="PHP"
                    value={formData.requirements?.php}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements!, php: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="MySQL"
                    value={formData.requirements?.mysql}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements!, mysql: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    value={formData.documentationUrl}
                    onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Download URL
                  </label>
                  <input
                    type="url"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plugin File Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".zip,.tar.gz"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="plugin-file-upload"
                    />
                    <label
                      htmlFor="plugin-file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload plugin file (.zip, .tar.gz)
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Max file size: 50MB
                      </span>
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Image
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formData.images?.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Plugin image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                className="mr-2"
              />
              Bestseller
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (plugin ? 'Update Plugin' : 'Create Plugin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PluginManagement;