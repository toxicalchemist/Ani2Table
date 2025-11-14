// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Get all products
export const getAllProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.farmerId) params.append('farmerId', filters.farmerId);

    const url = `${API_URL}/products${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.success ? { success: true, products: data.products } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get products error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get single product
export const getProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    const data = await response.json();

    return data.success ? { success: true, product: data.product } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get product error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Create product (farmers only)
export const createProduct = async (productData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData, // FormData handles Content-Type automatically
    });

    const data = await response.json();
    return data.success ? { success: true, productId: data.productId } : { success: false, error: data.error };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData, // FormData handles Content-Type automatically
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update product status (admin only) - approve/reject
export const updateProductStatus = async (productId, status) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${productId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data.success ? { success: true, message: data.message } : { success: false, error: data.error };
  } catch (error) {
    console.error('Update product status error:', error);
    return { success: false, error: 'Network error' };
  }
};
