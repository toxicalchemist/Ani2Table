// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Create order
export const createOrder = async (orderData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    return data.success ? { success: true, orderId: data.orderId } : { success: false, error: data.error };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get all orders
export const getOrders = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, orders: data.orders } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get orders error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get single order
export const getOrder = async (orderId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, order: data.order } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get order error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentStatus }),
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Update payment status error:', error);
    return { success: false, error: 'Network error' };
  }
};
