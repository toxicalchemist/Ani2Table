import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminOrders from './pages/admin/AdminOrders';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerMessages from './pages/farmer/FarmerMessages';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerProducts from './pages/consumer/ConsumerProducts';
import ConsumerCart from './pages/consumer/ConsumerCart';
import ConsumerOrders from './pages/consumer/ConsumerOrders';
import ConsumerMessages from './pages/consumer/ConsumerMessages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        
        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer/products" element={<FarmerProducts />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/farmer/messages" element={<FarmerMessages />} />
        
        {/* Consumer Routes */}
        <Route path="/consumer" element={<ConsumerDashboard />} />
        <Route path="/consumer/products" element={<ConsumerProducts />} />
        <Route path="/consumer/cart" element={<ConsumerCart />} />
        <Route path="/consumer/orders" element={<ConsumerOrders />} />
        <Route path="/consumer/messages" element={<ConsumerMessages />} />
      </Routes>
    </Router>
  );
}

export default App;
