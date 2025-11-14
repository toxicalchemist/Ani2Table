// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Get cart items
export const getCart = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, cartItems: data.cartItems } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get cart error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Add to cart error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update cart item
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Update cart error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Remove from cart error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Clear cart error:', error);
    return { success: false, error: 'Network error' };
  }
};
