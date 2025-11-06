import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';

const AdminProducts = () => {
  const [products] = useState([
    { id: 1, name: 'Jasmine Rice', type: 'Premium', price: 45, stock: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 2, name: 'Sinandomeng Rice', type: 'Regular', price: 40, stock: 750, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 3, name: 'Brown Rice', type: 'Organic', price: 50, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 4, name: 'Black Rice', type: 'Premium', price: 60, stock: 200, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 5, name: 'Sticky Rice', type: 'Specialty', price: 55, stock: 150, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 6, name: 'Dinorado Rice', type: 'Premium', price: 48, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8">
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
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary">
                    <option>Premium</option>
                    <option>Regular</option>
                    <option>Organic</option>
                    <option>Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (per kg)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock (kg)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary" />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
