import { pool } from '../config/db.js';

// Get all products (with optional filters)
export const getAllProducts = async (req, res) => {
  try {
    const { category, status, farmerId } = req.query;
    
    let query = `
      SELECT p.*, 
             u.first_name as farmer_first_name, 
             u.last_name as farmer_last_name
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (farmerId) {
      query += ' AND p.farmer_id = ?';
      params.push(farmerId);
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await pool.query(query, params);

    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        farmerId: p.farmer_id,
        farmerName: `${p.farmer_first_name} ${p.farmer_last_name}`,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        quantity: p.quantity,
        unit: p.unit,
        imageUrl: p.image_url,
        status: p.status,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, 
              u.first_name as farmer_first_name, 
              u.last_name as farmer_last_name,
              u.contact_number as farmer_contact
       FROM products p
       JOIN users u ON p.farmer_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const p = products[0];
    res.json({
      success: true,
      product: {
        id: p.id,
        farmerId: p.farmer_id,
        farmerName: `${p.farmer_first_name} ${p.farmer_last_name}`,
        farmerContact: p.farmer_contact,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        quantity: p.quantity,
        unit: p.unit,
        imageUrl: p.image_url,
        status: p.status,
        createdAt: p.created_at
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Create product (farmers only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity, unit, status } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, price, and quantity' 
      });
    }

    // Get image URL from uploaded file
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Farmers create products with 'pending' status by default
    const productStatus = req.user.userType === 'admin' ? (status || 'available') : 'pending';

    const [result] = await pool.query(
      `INSERT INTO products (farmer_id, name, description, category, price, quantity, unit, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, description, category, price, quantity, unit || 'kg', imageUrl, productStatus]
    );

    res.status(201).json({
      success: true,
      message: productStatus === 'pending' ? 'Product submitted for approval' : 'Product created successfully',
      productId: result.insertId,
      status: productStatus
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update product (farmers only)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity, unit, status } = req.body;

    // Check if product belongs to farmer
    const [products] = await pool.query(
      'SELECT farmer_id FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (products[0].farmer_id !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Get image URL from uploaded file or keep existing
    let imageUrl = req.body.imageUrl; // Keep existing if no new file
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE products 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           category = COALESCE(?, category), 
           price = COALESCE(?, price), 
           quantity = COALESCE(?, quantity), 
           unit = COALESCE(?, unit), 
           image_url = COALESCE(?, image_url), 
           status = COALESCE(?, status)
       WHERE id = ?`,
      [name, description, category, price, quantity, unit, imageUrl, status, req.params.id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete product (farmers only)
export const deleteProduct = async (req, res) => {
  try {
    // Check if product belongs to farmer
    const [products] = await pool.query(
      'SELECT farmer_id FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (products[0].farmer_id !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update product status (admin only) - for approving/rejecting products
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'available', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Must be pending, available, or rejected' 
      });
    }

    const [products] = await pool.query(
      'SELECT id FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await pool.query(
      'UPDATE products SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: `Product ${status === 'available' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
