import express from 'express';
import * as CommentController from '../controllers/commentController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Add comment to submission
router.post('/submissions/:id/comments', verifyToken, CommentController.addComment);

// List comments for a submission
router.get('/submissions/:id/comments', verifyToken, CommentController.listComments);

// Update a comment
router.patch('/comments/:id', verifyToken, CommentController.updateComment);

// Delete a comment
router.delete('/comments/:id', verifyToken, CommentController.deleteComment);

export default router;
