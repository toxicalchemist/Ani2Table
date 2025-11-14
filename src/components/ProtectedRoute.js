import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ children, allowedTypes }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Additional safety check for userType
  if (!currentUser.userType) {
    console.error('User object missing userType:', currentUser);
    return <Navigate to="/login" replace />;
  }
  
  if (allowedTypes && !allowedTypes.includes(currentUser.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
