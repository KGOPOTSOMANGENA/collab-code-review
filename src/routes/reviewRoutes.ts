import express from 'express';
import * as ReviewController from '../controllers/reviewController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/submissions/:id/approve', verifyToken, ReviewController.approveSubmission);
router.post('/submissions/:id/request-changes', verifyToken, ReviewController.requestChanges);
router.get('/submissions/:id/reviews', verifyToken, ReviewController.getReviewHistory);

export default router;
