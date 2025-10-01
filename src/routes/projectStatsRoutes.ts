import express from 'express';
import { getProjectStats } from '../controllers/projectStatsController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/projects/:id/stats', verifyToken, getProjectStats);

export default router;
