import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const FarmerOrders = () => {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getOrders();
    if (result.success) {
      setOrders(result.orders || []);
    } else {
      setToast({ message: result.error || 'Failed to load orders', type: 'error' });
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setToast({ message: 'Order status updated successfully!', type: 'success' });
      await loadOrders();
    } else {
      setToast({ message: result.error || 'Failed to update order', type: 'error' });
    }
  };

  const handleAccept = (orderId) => {
    if (window.confirm('Accept this order?')) {
      handleStatusUpdate(orderId, 'processing');
    }
  };

  const handleDecline = (orderId) => {
    if (window.confirm('Decline this order? This action cannot be undone.')) {
      handleStatusUpdate(orderId, 'cancelled');
    }
  };

  const handleShip = (orderId) => {
    if (window.confirm('Mark this order as shipped?')) {
      handleStatusUpdate(orderId, 'shipped');
    }
  };

  const handleDeliver = (orderId) => {
    if (window.confirm('Mark this order as delivered?')) {
      handleStatusUpdate(orderId, 'delivered');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar userType="farmer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Delivered</p>
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
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' },
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
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items[0];
              const itemCount = order.items.length;
              const imageUrl = firstItem?.imageUrl 
                ? `http://localhost:5000${firstItem.imageUrl}` 
                : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
              const productDisplay = itemCount > 1 
                ? `${firstItem.productName} +${itemCount - 1} more` 
                : firstItem.productName;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-primary">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Product Image */}
                    <img 
                      src={imageUrl} 
                      alt={productDisplay}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                    />
                    
                    {/* Order Info */}
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-800 font-semibold mb-1">{order.consumerName}</p>
                      <p className="text-gray-600 mb-2">{productDisplay}</p>
                      <div className="flex items-start text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{order.deliveryAddress || 'No address provided'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">📅 {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary mb-2">₱{order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 min-w-[140px]">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAccept(order.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow"
                          >
                            ✓ Accept
                          </button>
                          <button 
                            onClick={() => handleDecline(order.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow"
                          >
                            ✗ Decline
                          </button>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <button 
                          onClick={() => handleShip(order.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow"
                        >
                          🚚 Ship Order
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => handleDeliver(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-bold text-sm shadow"
                        >
                          ✅ Mark Delivered
                        </button>
                      )}
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-bold text-sm">
                        📋 Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FarmerOrders;
