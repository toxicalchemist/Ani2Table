import express from 'express';
import { 
  getMessages, 
  sendMessage, 
  markAsRead, 
  deleteMessage 
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All message routes require authentication
router.use(authenticateToken);

router.get('/', getMessages);
router.post('/', sendMessage);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;
