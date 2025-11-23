import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { getMediaUrl } from '../utils/media';
import { filterCategories } from '../utils/categoryFilter';

const PublicProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Only fetch approved/available products
      const result = await getAllProducts({ status: 'available' });
      if (result.success) {
        setProducts(result.products || []);
      } else {
        console.error('Failed to load products:', result.error);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = [
    { id: 'all', name: 'All Rice', icon: '🌾' },
    { id: 'Rice', name: 'Rice', icon: '🍚' },
    { id: 'Vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'Fruits', name: 'Fruits', icon: '🍎' },
    { id: 'Grains', name: 'Grains', icon: '🌾' },
  ];

  const categories = filterCategories(allCategories);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.farmerName && product.farmerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLanding={true} />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Fresh Rice from Local Farmers
          </h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Browse our wide selection of premium quality rice directly from Filipino farmers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, farmers, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="ml-2 bg-white text-primary text-xs px-2 py-1 rounded-full">
                    {filteredProducts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> products
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={getMediaUrl(product.imageUrl || product.image)} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'; }}
                  />
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.status || 'Available'}
                  </span>
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-1 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold">{product.farmerName || 'Local Farmer'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Stock: {product.stock} kg</span>
                  </div>

                  {product.rating && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="ml-1 font-semibold text-gray-800">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.reviews || 0} reviews)</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-primary">₱{product.price}</span>
                      <span className="text-gray-500 text-sm">/kg</span>
                    </div>
                  </div>

                  <Link
                    to="/signup"
                    className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-lg font-bold transition transform hover:scale-105"
                  >
                    Sign Up to Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Sign up now to order fresh rice directly from local farmers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
            >
              Create Account
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-bold transition transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/logo/ani2table-logo.png" 
              alt="Ani2Table Logo" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-light rounded-full items-center justify-center shadow-lg hidden">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl">ANI2TABLE</span>
          </div>
          <p className="text-gray-200">&copy; 2025 Ani2Table. Supporting Filipino Farmers.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicProducts;
