import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getOrders } from '../../services/orderService';
import { sendMessage } from '../../services/messageService';

const ConsumerOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getOrders();
    if (result.success) {
      const ordersList = result.orders || [];
      // Filter to show only active orders (not cancelled or delivered)
      const activeOrders = ordersList.filter(o => 
        ['pending', 'processing', 'shipped'].includes(o.status)
      );
      setOrders(activeOrders);
      
      // Set the first active order as selected
      if (activeOrders.length > 0) {
        setActiveOrder(activeOrders[0]);
      }
    } else {
      setToast({ message: result.error || 'Failed to load orders', type: 'error' });
    }
    setLoading(false);
  };

  const handleContactFarmer = async () => {
    if (!contactMessage.trim()) {
      setToast({ message: 'Please enter a message', type: 'warning' });
      return;
    }

    if (!activeOrder || !activeOrder.items || activeOrder.items.length === 0) {
      setToast({ message: 'No farmer information available', type: 'error' });
      return;
    }

    // Get farmer ID from the first item
    const farmerId = activeOrder.items[0].farmerId;
    
    const result = await sendMessage(
      farmerId,
      `Regarding Order #${activeOrder.id}`,
      contactMessage
    );

    if (result.success) {
      setToast({ message: 'Message sent to farmer successfully!', type: 'success' });
      setShowContactModal(false);
      setContactMessage('');
    } else {
      setToast({ message: result.error || 'Failed to send message', type: 'error' });
    }
  };

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

  if (!activeOrder) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar userType="consumer" />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
            <p className="text-gray-600">Real-time updates on your delivery</p>
          </div>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">No active orders to track</p>
            <a href="/consumer/products" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition inline-block">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Map status to proper sequence
  const statusSequence = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statusSequence.indexOf(activeOrder.status);
  
  const getEstimatedDelivery = () => {
    const orderDate = new Date(activeOrder.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 3); // 3 days from order
    return estimatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const farmerName = activeOrder.items && activeOrder.items.length > 0 
    ? activeOrder.items[0].farmerName 
    : 'Unknown Farmer';
  
  const orderStatuses = [
    {
      status: 'pending',
      label: 'Order Confirmed',
      date: new Date(activeOrder.createdAt).toLocaleDateString(),
      time: new Date(activeOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      completed: currentStatusIndex >= 0,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    },
    {
      status: 'processing',
      label: 'Processing',
      date: currentStatusIndex >= 1 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleDateString() : '',
      time: currentStatusIndex >= 1 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
      completed: currentStatusIndex >= 1,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    },
    {
      status: 'shipped',
      label: 'Shipped',
      date: currentStatusIndex >= 2 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleDateString() : '',
      time: currentStatusIndex >= 2 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
      completed: currentStatusIndex >= 2,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      )
    },
    {
      status: 'delivered',
      label: 'Delivered',
      date: currentStatusIndex >= 3 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleDateString() : `Est. ${getEstimatedDelivery()}`,
      time: currentStatusIndex >= 3 ? new Date(activeOrder.updatedAt || activeOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
      completed: currentStatusIndex >= 3,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      )
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
          <p className="text-gray-600">Real-time updates on your delivery</p>
        </div>

        {/* Order Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Order #{activeOrder.id}</h2>
              <p className="text-gray-200">Ordered on {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-200">Estimated Delivery</p>
              <p className="text-2xl font-bold">{getEstimatedDelivery()}</p>
            </div>
            {orders.length > 1 && (
              <div>
                <label className="block text-sm text-gray-200 mb-2">Switch Order</label>
                <select
                  value={activeOrder.id}
                  onChange={(e) => {
                    const order = orders.find(o => o.id === parseInt(e.target.value));
                    if (order) setActiveOrder(order);
                  }}
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold"
                >
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.status}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Status</h3>
              
              {/* Status Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-primary">
                    {currentStatusIndex >= 0 ? Math.round(((currentStatusIndex + 1) / statusSequence.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentStatusIndex >= 0 ? ((currentStatusIndex + 1) / statusSequence.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {orderStatuses.map((status, index) => {
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={status.status} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          status.completed
                            ? 'bg-primary text-white'
                            : isCurrent
                            ? 'bg-secondary text-white animate-pulse'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {status.icon}
                          </svg>
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`w-0.5 h-16 ${
                            status.completed ? 'bg-primary' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-bold text-lg ${
                              status.completed || isCurrent ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {status.label}
                            </h4>
                            {status.date && (
                              <p className="text-sm text-gray-600">
                                {status.date} {status.time && `• ${status.time}`}
                              </p>
                            )}
                          </div>
                          {status.completed && (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                              ✓ Completed
                            </span>
                          )}
                          {isCurrent && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                              ⏳ In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Location</h3>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 font-semibold">Delivery Address</p>
                  <p className="text-sm text-gray-500 mt-1">{activeOrder.deliveryAddress || 'No address provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.quantity}{item.unit} × ₱{(item.subtotal / item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="font-bold text-primary">₱{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">₱{activeOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800">₱0.00</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-primary text-xl">₱{activeOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Farmer Information</h3>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl">🌾</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800">{farmerName}</h4>
                <p className="text-sm text-gray-600">Verified Farmer</p>
              </div>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition"
              >
                Contact Farmer
              </button>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{activeOrder.paymentMethod}</p>
                  <p className="text-sm text-gray-600">Payment Confirmed</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h4 className="font-bold text-gray-800 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                Get Support
              </button>
            </div>
          </div>
        </div>

        {/* Contact Farmer Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Contact {farmerName}</h2>
                  <button 
                    onClick={() => {
                      setShowContactModal(false);
                      setContactMessage('');
                    }}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Regarding: Order #{activeOrder.id}</p>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows="5"
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setContactMessage('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContactFarmer}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default ConsumerOrderStatus;
