import { pool } from '../config/db.js';

// Create order from cart
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { paymentMethod, deliveryAddress, notes } = req.body;

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price, p.quantity as stock, p.farmer_id
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.consumer_id = ? AND p.status = 'available'`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for product ID ${item.product_id}` 
        });
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (consumer_id, total_amount, payment_method, delivery_address, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, totalAmount, paymentMethod, deliveryAddress, notes]
    );

    const orderId = orderResult.insertId;

    // Create order items and update product quantities
    for (const item of cartItems) {
      const subtotal = parseFloat(item.price) * item.quantity;
      
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.farmer_id, item.quantity, item.price, subtotal]
      );

      await connection.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE consumer_id = ?', [req.user.id]);

    // Create transaction record
    await connection.query(
      `INSERT INTO transactions (order_id, amount, payment_method, transaction_type, status)
       VALUES (?, ?, ?, 'payment', 'pending')`,
      [orderId, totalAmount, paymentMethod]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    connection.release();
  }
};

// Get orders (consumer/farmer/admin)
export const getOrders = async (req, res) => {
  try {
    let query = `
      SELECT o.*, 
             u.first_name as consumer_first_name,
             u.last_name as consumer_last_name,
             u.contact_number as consumer_contact
      FROM orders o
      JOIN users u ON o.consumer_id = u.id
    `;
    const params = [];

    if (req.user.userType === 'consumer') {
      query += ' WHERE o.consumer_id = ?';
      params.push(req.user.id);
    } else if (req.user.userType === 'farmer') {
      query += ` WHERE o.id IN (
        SELECT DISTINCT order_id FROM order_items WHERE farmer_id = ?
      )`;
      params.push(req.user.id);
    }
    // Admin sees all orders

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query(
          `SELECT oi.*, p.name as product_name, p.unit, p.image_url,
                  u.first_name as farmer_first_name, u.last_name as farmer_last_name
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           JOIN users u ON oi.farmer_id = u.id
           WHERE oi.order_id = ?`,
          [order.id]
        );

        return {
          id: order.id,
          consumerId: order.consumer_id,
          consumerName: `${order.consumer_first_name} ${order.consumer_last_name}`,
          consumerContact: order.consumer_contact,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          deliveryAddress: order.delivery_address,
          notes: order.notes,
          createdAt: order.created_at,
          items: items.map(item => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            farmerId: item.farmer_id,
            farmerName: `${item.farmer_first_name} ${item.farmer_last_name}`,
            quantity: item.quantity,
            unit: item.unit,
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal),
            imageUrl: item.image_url
          }))
        };
      })
    );

    res.json({
      success: true,
      orders: ordersWithItems
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, 
              u.first_name as consumer_first_name,
              u.last_name as consumer_last_name,
              u.contact_number as consumer_contact,
              u.email as consumer_email
       FROM orders o
       JOIN users u ON o.consumer_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = orders[0];

    // Check authorization
    if (req.user.userType === 'consumer' && order.consumer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.name as product_name, p.unit, p.image_url,
              u.first_name as farmer_first_name, u.last_name as farmer_last_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON oi.farmer_id = u.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      order: {
        id: order.id,
        consumerId: order.consumer_id,
        consumerName: `${order.consumer_first_name} ${order.consumer_last_name}`,
        consumerContact: order.consumer_contact,
        consumerEmail: order.consumer_email,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        deliveryAddress: order.delivery_address,
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: items.map(item => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          imageUrl: item.image_url,
          farmerId: item.farmer_id,
          farmerName: `${item.farmer_first_name} ${item.farmer_last_name}`,
          quantity: item.quantity,
          unit: item.unit,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal)
        }))
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update order status (farmer/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    // Check if order exists
    const [orders] = await pool.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update payment status (admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const validStatuses = ['pending', 'paid', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid payment status' });
    }

    await pool.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, req.params.id]
    );

    res.json({
      success: true,
      message: 'Payment status updated'
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
