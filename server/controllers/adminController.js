import { pool } from '../config/db.js';

// Get analytics data (admin only)
export const getAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // expected values: 'weekly', 'monthly', 'all'
    // Get total users by type
    const [userStats] = await pool.query(`
      SELECT user_type, COUNT(*) as count
      FROM users
      WHERE is_active = TRUE
      GROUP BY user_type
    `);

    // Get total products
    const [productStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_products,
        SUM(CASE WHEN status = 'out_of_stock' THEN 1 ELSE 0 END) as out_of_stock
      FROM products
    `);

    // Get order statistics
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
      FROM orders
    `);

    // Get recent orders
    const [recentOrders] = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at,
             u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.consumer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Get top products
    const [topProducts] = await pool.query(`
      SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Get time-series revenue based on requested period
    let timeSeriesQuery;
    if (period === 'weekly') {
      // last 7 days grouped by day
      timeSeriesQuery = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m-%d') as month,
          SUM(total_amount) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE status = 'delivered'
          AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
        ORDER BY month
      `;
    } else if (period === 'all') {
      // all time grouped by year-month
      timeSeriesQuery = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_amount) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE status = 'delivered'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `;
    } else {
      // default monthly - last 12 months
      timeSeriesQuery = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_amount) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE status = 'delivered'
          AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `;
    }

    const [monthlyRevenue] = await pool.query(timeSeriesQuery);

    res.json({
      success: true,
      analytics: {
        users: userStats.reduce((acc, stat) => {
          acc[stat.user_type] = stat.count;
          return acc;
        }, {}),
        products: productStats[0],
        orders: {
          ...orderStats[0],
          total_revenue: parseFloat(orderStats[0].total_revenue || 0)
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          amount: parseFloat(order.total_amount),
          status: order.status,
          customerName: `${order.first_name} ${order.last_name}`,
          date: order.created_at
        })),
        topProducts: topProducts.map(product => ({
          name: product.name,
          totalSold: product.total_sold,
          revenue: parseFloat(product.revenue)
        })),
        monthlyRevenue: monthlyRevenue.map(data => ({
          month: data.month,
          revenue: parseFloat(data.revenue),
          orderCount: data.order_count
        }))
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get transactions (admin only)
export const getTransactions = async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT t.*, o.consumer_id,
             u.first_name, u.last_name, u.email
      FROM transactions t
      JOIN orders o ON t.order_id = o.id
      JOIN users u ON o.consumer_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        orderId: t.order_id,
        transactionType: t.transaction_type,
        amount: parseFloat(t.amount),
        paymentMethod: t.payment_method,
        transactionReference: t.transaction_reference,
        status: t.status,
        customerName: `${t.first_name} ${t.last_name}`,
        customerEmail: t.email,
        createdAt: t.created_at
      }))
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { userType } = req.query;
    
    let query = `
      SELECT id, username, email, first_name, last_name, 
             contact_number, user_type, is_active, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (userType) {
      query += ' AND user_type = ?';
      params.push(userType);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.query(query, params);

    res.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        contactNumber: u.contact_number,
        userType: u.user_type,
        isActive: u.is_active,
        createdAt: u.created_at
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all farmers with full details (admin only)
export const getFarmers = async (req, res) => {
  try {
    const [farmers] = await pool.query(`
      SELECT id as userId, username, email, first_name, last_name, middle_name,
             birthday, gender, contact_number, address, is_active, created_at
      FROM users
      WHERE user_type = 'farmer'
      ORDER BY created_at DESC
    `);

    res.json(farmers.map(f => ({
      userId: f.userId,
      username: f.username,
      email: f.email,
      firstName: f.first_name,
      lastName: f.last_name,
      middleName: f.middle_name,
      birthday: f.birthday,
      gender: f.gender,
      contactNumber: f.contact_number,
      address: f.address,
      isActive: f.is_active,
      createdAt: f.created_at
    })));
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
