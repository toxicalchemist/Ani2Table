import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const AdminOrders = () => {
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
        <Sidebar userType="admin" />
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
            <p className="text-gray-500 text-sm font-semibold">Shipped</p>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
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
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' },
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    // Safety check for items array
                    if (!order.items || order.items.length === 0) {
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                          <td className="py-4 px-6 font-medium">#{order.id}</td>
                          <td className="py-4 px-6 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6">{order.consumerName}</td>
                          <td className="py-4 px-6 text-gray-600">N/A</td>
                          <td className="py-4 px-6 text-gray-500">No items</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">N/A</td>
                          <td className="py-4 px-6 font-bold text-primary">₱{order.totalAmount.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition text-sm font-bold">
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    const firstItem = order.items[0];
                    const itemCount = order.items.length;
                    const productDisplay = itemCount > 1 
                      ? `${firstItem.productName} +${itemCount - 1} more` 
                      : firstItem.productName;
                    const imageUrl = firstItem?.imageUrl 
                      ? `http://localhost:5000${firstItem.imageUrl}` 
                      : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100';

                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-4 px-6 font-medium">#{order.id}</td>
                        <td className="py-4 px-6 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6">{order.consumerName}</td>
                        <td className="py-4 px-6 text-gray-600">{firstItem?.farmerName}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={imageUrl} 
                              alt={productDisplay}
                              className="w-12 h-12 rounded object-cover border-2 border-gray-200"
                            />
                            <span>{productDisplay}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mr-1 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{order.deliveryAddress || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-primary">₱{order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition text-sm font-bold">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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

export default AdminOrders;
