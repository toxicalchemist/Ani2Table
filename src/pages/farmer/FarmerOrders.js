import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const FarmerOrders = () => {
  const [filter, setFilter] = useState('all');
  
  const orders = [
    { id: 'ORD-001', customer: 'Juan Dela Cruz', product: 'Jasmine Rice 10kg', amount: 450, status: 'delivered', date: '2024-11-01', rating: 5 },
    { id: 'ORD-002', customer: 'Maria Santos', product: 'Brown Rice 5kg', amount: 250, status: 'in-transit', date: '2024-11-02' },
    { id: 'ORD-003', customer: 'Pedro Garcia', product: 'Sinandomeng 20kg', amount: 800, status: 'processing', date: '2024-11-03' },
    { id: 'ORD-004', customer: 'Ana Lopez', product: 'Jasmine Rice 15kg', amount: 675, status: 'pending', date: '2024-11-04' },
    { id: 'ORD-005', customer: 'Carlos Reyes', product: 'Black Rice 8kg', amount: 480, status: 'delivered', date: '2024-10-30', rating: 4 },
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
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'processing').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">In Transit</p>
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'in-transit').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
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
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.product}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₱{order.amount}</p>
                  {order.rating && (
                    <div className="mt-1">
                      <span className="text-yellow-500">{'⭐'.repeat(order.rating)}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition">
                      Accept
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                      Mark as Shipped
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition">
                    View Details
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
