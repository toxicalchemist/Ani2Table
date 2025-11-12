import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const ConsumerOrders = () => {
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-11-01',
      farmer: "Pedro's Farm",
      items: [{ name: 'Jasmine Rice', quantity: 10, price: 45 }],
      total: 500,
      status: 'delivered',
      rating: 5,
      deliveryDate: '2024-11-03'
    },
    {
      id: 'ORD-002',
      date: '2024-11-02',
      farmer: "Garcia Farm",
      items: [{ name: 'Brown Rice', quantity: 5, price: 50 }],
      total: 300,
      status: 'in-transit',
      estimatedDelivery: '2024-11-05'
    },
    {
      id: 'ORD-003',
      date: '2024-11-03',
      farmer: "Santos Farm",
      items: [{ name: 'Sinandomeng Rice', quantity: 20, price: 40 }],
      total: 850,
      status: 'processing',
      estimatedDelivery: '2024-11-06'
    },
    {
      id: 'ORD-004',
      date: '2024-11-04',
      farmer: "Reyes Farm",
      items: [{ name: 'Black Rice', quantity: 8, price: 60 }],
      total: 530,
      status: 'pending',
      estimatedDelivery: '2024-11-07'
    },
    {
      id: 'ORD-005',
      date: '2024-10-28',
      farmer: "Cruz Farm",
      items: [{ name: 'Sticky Rice', quantity: 12, price: 55 }],
      total: 710,
      status: 'delivered',
      rating: 4,
      deliveryDate: '2024-10-30'
    },
    {
      id: 'ORD-006',
      date: '2024-10-25',
      farmer: "Lopez Farm",
      items: [{ name: 'Dinorado Rice', quantity: 15, price: 48 }],
      total: 770,
      status: 'delivered',
      rating: 5,
      deliveryDate: '2024-10-27'
    },
    {
      id: 'ORD-007',
      date: '2024-11-05',
      farmer: "Mendoza Farm",
      items: [{ name: 'Red Rice', quantity: 7, price: 52 }],
      total: 414,
      status: 'processing',
      estimatedDelivery: '2024-11-08'
    },
    {
      id: 'ORD-008',
      date: '2024-10-22',
      farmer: "Fernandez Farm",
      items: [{ name: 'Organic White Rice', quantity: 18, price: 47 }],
      total: 896,
      status: 'delivered',
      rating: 5,
      deliveryDate: '2024-10-24'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
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
            <p className="text-gray-500 text-sm">Delivered</p>
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
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                    <p className="text-sm text-gray-600">From {order.farmer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₱{order.total}</p>
                    {order.status === 'delivered' && order.rating && (
                      <div className="mt-2">
                        <span className="text-yellow-500">{'⭐'.repeat(order.rating)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded p-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name} x {item.quantity}kg</span>
                      <span className="font-semibold">₱{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Timeline */}
                <div className="mb-6 py-4">
                  <div className="flex items-center justify-between relative">
                    {/* Background connecting line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" style={{left: '2.5%', right: '2.5%'}} />
                    <div 
                      className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-500" 
                      style={{
                        left: '2.5%',
                        width: order.status === 'pending' ? '0%' : 
                               order.status === 'processing' ? '32%' : 
                               order.status === 'in-transit' ? '65%' : '95%'
                      }}
                    />
                    
                    {/* Timeline Steps */}
                    {[
                      { key: 'pending', label: 'Order Placed', icon: '📝' },
                      { key: 'processing', label: 'Processing', icon: '⚙️' },
                      { key: 'in-transit', label: 'In Transit', icon: '🚚' },
                      { key: 'delivered', label: 'Delivered', icon: '✅' }
                    ].map((step, idx) => {
                      const statuses = ['pending', 'processing', 'in-transit', 'delivered'];
                      const currentIndex = statuses.indexOf(order.status);
                      const stepIndex = statuses.indexOf(step.key);
                      const isCompleted = stepIndex <= currentIndex;
                      const isCurrent = stepIndex === currentIndex;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-primary text-white shadow-lg scale-110' 
                              : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'ring-4 ring-primary ring-opacity-30 animate-pulse' : ''}`}>
                            {step.icon}
                          </div>
                          <p className={`text-xs font-semibold text-center ${
                            isCompleted ? 'text-primary' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Status Info */}
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    {order.status === 'delivered' ? (
                      <p className="text-sm text-green-600">✓ Delivered on {order.deliveryDate}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Estimated delivery: {order.estimatedDelivery}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition">
                      View Details
                    </button>
                    {order.status === 'delivered' && !order.rating && (
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition">
                        Rate Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition">
                        Buy Again
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">No orders found</p>
            <a href="/consumer/products" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition inline-block">
              Start Shopping
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerOrders;
