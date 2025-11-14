// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('ani2table_token');

// Get messages
export const getMessages = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true, messages: data.messages } : { success: false, error: data.error };
  } catch (error) {
    console.error('Get messages error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Send message
export const sendMessage = async (receiverId, subject, message) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, subject, message }),
    });

    const data = await response.json();
    return data.success ? { success: true, messageId: data.messageId } : { success: false, error: data.error };
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Mark message as read
export const markAsRead = async (messageId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Mark as read error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Delete message
export const deleteMessage = async (messageId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? { success: true } : { success: false, error: data.error };
  } catch (error) {
    console.error('Delete message error:', error);
    return { success: false, error: 'Network error' };
  }
};
