import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';
import Toast from '../../components/Toast';
import { getAllProducts, deleteProduct, updateProductStatus } from '../../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [farmerFilter, setFarmerFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadFarmers();
    loadProducts();
  }, []);

  const loadProducts = async (filters = {}) => {
    setLoading(true);
    // merge current UI filters if not provided
    const appliedFilters = {
      ...(filters || {}),
    };
    if (!('farmerId' in appliedFilters) && farmerFilter) appliedFilters.farmerId = farmerFilter;

    const result = await getAllProducts(appliedFilters);
    if (result.success) {
      console.log('Loaded products:', result.products);
      console.log('Product statuses:', result.products.map(p => ({ id: p.id, name: p.name, status: p.status })));
      setProducts(result.products);
    } else {
      setToast({ message: result.error || 'Failed to load products', type: 'error' });
    }
    setLoading(false);
  };

  const loadFarmers = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('ani2table_token');
      const res = await fetch(`${API_URL}/admin/users/farmers`, {
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      // endpoint returns an array (see adminController.getFarmers)
      if (Array.isArray(data)) {
        setFarmers(data);
      } else if (data.success && data.farmers) {
        setFarmers(data.farmers);
      }
    } catch (err) {
      console.error('Failed to load farmers', err);
    }
  };

  const handleApproveProduct = async (productId, productName) => {
    console.log('Approving product:', productId, productName);
    const result = await updateProductStatus(productId, 'available');
    console.log('Approve result:', result);
    if (result.success) {
      setToast({ message: `${productName} has been approved!`, type: 'success' });
      await loadProducts();
    } else {
      setToast({ message: result.error || 'Failed to approve product', type: 'error' });
    }
  };

  const handleRejectProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to reject ${productName}?`)) {
      const result = await updateProductStatus(productId, 'rejected');
      if (result.success) {
        setToast({ message: `${productName} has been rejected`, type: 'error' });
        await loadProducts();
      } else {
        setToast({ message: result.error || 'Failed to reject product', type: 'error' });
      }
    }
  };

  // Filter products based on status
  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'available');
  const rejectedProducts = products.filter(p => p.status === 'rejected');
  
  const filteredProducts = statusFilter === 'all' ? products :
                          statusFilter === 'pending' ? pendingProducts :
                          statusFilter === 'approved' ? approvedProducts :
                          rejectedProducts;

  // Check for low stock or out of stock items (only approved products)
  const lowStockProducts = approvedProducts.filter(p => p.quantity > 0 && p.isLowStock);
  const outOfStockProducts = approvedProducts.filter(p => p.quantity === 0);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setShowEditModal(false);
    setToast({ message: 'Product updated successfully!', type: 'success' });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setToast({ message: 'Product added successfully!', type: 'success' });
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      console.log('Requesting delete for productId=', productId);
      const result = await deleteProduct(productId);
      console.log('Delete response:', result);
      if (result.success) {
        setToast({ message: `${productName} has been deleted`, type: 'success' });
        await loadProducts();
      } else {
        setToast({ message: result.error || 'Failed to delete product', type: 'error' });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8">
        {/* Pending Products Alert */}
        {pendingProducts.length > 0 && (
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-blue-800 text-lg">Pending Product Approvals</h3>
                  <p className="text-blue-700 mt-1">
                    {pendingProducts.length} product(s) waiting for your approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="mb-6 space-y-3">
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-red-800 text-lg">Out of Stock Alert!</h3>
                    <p className="text-red-700 mt-1">
                      {outOfStockProducts.length} product(s) are out of stock: {' '}
                      <span className="font-semibold">{outOfStockProducts.map(p => p.name).join(', ')}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-yellow-800 text-lg">Low Stock Warning</h3>
                    <p className="text-yellow-700 mt-1">
                      {lowStockProducts.length} product(s) have low stock: {' '}
                      <span className="font-semibold">{lowStockProducts.map(p => `${p.name} (${p.quantity} ${p.unit || 'kg'})`).join(', ')}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">
              Review and manage farmer product submissions ({pendingProducts.length} pending, {approvedProducts.length} approved)
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({pendingProducts.length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({approvedProducts.length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected ({rejectedProducts.length})
            </button>
          </div>
        </div>

        {/* Farmer and Location Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="w-64">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Farmer</label>
              <select
                value={farmerFilter}
                onChange={(e) => { setFarmerFilter(e.target.value); }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All farmers</option>
                {farmers.map(f => (
                  <option key={f.userId} value={f.userId}>{`${f.firstName} ${f.lastName}`}</option>
                ))}
              </select>
            </div>

                <div className="pt-6 flex gap-2">
                  <button
                    onClick={() => loadProducts()}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-semibold"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => { setFarmerFilter(''); loadProducts({}); }}
                    className="px-4 py-2 bg-gray-200 rounded-lg font-semibold"
                  >
                    Clear
                  </button>
                </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex flex-col items-end space-y-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.status === 'pending' ? 'bg-blue-500 text-white' :
                    product.status === 'available' ? 'bg-green-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.status}
                  </span>
                  {product.isLowStock && product.quantity > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">Low</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Farmer:</span> {product.farmerName}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">₱{product.price}</span>
                  <span className="text-gray-600">Stock: {product.quantity} {product.unit || 'kg'}</span>
                </div>
                
                {/* Action Buttons */}
                {product.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProduct(product.id, product.name)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold transition flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectProduct(product.id, product.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                )}
                
                {product.status === 'available' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                {product.status === 'rejected' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProduct(product.id, product.name)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Type *</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base">
                      <option value="">Select type</option>
                      <option>Premium</option>
                      <option>Regular</option>
                      <option>Organic</option>
                      <option>Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Price (per kg) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 font-bold">₱</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Stock (kg) *</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Product Image URL</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Enter product description..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base resize-none" 
                  />
                </div>
                <div className="flex space-x-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-bold text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-bold text-base shadow-lg"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-primary">Edit Product</h2>
                <form onSubmit={handleUpdateProduct} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Product Name</label>
                      <input 
                        type="text" 
                        defaultValue={selectedProduct.name}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Type</label>
                      <select 
                        defaultValue={selectedProduct.type}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base"
                      >
                        <option>Rice</option>
                        <option>Seeds</option>
                        <option>Tools</option>
                        <option>Fertilizer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Price (₱)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-base">₱</span>
                        <input 
                          type="number" 
                          defaultValue={selectedProduct.price}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">Stock</label>
                      <input 
                        type="number" 
                        defaultValue={selectedProduct.stock}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Image URL</label>
                    <input 
                      type="text" 
                      defaultValue={selectedProduct.image}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                    <textarea 
                      rows="3"
                      defaultValue={selectedProduct.description || ''}
                      placeholder="Enter product description..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition text-base resize-none" 
                    />
                  </div>
                  <div className="flex space-x-4 mt-8">
                    <button 
                      type="button" 
                      onClick={() => setShowEditModal(false)} 
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-bold text-base"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-bold text-base shadow-lg"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
