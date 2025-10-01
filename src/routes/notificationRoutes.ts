import express from 'express';
import { getUserNotifications } from '../controllers/notificationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users/:id/notifications', verifyToken, getUserNotifications);

export default router;
