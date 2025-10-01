import { Request, Response } from 'express';
import * as CommentModel from '../models/commentModel';

export const addComment = async (req: Request, res: Response) => {
  try {
    const submission_id = parseInt(req.params.id);
    const commented_by = req.user?.userId;
    const { line_number, content } = req.body;

    if (!commented_by) return res.status(401).json({ message: 'Unauthorized' });
    if (!content) return res.status(400).json({ message: 'Content is required' });

    // only reviewers can comment
    if (req.user?.role !== 'reviewer') {
      return res.status(403).json({ message: 'Only reviewers can add comments' });
    }

    const comment = await CommentModel.addComment({ submission_id, commented_by, line_number, content });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

export const listComments = async (req: Request, res: Response) => {
  try {
    const submission_id = parseInt(req.params.id);
    const comments = await CommentModel.getCommentsBySubmission(submission_id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get comments', error });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!content) return res.status(400).json({ message: 'Content is required' });

    // Check ownership of comment before update
    const existingComments = await CommentModel.getCommentsBySubmission(commentId);
    const comment = existingComments.find(c => c.id === commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.commented_by !== userId) return res.status(403).json({ message: 'Forbidden' });

    const updated = await CommentModel.updateComment(commentId, content);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment', error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user?.userId;

    // Check ownership before deletion
    const existingComments = await CommentModel.getCommentsBySubmission(commentId);
    const comment = existingComments.find(c => c.id === commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.commented_by !== userId) return res.status(403).json({ message: 'Forbidden' });

    await CommentModel.deleteComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};
