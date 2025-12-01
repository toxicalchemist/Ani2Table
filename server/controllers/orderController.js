import { pool } from '../config/db.js';

const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD) || 5;

// Create order from cart
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { paymentMethod, deliveryAddress, notes } = req.body;

    // Get cart items (include product name for clearer errors)
    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price, p.quantity as stock, p.farmer_id, p.name as product_name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.consumer_id = ? AND p.status = 'available'`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Check stock availability for all items and collect problems
    const insufficient = [];
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        insufficient.push({
          productId: item.product_id,
          productName: item.product_name,
          requested: item.quantity,
          available: item.stock
        });
      }
    }

    if (insufficient.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock for one or more items',
        details: insufficient
      });
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

    // Create order items (do NOT adjust inventory yet; inventory is adjusted on delivery)
    for (const item of cartItems) {
      const subtotal = parseFloat(item.price) * item.quantity;
      
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.farmer_id, item.quantity, item.price, subtotal]
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

    // Check if order exists and get current status and inventory flag
    let orders;
    try {
      const [rows] = await pool.query('SELECT id, status, IFNULL(inventory_adjusted, 0) as inventory_adjusted FROM orders WHERE id = ?', [req.params.id]);
      orders = rows;
    } catch (err) {
      // If the column `inventory_adjusted` does not exist (older schema), try to add it and retry
      if (err && (err.code === 'ER_BAD_FIELD_ERROR' || (err.sqlMessage && err.sqlMessage.toLowerCase().includes('unknown column')))) {
        try {
          console.warn('inventory_adjusted column missing; attempting to add column to orders table');
          await pool.query('ALTER TABLE orders ADD COLUMN inventory_adjusted TINYINT(1) DEFAULT 0');
          const [rows] = await pool.query('SELECT id, status, IFNULL(inventory_adjusted, 0) as inventory_adjusted FROM orders WHERE id = ?', [req.params.id]);
          orders = rows;
        } catch (alterErr) {
          console.error('Failed to add inventory_adjusted column:', alterErr.message || alterErr);
          return res.status(500).json({ success: false, error: 'Server schema error. Please add inventory_adjusted column to orders table.' });
        }
      } else {
        console.error('Error selecting order:', err.message || err);
        return res.status(500).json({ success: false, error: 'Server error' });
      }
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const currentStatus = orders[0].status;

    // If status becomes 'delivered', and inventory hasn't been adjusted, decrement product stock
    const inventoryAdjusted = orders[0].inventory_adjusted === 1;

    if (status === 'delivered' && !inventoryAdjusted) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [req.params.id]);

        for (const item of items) {
          // Lock the product row and compute new values in JS to avoid SQL parsing issues
          const [productRows] = await connection.query('SELECT quantity FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
          const currentQty = productRows.length ? Number(productRows[0].quantity) : 0;
          const newQty = Math.max(currentQty - item.quantity, 0);
          const isLow = newQty <= LOW_STOCK_THRESHOLD ? 1 : 0;
          const newStatus = newQty <= 0 ? 'out_of_stock' : 'available';

          await connection.query(
            `UPDATE products SET quantity = ?, is_low_stock = ?, status = ? WHERE id = ?`,
            [newQty, isLow, newStatus, item.product_id]
          );
          const qty = Number(item.quantity);
          // Decrement with floor at 0
          const decSql = 'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?';
          const decParams = [qty, item.product_id];
          console.log('Executing SQL (delivery dec):', decSql, decParams);
          if (!item.product_id || Number.isNaN(qty)) {
            console.warn('Skipping inventory update for invalid item', item);
            continue;
          }
          await connection.query(decSql, decParams);

          // Update low stock flag and status based on new quantity
          const flagSql = 'UPDATE products SET is_low_stock = CASE WHEN quantity <= ? THEN 1 ELSE 0 END, status = CASE WHEN quantity <= 0 THEN \"out_of_stock\" ELSE \"available\" END WHERE id = ?';
          const flagParams = [LOW_STOCK_THRESHOLD, item.product_id];
          console.log('Executing SQL (delivery flag):', flagSql, flagParams);
          await connection.query(flagSql, flagParams);
        }

        await connection.query('UPDATE orders SET status = ?, inventory_adjusted = 1 WHERE id = ?', [status, req.params.id]);

        await connection.commit();
        connection.release();

        return res.json({ success: true, message: 'Order marked delivered and inventory adjusted' });
      } catch (err) {
        await connection.rollback();
        connection.release();
        console.error('Error adjusting inventory on delivery:', err.message || err, 'sql:', err.sql || '', 'sqlMessage:', err.sqlMessage || '');
        return res.status(500).json({ success: false, error: 'Failed to adjust inventory on delivery' });
      }
    }

    // If cancelling an order and inventory was already adjusted (delivered), restore stock
    if (status === 'cancelled' && inventoryAdjusted) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [items] = await connection.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [req.params.id]);

        for (const item of items) {
          // Lock the product row and compute new values in JS to avoid SQL parsing issues
          const [productRows] = await connection.query('SELECT quantity FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
          const currentQty = productRows.length ? Number(productRows[0].quantity) : 0;
          const newQty = currentQty + item.quantity;
          const isLow = newQty <= LOW_STOCK_THRESHOLD ? 1 : 0;
          const newStatus = newQty <= 0 ? 'out_of_stock' : 'available';

          await connection.query(
            `UPDATE products SET quantity = ?, is_low_stock = ?, status = ? WHERE id = ?`,
            [newQty, isLow, newStatus, item.product_id]
          );
          const qty = Number(item.quantity);
            // Increase quantity
            const incSql = 'UPDATE products SET quantity = quantity + ? WHERE id = ?';
            const incParams = [qty, item.product_id];
            console.log('Executing SQL (restore inc):', incSql, incParams);
            if (!item.product_id || Number.isNaN(qty)) {
              console.warn('Skipping inventory restore for invalid item', item);
              continue;
            }
            await connection.query(incSql, incParams);

            // Update low stock flag and status again
            const flagSqlRestore = 'UPDATE products SET is_low_stock = CASE WHEN quantity <= ? THEN 1 ELSE 0 END, status = CASE WHEN quantity <= 0 THEN \"out_of_stock\" ELSE \"available\" END WHERE id = ?';
            const flagParamsRestore = [LOW_STOCK_THRESHOLD, item.product_id];
            console.log('Executing SQL (restore flag):', flagSqlRestore, flagParamsRestore);
            await connection.query(flagSqlRestore, flagParamsRestore);
        }

        await connection.query('UPDATE orders SET status = ?, inventory_adjusted = 0 WHERE id = ?', [status, req.params.id]);

        await connection.commit();
        connection.release();

        return res.json({ success: true, message: 'Order cancelled and inventory restored' });
      } catch (err) {
        await connection.rollback();
        connection.release();
          console.error('Error restoring stock on cancel after delivery:', err.message || err, 'sql:', err.sql || '', 'sqlMessage:', err.sqlMessage || '');
        return res.status(500).json({ success: false, error: 'Failed to cancel order and restore stock' });
      }
    }

    // For other status changes (or cancelling where inventory wasn't adjusted), just update the status
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    console.error('Update order status error:', error.message || error, 'sql:', error.sql || '', 'sqlMessage:', error.sqlMessage || '');
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
