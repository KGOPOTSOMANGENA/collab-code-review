import { Request, Response } from 'express';
import * as ReviewModel from '../models/reviewModel';

export const approveSubmission = async (req: Request, res: Response) => {
  try {
    const submission_id = parseInt(req.params.id);
    const reviewer_id = req.user?.userId;

    if (!reviewer_id) return res.status(401).json({ message: 'Unauthorized' });

    // Only reviewers can approve
    if (req.user?.role !== 'reviewer') {
      return res.status(403).json({ message: 'Only reviewers can approve submissions' });
    }

    const review = await ReviewModel.addReview({
      submission_id,
      reviewer_id,
      status: 'approved',
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve submission', error });
  }
};

export const requestChanges = async (req: Request, res: Response) => {
  try {
    const submission_id = parseInt(req.params.id);
    const reviewer_id = req.user?.userId;

    if (!reviewer_id) return res.status(401).json({ message: 'Unauthorized' });

    // Only reviewers can request changes
    if (req.user?.role !== 'reviewer') {
      return res.status(403).json({ message: 'Only reviewers can request changes' });
    }

    const review = await ReviewModel.addReview({
      submission_id,
      reviewer_id,
      status: 'changes_requested',
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to request changes', error });
  }
};

export const getReviewHistory = async (req: Request, res: Response) => {
  try {
    const submission_id = parseInt(req.params.id);
    const reviews = await ReviewModel.getReviewsBySubmission(submission_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get review history', error });
  }
};
