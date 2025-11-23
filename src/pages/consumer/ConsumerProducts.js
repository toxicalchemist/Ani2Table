import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
// ProductCard not used here; removed to satisfy ESLint
import Toast from '../../components/Toast';
import { getAllProducts } from '../../services/productService';
import { addToCart } from '../../services/cartService';
import { filterCategories } from '../../utils/categoryFilter';

const ConsumerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts({ status: 'available' });
    if (result.success) {
      setProducts(result.products);
    } else {
      setToast({ message: result.error || 'Failed to load products', type: 'error' });
    }
    setLoading(false);
  };

  const [quantity, setQuantity] = useState(1);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when opening modal
    setShowDetailModal(true);
  };

  const handleAddToCart = async (productId, productName) => {
    const result = await addToCart(productId, quantity);
    if (result.success) {
      setShowDetailModal(false);
      setToast({ message: `${productName} added to cart!`, type: 'success' });
    } else {
      setToast({ message: result.error || 'Failed to add to cart', type: 'error' });
    }
  };

  const allCategories = [
    { key: 'all', label: 'All' },
    { key: 'Rice', label: 'Rice' },
    { key: 'Vegetables', label: 'Vegetables' },
    { key: 'Fruits', label: 'Fruits' },
    { key: 'Grains', label: 'Grains' },
  ];

  // Filter out non-rice categories
  const categories = filterCategories(allCategories).map(c => ({ key: c.id || c.key || c, label: c.name || c.label || c }));

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Resolve media/image URL coming from backend. Backend may return `imageUrl` (relative path)
  // or `image` (absolute URL). This helper returns a full URL or a placeholder.
  const getMediaUrl = (path) => {
    const placeholder = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
    if (!path) return placeholder;
    // Already absolute
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // If API URL present in env, strip trailing /api and use origin
    const api = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const origin = api.replace(/\/api\/?$/, '') || 'http://localhost:5000';
    return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:scale-105"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative">
                  <img
                    src={getMediaUrl(product.imageUrl || product.image)}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'; }}
                  />
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
        )}

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
                  src={getMediaUrl(selectedProduct.imageUrl || selectedProduct.image)}
                  alt={selectedProduct.name}
                  className="w-full h-72 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200'; }}
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
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-lg font-bold"
                      />
                    </div>
                    <button 
                      onClick={() => handleAddToCart(selectedProduct.id, selectedProduct.name)}
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
