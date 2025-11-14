import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';

const Navbar = ({ isLanding = false, userType = null }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <img 
              src="/logo/ani2table-logo.png" 
              alt="Ani2Table Logo" 
              className="w-14 h-14 rounded-full shadow-lg object-cover"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-light rounded-full items-center justify-center shadow-lg" style={{display: 'none'}}>
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="font-bold text-2xl">ANI2TABLE</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isLanding ? (
              <>
                <Link to="/" className="hover:text-secondary transition font-bold text-lg">HOME</Link>
                <Link to="/products" className="hover:text-secondary transition font-bold text-lg">PRODUCTS</Link>
                <a href="#about" className="hover:text-secondary transition font-bold text-lg">ABOUT</a>
                <div className="flex space-x-4 ml-6">
                  <Link 
                    to="/login" 
                    className="bg-secondary hover:bg-secondary-dark px-6 py-3 rounded-lg transition font-bold shadow-lg"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-secondary hover:bg-secondary-dark px-6 py-3 rounded-lg transition font-bold shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={`/${userType}`} className="hover:text-secondary transition font-bold text-lg">DASHBOARD</Link>
                {currentUser && currentUser.firstName && (
                  <span className="text-secondary font-bold text-lg">
                    Welcome, {currentUser.firstName}!
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg transition font-bold shadow-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-4">
            {isLanding ? (
              <>
                <Link to="/" className="block py-3 hover:text-secondary transition font-bold text-lg">HOME</Link>
                <Link to="/products" className="block py-3 hover:text-secondary transition font-bold text-lg">PRODUCTS</Link>
                <a href="#about" className="block py-3 hover:text-secondary transition font-bold text-lg">ABOUT</a>
                <Link to="/login" className="block py-3 mt-3 bg-secondary hover:bg-secondary-dark px-5 rounded-lg transition font-bold text-center">
                  Login
                </Link>
                <Link to="/signup" className="block py-3 mt-3 bg-secondary hover:bg-secondary-dark px-5 rounded-lg transition font-bold text-center">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link to={`/${userType}`} className="block py-3 hover:text-secondary transition font-bold text-lg">DASHBOARD</Link>
                <button 
                  onClick={handleLogout}
                  className="w-full mt-3 bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg transition font-bold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
