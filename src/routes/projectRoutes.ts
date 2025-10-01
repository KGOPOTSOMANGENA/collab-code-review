import express from 'express';
import * as ProjectController from '../controllers/projectController';
import { verifyToken } from '../middleware/authMiddleware';
 

const router = express.Router();

router.post('/', verifyToken, ProjectController.createProject);
router.get('/', verifyToken, ProjectController.listProjects);
router.post('/:id/members', verifyToken, ProjectController.assignUser);
router.delete('/:id/members/:userId', verifyToken, ProjectController.removeUser);

export default router;
