import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus, 
  updatePaymentStatus 
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

router.post('/', authorizeRole('consumer'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus); // Allow consumers to cancel their own orders
router.put('/:id/payment', authorizeRole('admin'), updatePaymentStatus);

export default router;
