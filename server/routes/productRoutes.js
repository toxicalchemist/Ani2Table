import express from 'express';
import { 
  getAllProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStatus
} from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (farmers only) - with image upload
router.post('/', authenticateToken, authorizeRole('farmer', 'admin'), upload.single('image'), createProduct);
router.put('/:id', authenticateToken, authorizeRole('farmer', 'admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('farmer', 'admin'), deleteProduct);

// Admin only route - approve/reject products
router.patch('/:id/status', authenticateToken, authorizeRole('admin'), updateProductStatus);

export default router;
