// Authentication Service using API

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Helper function to save token
const saveToken = (token) => localStorage.setItem('ani2table_token', token);

// Helper function to remove token
const removeToken = () => localStorage.removeItem('ani2table_token');

// Helper function to get user from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('ani2table_user');
    if (!user) return null;
    const parsed = JSON.parse(user);
    return parsed;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('ani2table_user');
    return null;
  }
};

// Helper function to save user to localStorage
const saveUser = (user) => localStorage.setItem('ani2table_user', JSON.stringify(user));

// Helper function to remove user from localStorage
const removeUser = () => localStorage.removeItem('ani2table_user');

// Register new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      saveToken(data.token);
      saveUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Login user
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      saveToken(data.token);
      saveUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Logout user
export const logout = () => {
  removeToken();
  removeUser();
  return { success: true };
};

// Get current user
export const getCurrentUser = () => {
  return getStoredUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user profile from API
export const getProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      saveUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (data.success) {
      // Refresh user data
      await getProfile();
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Initialize demo accounts (for backward compatibility - not needed with database)
export const initializeDemoAccounts = () => {
  console.log('Demo accounts are now in the database');
};

// Get dashboard route based on user type
export const getDashboardRoute = (userType) => {
  switch (userType) {
    case 'admin':
      return '/admin';
    case 'farmer':
      return '/farmer';
    case 'consumer':
    default:
      return '/consumer';
  }
};
