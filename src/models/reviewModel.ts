import { pool } from '../config/db';

export type ReviewStatus = 'approved' | 'changes_requested';

interface Review {
  submission_id: number;
  reviewer_id: number;
  status: ReviewStatus;
}

export const addReview = async (review: Review) => {
  const { submission_id, reviewer_id, status } = review;
  const query = `
    INSERT INTO reviews (submission_id, reviewer_id, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [submission_id, reviewer_id, status]);
  
 
  await pool.query(
    `UPDATE submissions SET status = $1 WHERE id = $2`,
    [status, submission_id]
  );

  return rows[0];
};

export const getReviewsBySubmission = async (submissionId: number) => {
  const query = `
    SELECT r.*, u.name as reviewer_name
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.submission_id = $1
    ORDER BY r.reviewed_at DESC;
  `;
  const { rows } = await pool.query(query, [submissionId]);
  return rows;
};
