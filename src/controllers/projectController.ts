import { Request, Response } from 'express';
import * as ProjectModel from '../models/projectModel';



export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const created_by = req.user.userId;

    const project = await ProjectModel.createProject({ name, description, created_by });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get projects', error });
  }
};

export const assignUser = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const { userId } = req.body;
    const member = await ProjectModel.addUserToProject(projectId, userId);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add user to project', error });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    await ProjectModel.removeUserFromProject(projectId, userId);
    res.json({ message: 'User removed from project' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove user from project', error });
  }
};
