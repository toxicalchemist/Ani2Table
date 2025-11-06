import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';

const ConsumerProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    { id: 1, name: 'Jasmine Rice', type: 'Premium', price: 45, stock: 500, status: 'In Stock', farmer: "Pedro's Farm", rating: 4.8, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 2, name: 'Sinandomeng Rice', type: 'Regular', price: 40, stock: 750, status: 'In Stock', farmer: "Santos Farm", rating: 4.6, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 3, name: 'Brown Rice', type: 'Organic', price: 50, stock: 300, status: 'In Stock', farmer: "Garcia Farm", rating: 4.9, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 4, name: 'Black Rice', type: 'Premium', price: 60, stock: 200, status: 'In Stock', farmer: "Reyes Farm", rating: 4.7, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 5, name: 'Sticky Rice', type: 'Specialty', price: 55, stock: 150, status: 'In Stock', farmer: "Cruz Farm", rating: 4.5, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 6, name: 'Dinorado Rice', type: 'Premium', price: 48, stock: 400, status: 'In Stock', farmer: "Lopez Farm", rating: 4.6, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Premium', label: 'Premium' },
    { key: 'Regular', label: 'Regular' },
    { key: 'Organic', label: 'Organic' },
    { key: 'Specialty', label: 'Specialty' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Browse Products</h1>
          <p className="text-gray-600">Discover fresh rice from local farmers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            />
            <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary">
              <option value="">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === category.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                    {product.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {product.farmer}</p>
                  <p className="text-xs text-gray-500 mb-2">{product.type}</p>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                    <span className="ml-auto text-sm text-gray-500">Stock: {product.stock}kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">₱{product.price}/kg</span>
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
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
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerProducts;
