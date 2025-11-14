import { pool } from '../config/db.js';

// Get messages for user
export const getMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, 
              s.username as sender_username,
              s.first_name as sender_first_name,
              s.last_name as sender_last_name,
              r.username as receiver_username,
              r.first_name as receiver_first_name,
              r.last_name as receiver_last_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.id, req.user.id]
    );

    res.json({
      success: true,
      messages: messages.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: `${m.sender_first_name} ${m.sender_last_name}`,
        senderUsername: m.sender_username,
        receiverId: m.receiver_id,
        receiverName: `${m.receiver_first_name} ${m.receiver_last_name}`,
        receiverUsername: m.receiver_username,
        subject: m.subject,
        message: m.message,
        isRead: m.is_read,
        createdAt: m.created_at
      }))
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, subject, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Receiver and message are required' 
      });
    }

    // Check if receiver exists
    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ? AND is_active = TRUE',
      [receiverId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'Receiver not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, subject, message) VALUES (?, ?, ?, ?)',
      [req.user.id, receiverId, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    // Check if user is the receiver
    const [messages] = await pool.query(
      'SELECT receiver_id FROM messages WHERE id = ?',
      [req.params.id]
    );

    if (messages.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    if (messages[0].receiver_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)',
      [req.params.id, req.user.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
