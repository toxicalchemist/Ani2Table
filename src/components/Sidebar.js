import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userType }) => {
  const adminLinks = [
    { name: 'Homepage', path: '/admin', icon: '🏠' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Analytics & Report', path: '/admin/analytics', icon: '📊' },
    { name: 'Order Status', path: '/admin/orders', icon: '📋' },
    { name: 'Transaction & Delivery', path: '/admin/transactions', icon: '🚚' },
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
    <aside className="w-64 bg-primary min-h-screen text-white p-4">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-2xl">A</span>
          </div>
          <span className="font-bold text-xl">ANI2TABLE</span>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-primary-dark transition"
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
