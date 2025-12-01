import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getMediaUrl } from '../../utils/media';
import { getCurrentUser } from '../../services/authService';

const FarmerProducts = () => {
  const currentUser = getCurrentUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    status: 'available',
    imageFile: null
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const result = await getAllProducts({ farmerId: currentUser?.id });
    if (result.success) {
      setProducts(result.products);
    } else {
      setToast({ message: result.error || 'Failed to load products', type: 'error' });
    }
    setLoading(false);
  }, [currentUser?.id]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Check for low stock products
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 100);
  const outOfStockProducts = products.filter(p => p.quantity === 0);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit || 'kg',
      description: product.description || '',
      status: product.status
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create FormData object for multipart upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('category', formData.category);
    submitData.append('price', formData.price);
    submitData.append('quantity', formData.quantity);
    submitData.append('unit', formData.unit || 'kg');
    submitData.append('description', formData.description || '');
    submitData.append('status', formData.status);
    
    // Add image file if selected
    if (formData.imageFile) {
      submitData.append('image', formData.imageFile);
    }
    
    let result;
    if (selectedProduct) {
      // Update existing product
      result = await updateProduct(selectedProduct.id, submitData);
    } else {
      // Create new product
      result = await createProduct(submitData);
    }
    
    if (result.success) {
      setToast({ 
        message: selectedProduct ? 'Product updated successfully!' : 'Product added successfully!', 
        type: 'success' 
      });
      setShowModal(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'kg',
        description: '',
        status: 'available',
        imageFile: null
      });
      await loadProducts();
    } else {
      setToast({ message: result.error || 'Operation failed', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      const result = await deleteProduct(productId);
      if (result.success) {
        setToast({ message: `${productName} has been deleted`, type: 'success' });
        await loadProducts();
      } else {
        setToast({ message: result.error || 'Failed to delete product', type: 'error' });
      }
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="farmer" />
      
      <div className="flex-1 p-8">
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
                      <span className="font-semibold">{lowStockProducts.map(p => `${p.name} (${p.stock} kg)`).join(', ')}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
            <p className="text-gray-600">Manage your rice products and inventory</p>
          </div>
          <button 
            onClick={() => { 
              setSelectedProduct(null); 
              setFormData({
                name: '',
                category: '',
                price: '',
                quantity: '',
                unit: 'kg',
                description: '',
                status: 'available'
              });
              setShowModal(true); 
            }}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">In Stock</p>
            <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-600">
              ⭐ {(products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="relative">
                <img 
                  src={getMediaUrl(product.imageUrl || product.image)} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-rice.jpg'; }}
                />
                <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${
                  product.stock === 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {product.status}
                </span>
                {/* Edit/Delete buttons on the left */}
                <div className="absolute top-2 left-2 flex flex-col space-y-2 z-10">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.name)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.type}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Stock: <span className="font-bold">{product.stock} kg</span></p>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="text-2xl font-bold text-primary">₱{product.price}/kg</div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewProduct(product)}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Rice, Vegetables, Fruits"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₱) *</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity *</label>
                    <input 
                      type="number" 
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormChange}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <select 
                      name="unit"
                      value={formData.unit}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="pcs">pcs</option>
                      <option value="box">box</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  >
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image</label>
                  <input 
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                  {formData.imageFile && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.imageFile.name}</p>
                  )}
                </div>
                <div className="flex space-x-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Product Modal (Read-only) */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="relative">
                <img 
                  src={getMediaUrl(selectedProduct.imageUrl || selectedProduct.image)} 
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-rice.jpg'; }}
                />
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="absolute top-4 right-4 bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                    <span className="inline-block px-3 py-1 bg-secondary text-white rounded-full text-sm font-bold">
                      {selectedProduct.type}
                    </span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    selectedProduct.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedProduct.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-primary">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-3xl font-bold text-primary">₱{selectedProduct.price}</p>
                    <p className="text-sm text-gray-500">per kilogram</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Stock Available</p>
                    <p className="text-3xl font-bold text-gray-800">{selectedProduct.stock}</p>
                    <p className="text-sm text-gray-500">kilograms</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5 mb-6 border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-600 mb-2">Customer Rating</p>
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-gray-800 mr-2">{selectedProduct.rating}</span>
                    <div>
                      <div className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</div>
                      <p className="text-sm text-gray-600">{selectedProduct.reviews} customer reviews</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditProduct(selectedProduct);
                    }}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition"
                  >
                    Edit Product
                  </button>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition"
                  >
                    Close
                  </button>
                </div>
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

export default FarmerProducts;
