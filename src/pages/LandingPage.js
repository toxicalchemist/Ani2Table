import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar isLanding={true} />
      
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1600)',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 py-20">
          <div className="max-w-5xl animate-fade-in">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight drop-shadow-2xl">
              Bringing Local Rice<br />
              <span className="text-secondary">To Your Table</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto text-gray-100 font-medium leading-relaxed">
              Connect directly with local rice farmers and get fresh, quality rice delivered to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/signup" 
                className="group bg-primary hover:bg-primary-dark text-white px-12 py-6 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center"
              >
                Start Shopping
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#about" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-12 py-6 rounded-xl text-xl font-bold transition transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-7xl font-extrabold mb-4 text-secondary">500+</div>
              <div className="text-2xl font-semibold">Local Farmers</div>
              <p className="text-gray-200 mt-2">Trusted partners</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-7xl font-extrabold mb-4 text-secondary">10k+</div>
              <div className="text-2xl font-semibold">Happy Customers</div>
              <p className="text-gray-200 mt-2">Satisfied buyers</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-7xl font-extrabold mb-4 text-secondary">50+</div>
              <div className="text-2xl font-semibold">Rice Varieties</div>
              <p className="text-gray-200 mt-2">Premium quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-extrabold text-primary mb-6">
              How Ani2Table Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and direct connection between farmers and consumers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ),
                title: 'Browse Products',
                description: 'Explore a wide variety of locally grown rice from verified farmers in your area'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                ),
                title: 'Place Order',
                description: 'Add your favorite rice varieties to cart and complete your purchase securely'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ),
                title: 'Get Delivered',
                description: 'Receive fresh rice directly from the farm to your table with fast delivery'
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {step.icon}
                    </svg>
                  </div>
                  <div className="absolute top-0 right-0 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12">About Us</h2>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-2xl">
              <p className="text-lg leading-relaxed mb-6">
                <span className="font-bold text-secondary">Ani2Table</span> is a digital platform that aims to help local farmers, with consumers 
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
              <div className="mt-8 flex justify-center">
                <Link 
                  to="/signup" 
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-primary mb-4">
              Featured Rice Varieties
            </h2>
            <p className="text-xl text-gray-600">
              Premium quality rice from trusted local farmers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Jasmine Rice', price: '45', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', desc: 'Aromatic and fluffy' },
              { name: 'Sinandomeng Rice', price: '40', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', desc: 'Local favorite variety' },
              { name: 'Brown Rice', price: '50', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', desc: 'Healthy and nutritious' },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Fresh
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">₱{product.price}</span>
                    <span className="text-gray-500">/kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-bold inline-flex items-center transition transform hover:scale-105 shadow-lg"
            >
              View All Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers supporting local farmers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-lg font-bold transition transform hover:scale-105 shadow-xl"
            >
              Create Free Account
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-10 py-4 rounded-lg font-bold transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="font-bold text-2xl">ANI2TABLE</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Connecting local rice farmers with consumers for a sustainable and transparent food supply chain.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-200">
                <li><Link to="/products" className="hover:text-secondary transition">Products</Link></li>
                <li><Link to="/signup" className="hover:text-secondary transition">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-secondary transition">Login</Link></li>
                <li><a href="#about" className="hover:text-secondary transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-200">
                <li>Email: info@ani2table.com</li>
                <li>Phone: +63 912 345 6789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary pt-8 text-center text-gray-200">
            <p>© 2025 Ani2Table. All rights reserved. Bringing local rice to your table.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
