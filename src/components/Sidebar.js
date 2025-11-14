import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';

const Sidebar = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Homepage', path: '/admin', icon: '🏠' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Analytics & Report', path: '/admin/analytics', icon: '📊' },
    { name: 'Order Status', path: '/admin/orders', icon: '📋' },
    { name: 'Transaction & Delivery', path: '/admin/transactions', icon: '🚚' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
  ];

  const farmerLinks = [
    { name: 'Homepage', path: '/farmer', icon: '🏠' },
    { name: 'My Profile', path: '/farmer/profile', icon: '👤' },
    { name: 'My Products', path: '/farmer/products', icon: '📦' },
    { name: 'Orders and Sales', path: '/farmer/orders', icon: '📋' },
    { name: 'Messages', path: '/farmer/messages', icon: '💬' },
  ];

  const consumerLinks = [
    { name: 'Homepage', path: '/consumer', icon: '🏠' },
    { name: 'My Profile', path: '/consumer/profile', icon: '👤' },
    { name: 'Product Panel', path: '/consumer/products', icon: '📦' },
    { name: 'Cart', path: '/consumer/cart', icon: '🛒' },
    { name: 'Order Summary', path: '/consumer/orders', icon: '📋' },
    { name: 'Order Status', path: '/consumer/order-status', icon: '📍' },
    { name: 'Messages', path: '/consumer/messages', icon: '💬' },
  ];

  const links = userType === 'admin' ? adminLinks : userType === 'farmer' ? farmerLinks : consumerLinks;

  return (
    <aside className="w-64 bg-primary min-h-screen text-white p-4 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <span className="font-bold text-xl">ANI2TABLE</span>
        </div>
      </div>

      {/* User Info */}
      {currentUser && currentUser.userType && (
        <div className="mb-6 px-4 py-3 bg-primary-dark rounded-lg">
          <p className="text-sm text-gray-300">Logged in as</p>
          <p className="font-semibold text-secondary">{currentUser.firstName || 'User'} {currentUser.lastName || ''}</p>
          <p className="text-xs text-gray-400 capitalize">{currentUser.userType}</p>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {links.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded transition ${
                isActive 
                  ? 'bg-primary-dark shadow-lg border-l-4 border-secondary' 
                  : 'hover:bg-primary-dark/50'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className={isActive ? 'font-bold' : ''}>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pb-4 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded bg-red-600 hover:bg-red-700 transition text-white font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
