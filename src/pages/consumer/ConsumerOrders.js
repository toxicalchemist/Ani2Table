import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const ConsumerOrders = () => {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadOrders();
    
    // Listen for order placement events from cart
    const handleOrderPlaced = () => {
      loadOrders();
    };
    
    window.addEventListener('orderPlaced', handleOrderPlaced);
    
    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
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

  const handleCancelOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to cancel Order #${orderNumber}?`)) {
      const result = await updateOrderStatus(orderId, 'cancelled');
      if (result.success) {
        setToast({ message: 'Order cancelled successfully', type: 'success' });
        await loadOrders();
      } else {
        setToast({ message: result.error || 'Failed to cancel order', type: 'error' });
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
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
        <Sidebar userType="consumer" />
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
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
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
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                    {order.items[0] && (
                      <p className="text-sm text-gray-600">From {order.items[0].farmerName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₱{order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded p-4 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.productName} x {item.quantity}{item.unit}</span>
                      <span className="font-semibold">₱{item.subtotal.toFixed(2)}</span>
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
                               order.status === 'shipped' ? '65%' : 
                               order.status === 'delivered' ? '95%' : '0%'
                      }}
                    />
                    
                    {/* Timeline Steps */}
                    {[
                      { key: 'pending', label: 'Order Placed', icon: '📝' },
                      { key: 'processing', label: 'Processing', icon: '⚙️' },
                      { key: 'shipped', label: 'Shipped', icon: '🚚' },
                      { key: 'delivered', label: 'Delivered', icon: '✅' }
                    ].map((step) => {
                      const statuses = ['pending', 'processing', 'shipped', 'delivered'];
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
                      <p className="text-sm text-green-600">✓ Delivered on {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}</p>
                    ) : order.status === 'cancelled' ? (
                      <p className="text-sm text-red-600">✗ Order cancelled</p>
                    ) : (
                      <p className="text-sm text-gray-600">Order placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
                    >
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition">
                        Buy Again
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelOrder(order.id, order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      >
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

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="text-lg font-bold">#{selectedOrder.id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Order Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.unit} × ₱{(item.subtotal / item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">Farmer: {item.farmerName}</p>
                          </div>
                          <p className="font-bold text-primary">₱{item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-semibold">₱{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Delivery Fee</p>
                      <p className="font-semibold">₱0.00</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <p>Total</p>
                      <p className="text-primary">₱{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                    <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                    <p className="text-sm text-gray-600 mt-1">Status: {selectedOrder.paymentStatus}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                    <p className="font-semibold">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerOrders;
