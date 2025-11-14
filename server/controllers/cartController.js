import { pool } from '../config/db.js';

// Get cart items for consumer
export const getCart = async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT c.id, c.quantity, c.created_at,
              p.id as product_id, p.name, p.description, p.category, 
              p.price, p.unit, p.image_url, p.quantity as stock,
              u.id as farmer_id, u.first_name as farmer_first_name, 
              u.last_name as farmer_last_name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       JOIN users u ON p.farmer_id = u.id
       WHERE c.consumer_id = ?`,
      [req.user.id]
    );

    res.json({
      success: true,
      cartItems: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: parseFloat(item.price),
          unit: item.unit,
          imageUrl: item.image_url,
          stock: item.stock,
          farmerId: item.farmer_id,
          farmerName: `${item.farmer_first_name} ${item.farmer_last_name}`
        }
      }))
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product or quantity' 
      });
    }

    // Check if product exists and has stock
    const [products] = await pool.query(
      'SELECT quantity FROM products WHERE id = ? AND status = "available"',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not available' });
    }

    if (products[0].quantity < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart WHERE consumer_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      // Insert new cart item
      await pool.query(
        'INSERT INTO cart (consumer_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, productId, quantity]
      );
    }

    res.json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Invalid quantity' });
    }

    // Check if cart item belongs to user
    const [items] = await pool.query(
      `SELECT c.id, p.quantity as stock 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.consumer_id = ?`,
      [req.params.id, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }

    if (items[0].stock < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }

    await pool.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, req.params.id]
    );

    res.json({
      success: true,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart WHERE id = ? AND consumer_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE consumer_id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
