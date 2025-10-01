import { Request, Response } from 'express';
import * as SubmissionModel from '../models/submissionModel';

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { project_id, code } = req.body;
    const submitted_by = req.user?.userId;
    if (!submitted_by) return res.status(401).json({ message: 'Unauthorized' });

    if (!project_id || !code) {
      return res.status(400).json({ message: 'Project ID and code are required' });
    }

    const submission = await SubmissionModel.createSubmission({ project_id, submitted_by, code });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create submission', error });
  }
};

export const listSubmissionsByProject = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const submissions = await SubmissionModel.getSubmissionsByProject(projectId);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get submissions', error });
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.id);
    const submission = await SubmissionModel.getSubmissionById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get submission', error });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['pending', 'in_review', 'approved', 'changes_requested'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await SubmissionModel.updateSubmissionStatus(submissionId, status);
    if (!updated) return res.status(404).json({ message: 'Submission not found' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update submission status', error });
  }
};

export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = parseInt(req.params.id);
    await SubmissionModel.deleteSubmission(submissionId);
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete submission', error });
  }
};
