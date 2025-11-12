import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const AdminOrders = () => {
  const [filter, setFilter] = useState('all');
  
  const orders = [
    { id: 'ORD-001', customer: 'Juan Dela Cruz', farmer: 'Pedro Farm', product: 'Jasmine Rice 10kg', amount: 450, status: 'delivered', date: '2024-11-01', address: '123 Main St, Quezon City', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-002', customer: 'Maria Santos', farmer: 'Santos Farm', product: 'Brown Rice 5kg', amount: 250, status: 'in-transit', date: '2024-11-02', address: '456 Rizal Ave, Manila', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-003', customer: 'Pedro Garcia', farmer: 'Garcia Rice Farm', product: 'Sinandomeng 20kg', amount: 800, status: 'processing', date: '2024-11-03', address: '789 Bonifacio St, Makati', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-004', customer: 'Ana Lopez', farmer: 'Lopez Farm', product: 'Jasmine Rice 15kg', amount: 675, status: 'delivered', date: '2024-11-01', address: '321 Luna St, Pasig', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-005', customer: 'Carlos Reyes', farmer: 'Reyes Rice Farm', product: 'Black Rice 8kg', amount: 480, status: 'pending', date: '2024-11-04', address: '654 Del Pilar Ave, Taguig', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-006', customer: 'Isabel Cruz', farmer: 'Cruz Farm', product: 'Sticky Rice 12kg', amount: 660, status: 'in-transit', date: '2024-11-03', address: '987 Aguinaldo Blvd, Parañaque', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-007', customer: 'Roberto Diaz', farmer: 'Diaz Farm', product: 'Red Rice 7kg', amount: 420, status: 'delivered', date: '2024-10-31', address: '147 Mabini St, Mandaluyong', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-008', customer: 'Sofia Mendez', farmer: 'Mendoza Farm', product: 'Organic White 18kg', amount: 846, status: 'processing', date: '2024-11-05', address: '258 Roxas Blvd, Pasay', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-009', customer: 'Miguel Torres', farmer: 'Torres Farm', product: 'Dinorado Rice 14kg', amount: 770, status: 'in-transit', date: '2024-11-04', address: '369 Quirino Ave, Caloocan', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-010', customer: 'Isabel Ramos', farmer: 'Santos Farm', product: 'Mixed Grain 10kg', amount: 580, status: 'pending', date: '2024-11-06', address: '741 Lacson St, San Juan', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-011', customer: 'Diego Fernandez', farmer: 'Fernandez Farm', product: 'Jasmine Rice 9kg', amount: 405, status: 'processing', date: '2024-11-05', address: '852 Taft Ave, Pasay', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
    { id: 'ORD-012', customer: 'Carmen Villanueva', farmer: 'Villanueva Farm', product: 'Sticky Rice 16kg', amount: 768, status: 'delivered', date: '2024-10-30', address: '963 EDSA, Cubao', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
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
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600">Monitor and manage all orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
            <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm font-semibold">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-semibold">Processing</p>
            <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'processing').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-semibold">In Transit</p>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'in-transit').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-semibold">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
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
                className={`px-6 py-3 font-medium transition ${
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

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Farmer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Delivery Address</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium">{order.id}</td>
                    <td className="py-4 px-6 text-gray-600">{order.date}</td>
                    <td className="py-4 px-6">{order.customer}</td>
                    <td className="py-4 px-6 text-gray-600">{order.farmer}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={order.image} 
                          alt={order.product}
                          className="w-12 h-12 rounded object-cover border-2 border-gray-200"
                        />
                        <span>{order.product}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 mr-1 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{order.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-primary">₱{order.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition" title="View Details">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition" title="Edit Order">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
