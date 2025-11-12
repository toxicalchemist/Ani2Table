import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';
import Toast from '../../components/Toast';

const AdminProducts = () => {
  const [products] = useState([
    { id: 1, name: 'Jasmine Rice', type: 'Premium', price: 45, stock: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Premium fragrant jasmine rice' },
    { id: 2, name: 'Sinandomeng Rice', type: 'Regular', price: 40, stock: 750, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Traditional Filipino variety' },
    { id: 3, name: 'Brown Rice', type: 'Organic', price: 50, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Nutritious whole grain rice' },
    { id: 4, name: 'Black Rice', type: 'Premium', price: 60, stock: 200, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Antioxidant-rich specialty rice' },
    { id: 5, name: 'Sticky Rice', type: 'Specialty', price: 55, stock: 150, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Perfect for desserts and Asian dishes' },
    { id: 6, name: 'Dinorado Rice', type: 'Premium', price: 48, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Sweet and fluffy premium variety' },
    { id: 7, name: 'Red Rice', type: 'Organic', price: 52, stock: 85, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Nutrient-dense red rice variety' },
    { id: 8, name: 'Organic White Rice', type: 'Organic', price: 47, stock: 620, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Certified organic white rice' },
    { id: 9, name: 'Premium Malagkit', type: 'Specialty', price: 52, stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'High-quality glutinous rice' },
    { id: 10, name: 'Mixed Grain Rice', type: 'Specialty', price: 58, stock: 310, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Healthy blend of rice varieties' },
    { id: 11, name: 'Basmati Rice', type: 'Premium', price: 65, stock: 95, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Long-grain aromatic rice' },
    { id: 12, name: 'Sushi Rice', type: 'Specialty', price: 62, stock: 180, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Short-grain Japanese style rice' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Check for low stock or out of stock items
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 100);
  const outOfStockProducts = products.filter(p => p.stock === 0);

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

  const handleDeleteProduct = (productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      setToast({ message: `${productName} has been deleted`, type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      
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
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">Manage all rice products in the system</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            />
            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary">
              <option value="">All Categories</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
              <option value="organic">Organic</option>
              <option value="specialty">Specialty</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary">
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
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
              <ProductCard product={product} />
            </div>
          ))}
        </div>

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
