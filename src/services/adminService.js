// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Get analytics data
export const getAnalytics = async (period = 'monthly') => {
  try {
    const token = getToken();
    const url = `${API_URL}/admin/analytics?period=${encodeURIComponent(period)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, analytics: data.analytics } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get analytics error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, transactions: data.transactions } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get transactions error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get all users
export const getAllUsers = async (userType = null) => {
  try {
    const token = getToken();
    const url = userType ? `${API_URL}/admin/users?userType=${userType}` : `${API_URL}/admin/users`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, users: data.users } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, error: 'Network error' };
  }
};
