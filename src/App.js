import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PublicProducts from './pages/PublicProducts';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminUsers from './pages/admin/AdminUsers';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerMessages from './pages/farmer/FarmerMessages';
import FarmerProfile from './pages/farmer/FarmerProfile';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerProducts from './pages/consumer/ConsumerProducts';
import ConsumerCart from './pages/consumer/ConsumerCart';
import ConsumerOrders from './pages/consumer/ConsumerOrders';
import ConsumerMessages from './pages/consumer/ConsumerMessages';
import ConsumerProfile from './pages/consumer/ConsumerProfile';
import ConsumerOrderStatus from './pages/consumer/ConsumerOrderStatus';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<PublicProducts />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminTransactions />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        
        {/* Farmer Routes */}
        <Route path="/farmer" element={
          <ProtectedRoute allowedTypes={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/farmer/products" element={
          <ProtectedRoute allowedTypes={['farmer']}>
            <FarmerProducts />
          </ProtectedRoute>
        } />
        <Route path="/farmer/orders" element={
          <ProtectedRoute allowedTypes={['farmer']}>
            <FarmerOrders />
          </ProtectedRoute>
        } />
        <Route path="/farmer/messages" element={
          <ProtectedRoute allowedTypes={['farmer']}>
            <FarmerMessages />
          </ProtectedRoute>
        } />
        <Route path="/farmer/profile" element={
          <ProtectedRoute allowedTypes={['farmer']}>
            <FarmerProfile />
          </ProtectedRoute>
        } />
        
        {/* Consumer Routes */}
        <Route path="/consumer" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/consumer/products" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerProducts />
          </ProtectedRoute>
        } />
        <Route path="/consumer/cart" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerCart />
          </ProtectedRoute>
        } />
        <Route path="/consumer/orders" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerOrders />
          </ProtectedRoute>
        } />
        <Route path="/consumer/messages" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerMessages />
          </ProtectedRoute>
        } />
        <Route path="/consumer/profile" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerProfile />
          </ProtectedRoute>
        } />
        <Route path="/consumer/order-status" element={
          <ProtectedRoute allowedTypes={['consumer']}>
            <ConsumerOrderStatus />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
