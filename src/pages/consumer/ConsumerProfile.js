import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getCurrentUser, getProfile, updateProfile } from '../../services/authService';
import { getOrders } from '../../services/orderService';
import { getAllProducts } from '../../services/productService';

const ConsumerProfile = () => {
  const currentUser = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: ''
  });
  const [profileData, setProfileData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    address: '',
    deliveryInstructions: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadProfile(),
      loadOrderHistory(),
      loadFavoriteProducts()
    ]);
    setLoading(false);
  };

  const loadProfile = async () => {
    const result = await getProfile();
    if (result.success && result.user) {
      const user = result.user;
      setProfileData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.contactNumber || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        address: user.address || '',
        deliveryInstructions: user.deliveryInstructions || '',
      });
      
      // Calculate member since date
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        setStats(prev => ({ ...prev, memberSince: monthYear }));
      }
    }
  };

  const loadOrderHistory = async () => {
    const result = await getOrders();
    if (result.success) {
      const orders = result.orders || [];
      // Get recent 3 orders
      const recentOrders = orders.slice(0, 3).map(order => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString(),
        items: order.items?.length || 0,
        total: order.totalAmount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));
      setOrderHistory(recentOrders);
      
      // Calculate stats
      const totalSpent = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalSpent: totalSpent
      }));
    }
  };

  const loadFavoriteProducts = async () => {
    const result = await getAllProducts();
    if (result.success) {
      // Get first 2 available products as favorites
      const products = (result.products || [])
        .filter(p => p.status === 'available')
        .slice(0, 2)
        .map(p => ({
          name: p.name,
          price: p.price,
          image: p.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200'
        }));
      setFavoriteProducts(products);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    const result = await updateProfile({
      firstName: profileData.firstName,
      middleName: profileData.middleName,
      lastName: profileData.lastName,
      birthday: profileData.birthday,
      gender: profileData.gender,
      contactNumber: profileData.phone,
      address: profileData.address
    });
    
    if (result.success) {
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      await loadProfile();
    } else {
      setToast({ message: result.error || 'Failed to update profile', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">
                {profileData.firstName} {profileData.middleName} {profileData.lastName}
              </h2>
              <p className="text-gray-200 text-lg mb-2">Consumer Account</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profileData.email}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {profileData.phone}
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="middleName"
                      value={profileData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.middleName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birthday</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={profileData.birthday}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.birthday}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-600 capitalize">{profileData.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Instructions</label>
                  {isEditing ? (
                    <textarea
                      name="deliveryInstructions"
                      value={profileData.deliveryInstructions}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.deliveryInstructions}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
              {orderHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">#{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₱{order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-bold text-xl text-primary">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-bold text-xl text-gray-800">₱{stats.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-sm text-gray-800">{stats.memberSince || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Favorite Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h3>
              {favoriteProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products available</p>
              ) : (
                <div className="space-y-3">
                  {favoriteProducts.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-primary font-bold">₱{product.price}/kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Loyalty Badge */}
            <div className="bg-gradient-to-br from-secondary to-secondary-light text-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="text-xl font-bold mb-2">Gold Member</h3>
              <p className="text-sm opacity-90">You've earned gold status for your loyalty!</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition shadow-lg"
            >
              Save Changes
            </button>
          </div>
        )}
          </>
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

export default ConsumerProfile;
