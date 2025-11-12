import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const FarmerOrders = () => {
  const [filter, setFilter] = useState('all');
  
  const orders = [
    { id: 'ORD-001', customer: 'Juan Dela Cruz', product: 'Jasmine Rice 10kg', amount: 450, status: 'delivered', date: '2024-11-01', rating: 5, address: '123 Main St, Quezon City', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-002', customer: 'Maria Santos', product: 'Brown Rice 5kg', amount: 250, status: 'in-transit', date: '2024-11-02', address: '456 Rizal Ave, Makati', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-003', customer: 'Pedro Garcia', product: 'Sinandomeng 20kg', amount: 800, status: 'processing', date: '2024-11-03', address: '789 EDSA, Pasig City', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-004', customer: 'Ana Lopez', product: 'Jasmine Rice 15kg', amount: 675, status: 'pending', date: '2024-11-04', address: '321 Taft Ave, Manila', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-005', customer: 'Carlos Reyes', product: 'Black Rice 8kg', amount: 480, status: 'delivered', date: '2024-10-30', rating: 4, address: '654 Commonwealth, QC', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-006', customer: 'Elena Cruz', product: 'Red Rice 12kg', amount: 624, status: 'delivered', date: '2024-10-28', rating: 5, address: '987 Ortigas Ave, Pasig', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-007', customer: 'Roberto Diaz', product: 'Sticky Rice 6kg', amount: 330, status: 'in-transit', date: '2024-11-05', address: '147 Katipunan Ave, QC', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-008', customer: 'Sofia Mendez', product: 'Organic White 18kg', amount: 846, status: 'processing', date: '2024-11-05', address: '258 Roxas Blvd, Pasay', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-009', customer: 'Miguel Torres', product: 'Jasmine Rice 22kg', amount: 990, status: 'delivered', date: '2024-10-26', rating: 5, address: '369 Shaw Blvd, Mandaluyong', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { id: 'ORD-010', customer: 'Isabel Ramos', product: 'Mixed Grain 10kg', amount: 580, status: 'pending', date: '2024-11-06', address: '741 Araneta Ave, Cubao', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="farmer" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orders and Sales</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Processing</p>
            <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'processing').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">In Transit</p>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'in-transit').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'processing', label: 'Processing' },
              { key: 'in-transit', label: 'In Transit' },
              { key: 'delivered', label: 'Delivered' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                  filter === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-primary">
              <div className="flex flex-wrap items-center gap-6">
                {/* Product Image */}
                <img 
                  src={order.image} 
                  alt={order.product}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                />
                
                {/* Order Info */}
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold mb-1">{order.customer}</p>
                  <p className="text-gray-600 mb-2">{order.product}</p>
                  <div className="flex items-start text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{order.address}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">📅 {order.date}</p>
                </div>

                {/* Amount and Rating */}
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary mb-2">₱{order.amount}</p>
                  {order.rating && (
                    <div className="flex items-center justify-end">
                      <span className="text-yellow-500 text-xl">{'⭐'.repeat(order.rating)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 min-w-[140px]">
                  {order.status === 'pending' && (
                    <>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow">
                        ✓ Accept
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow">
                        ✗ Decline
                      </button>
                    </>
                  )}
                  {order.status === 'processing' && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow">
                      🚚 Ship Order
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-bold text-sm">
                    👁 View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
