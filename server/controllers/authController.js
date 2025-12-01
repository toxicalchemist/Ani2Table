import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      userType: user.user_type 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      middleName,
      birthday,
      gender,
      contactNumber,
      userType
    } = req.body;

    // Validate required fields
    if (!username || !password || !email || !firstName || !lastName || !userType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields' 
      });
    }

    // Prevent farmer registration through public endpoint
    if (userType === 'farmer') {
      return res.status(403).json({
        success: false,
        error: 'Farmer registration is restricted. Please contact an administrator.'
      });
    }

    // Only allow consumer and admin registration (admin should be created manually in DB)
    if (userType !== 'consumer' && userType !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type'
      });
    }

    // Check if username exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }

    // Check if email exists
    const [existingEmails] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmails.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users (username, password, email, first_name, last_name, middle_name, 
        birthday, gender, contact_number, user_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, firstName, lastName, middleName || '', 
       birthday, gender, contactNumber, userType]
    );

    // Get the created user
    const [users] = await pool.query(
      'SELECT id, username, email, first_name, last_name, user_type FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during registration' 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide username and password' 
      });
    }

    // Get user from database
    const [users] = await pool.query(
      `SELECT id, username, password, email, first_name, last_name, middle_name, 
        birthday, gender, contact_number, user_type, address, profile_image 
       FROM users WHERE username = ? AND is_active = TRUE`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        birthday: user.birthday,
        gender: user.gender,
        contactNumber: user.contact_number,
        userType: user.user_type,
        address: user.address,
        profileImage: user.profile_image
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during login' 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT id, username, email, first_name, last_name, middle_name, 
        birthday, gender, contact_number, user_type, address, profile_image, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        birthday: user.birthday,
        gender: user.gender,
        contactNumber: user.contact_number,
        userType: user.user_type,
        address: user.address,
        profileImage: user.profile_image,
        farmName: user.farm_name,
        farmSize: user.farm_size,
        bio: user.bio,
        established: user.established,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      birthday,
      gender,
      contactNumber,
      address,
      profileImage,
      farmName,
      farmSize,
      bio,
      established
    } = req.body;

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(lastName);
    }
    if (middleName !== undefined) {
      updates.push('middle_name = ?');
      values.push(middleName);
    }
    if (birthday !== undefined) {
      updates.push('birthday = ?');
      values.push(birthday);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      values.push(gender);
    }
    if (contactNumber !== undefined) {
      updates.push('contact_number = ?');
      values.push(contactNumber);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (profileImage !== undefined) {
      updates.push('profile_image = ?');
      values.push(profileImage);
    }
    if (farmName !== undefined) {
      updates.push('farm_name = ?');
      values.push(farmName);
    }
    if (farmSize !== undefined) {
      updates.push('farm_size = ?');
      values.push(farmSize);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }
    if (established !== undefined) {
      updates.push('established = ?');
      values.push(established);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(req.user.id);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Admin only: Register farmer
export const registerFarmer = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      middleName,
      birthday,
      gender,
      contactNumber,
      address
    } = req.body;

    // Validate required fields
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields' 
      });
    }

    // Check if username exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }

    // Check if email exists
    const [existingEmails] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmails.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new farmer (userType is hardcoded to 'farmer')
    const [result] = await pool.query(
      `INSERT INTO users (username, password, email, first_name, last_name, middle_name, 
        birthday, gender, contact_number, address, user_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'farmer')`,
      [username, hashedPassword, email, firstName, lastName, middleName || '', 
       birthday, gender, contactNumber, address || '']
    );

    // Get the created farmer
    const [users] = await pool.query(
      'SELECT id, username, email, first_name, last_name, user_type FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Register farmer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during registration' 
    });
  }
};
