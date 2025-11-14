// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Get all transactions (admin only)
export const getTransactions = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/transactions`, {
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

// Get single transaction
export const getTransaction = async (transactionId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, transaction: data.transaction } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get transaction error:', error);
    return { success: false, error: 'Network error' };
  }
};
