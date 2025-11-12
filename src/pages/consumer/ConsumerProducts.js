import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductCard from '../../components/ProductCard';
import Toast from '../../components/Toast';

const ConsumerProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  const products = [
    { id: 1, name: 'Jasmine Rice', type: 'Premium', price: 45, stock: 500, status: 'In Stock', farmer: "Pedro's Farm", rating: 4.8, reviews: 245, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Premium quality jasmine rice with aromatic fragrance. Perfect for special occasions and everyday meals. Grown with care by local farmers.' },
    { id: 2, name: 'Sinandomeng Rice', type: 'Regular', price: 40, stock: 750, status: 'In Stock', farmer: "Santos Farm", rating: 4.6, reviews: 189, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Classic Filipino rice variety. Great taste and texture for daily consumption. Affordable and reliable quality.' },
    { id: 3, name: 'Brown Rice', type: 'Organic', price: 50, stock: 300, status: 'In Stock', farmer: "Garcia Farm", rating: 4.9, reviews: 312, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Organic brown rice rich in fiber and nutrients. Healthy choice for wellness-focused consumers. Certified organic.' },
    { id: 4, name: 'Black Rice', type: 'Premium', price: 60, stock: 200, status: 'In Stock', farmer: "Reyes Farm", rating: 4.7, reviews: 156, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Rare black rice variety with high antioxidants. Distinctive color and nutty flavor. Premium quality.' },
    { id: 5, name: 'Sticky Rice', type: 'Specialty', price: 55, stock: 150, status: 'In Stock', farmer: "Cruz Farm", rating: 4.5, reviews: 98, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Traditional sticky rice perfect for desserts and special dishes. Authentic Filipino taste.' },
    { id: 6, name: 'Dinorado Rice', type: 'Premium', price: 48, stock: 400, status: 'In Stock', farmer: "Lopez Farm", rating: 4.6, reviews: 201, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Premium Dinorado variety known for its fragrance and taste. Popular choice for special occasions.' },
    { id: 7, name: 'Red Rice', type: 'Organic', price: 52, stock: 280, status: 'In Stock', farmer: "Mendoza Farm", rating: 4.8, reviews: 134, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Nutrient-dense red rice with natural antioxidants. Earthy flavor and healthy benefits. Organic certified.' },
    { id: 8, name: 'Organic White Rice', type: 'Organic', price: 47, stock: 520, status: 'In Stock', farmer: "Fernandez Farm", rating: 4.7, reviews: 198, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Certified organic white rice grown without chemicals. Pure and healthy choice for your family.' },
    { id: 9, name: 'Premium Malagkit', type: 'Specialty', price: 52, stock: 175, status: 'In Stock', farmer: "Villanueva Farm", rating: 4.6, reviews: 112, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'High-quality glutinous rice for traditional Filipino recipes. Perfect for kakanin and desserts.' },
    { id: 10, name: 'Mixed Grain Rice', type: 'Specialty', price: 58, stock: 340, status: 'In Stock', farmer: "Aquino Farm", rating: 4.8, reviews: 165, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Healthy blend of different rice varieties and whole grains. Packed with nutrition and fiber.' },
    { id: 11, name: 'Basmati Rice', type: 'Premium', price: 65, stock: 225, status: 'In Stock', farmer: "Torres Farm", rating: 4.9, reviews: 187, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Long-grain aromatic basmati rice. Fluffy texture and distinctive aroma for special dishes.' },
    { id: 12, name: 'Sushi Rice', type: 'Specialty', price: 62, stock: 195, status: 'In Stock', farmer: "Diaz Farm", rating: 4.7, reviews: 143, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Premium short-grain Japanese-style rice. Perfect for sushi and other Japanese cuisine.' },
  ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleAddToCart = (productName) => {
    setShowDetailModal(false);
    setToast({ message: `${productName} added to cart!`, type: 'success' });
  };

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
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:scale-105"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                  {product.status}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {product.farmer}
                </p>
                <p className="text-xs text-gray-500 mb-3 bg-gray-100 inline-block px-2 py-1 rounded">{product.type}</p>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="text-2xl font-bold text-primary">₱{product.price}<span className="text-sm text-gray-500">/kg</span></div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg mr-1">⭐</span>
                    <span className="font-bold text-lg">{product.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Stock Available: <span className="font-bold">{product.stock} kg</span></p>
                  <p className="text-primary font-semibold">Click to view details →</p>
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

        {/* Product Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden">
              <div className="relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-72 object-cover"
                />
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="absolute top-4 right-4 bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold bg-green-500 text-white shadow-lg">
                  {selectedProduct.status}
                </span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                    <p className="text-lg text-gray-600 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {selectedProduct.farmer}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-secondary text-white rounded-full text-sm font-bold">
                      {selectedProduct.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold text-primary">₱{selectedProduct.price}</p>
                    <p className="text-lg text-gray-500">per kilogram</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 mb-1">Customer Rating</p>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-gray-800 mr-2">{selectedProduct.rating}</span>
                      <div>
                        <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                        <p className="text-xs text-gray-600">{selectedProduct.reviews} reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Stock Available</p>
                    <p className="text-3xl font-bold text-gray-800">{selectedProduct.stock}</p>
                    <p className="text-sm text-gray-500">kilograms</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Delivery</p>
                    <p className="text-2xl font-bold text-gray-800">2-3 days</p>
                    <p className="text-sm text-gray-500">standard</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{selectedProduct.description}</p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Quantity (kg)</label>
                      <input 
                        type="number" 
                        min="1" 
                        defaultValue="1"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-lg font-bold"
                      />
                    </div>
                    <button 
                      onClick={() => handleAddToCart(selectedProduct.name)}
                      className="flex-[2] bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-lg font-bold text-lg transition shadow-lg flex items-center justify-center space-x-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  </div>
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

export default ConsumerProducts;
