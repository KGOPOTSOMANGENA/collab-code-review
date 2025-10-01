import { Request, Response } from 'express';
import * as ProjectStatsModel from '../models/projectStatsModel';

export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const stats = await ProjectStatsModel.getProjectStats(projectId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get project stats', error });
  }
};
