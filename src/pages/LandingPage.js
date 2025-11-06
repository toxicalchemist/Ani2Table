import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar isLanding={true} />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1600)'
      }}>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bringing Local Rice<br />To Your Table
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect directly with local rice farmers and get fresh, quality rice delivered to your doorstep
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition">
                Start Shopping
              </Link>
              <Link to="/#about" className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg font-bold transition">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            How Ani2Table Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Browse Products</h3>
              <p className="text-gray-600">
                Explore a wide variety of locally grown rice from verified farmers in your area
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Place Order</h3>
              <p className="text-gray-600">
                Add your favorite rice varieties to cart and complete your purchase securely
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Delivered</h3>
              <p className="text-gray-600">
                Receive fresh rice directly from the farm to your table with fast delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">ABOUT US</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <p className="text-lg leading-relaxed mb-6">
                Ani2Table is a digital platform that aims to help local farmers, with consumers 
                who are in need of an accessible way of purchasing rice, directly linking 
                farmers with consumers through e-commerce. We believe in supporting local 
                agriculture and providing fresh, quality rice to every household.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our platform empowers rice farmers by giving them direct access to consumers, 
                eliminating middlemen and ensuring fair prices. For consumers, we provide 
                a convenient way to purchase high-quality local rice with transparency about 
                its origin and the farmers who grew it.
              </p>
              <p className="text-lg leading-relaxed">
                A vision for a better future for farmers and consumers alike, Ani2Table was 
                developed to modernize and revolutionize rice distribution in the Philippines, 
                ensuring food security and supporting local communities through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Featured Rice Varieties
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Jasmine Rice', price: '45', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
              { name: 'Sinandomeng Rice', price: '40', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
              { name: 'Brown Rice', price: '50', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">₱{product.price}/kg</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/signup" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold inline-block transition">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl">ANI2TABLE</span>
          </div>
          <p className="text-gray-300">
            © 2025 Ani2Table. All rights reserved. Bringing local rice to your table.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
