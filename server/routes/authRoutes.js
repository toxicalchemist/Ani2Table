import express from 'express';
import { register, login, getProfile, updateProfile, registerFarmer } from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Admin only routes
router.post('/admin/register-farmer', authenticateToken, authorizeRole('admin'), registerFarmer);

export default router;
