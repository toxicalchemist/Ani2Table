import express from 'express';
import { 
  getAnalytics, 
  getTransactions, 
  getAllUsers,
  getFarmers,
  deleteUser
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.get('/analytics', getAnalytics);
router.get('/transactions', getTransactions);
router.get('/users', getAllUsers);
router.get('/users/farmers', getFarmers);
router.delete('/users/:id', deleteUser);

export default router;
