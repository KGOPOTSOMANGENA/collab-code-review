import express from 'express';
import * as SubmissionController from '../controllers/submissionController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, SubmissionController.createSubmission);
router.get('/project/:id', verifyToken, SubmissionController.listSubmissionsByProject);
router.get('/:id', verifyToken, SubmissionController.getSubmission);
router.patch('/:id/status', verifyToken, SubmissionController.updateStatus);
router.delete('/:id', verifyToken, SubmissionController.deleteSubmission);

export default router;