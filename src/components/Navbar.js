import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLanding = false, userType = null }) => {
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl">ANI2TABLE</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isLanding ? (
              <>
                <Link to="/" className="hover:text-secondary transition">HOME</Link>
                <Link to="/#shop" className="hover:text-secondary transition">SHOP</Link>
                <Link to="/#about" className="hover:text-secondary transition">ABOUT</Link>
                <div className="flex space-x-3 ml-4">
                  <Link to="/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">
                    Sign up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={`/${userType}`} className="hover:text-secondary transition">HOME</Link>
                <Link to={`/${userType}/shop`} className="hover:text-secondary transition">SHOP</Link>
                <Link to={`/${userType}/about`} className="hover:text-secondary transition">ABOUT</Link>
                <div className="flex space-x-3 ml-4">
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
