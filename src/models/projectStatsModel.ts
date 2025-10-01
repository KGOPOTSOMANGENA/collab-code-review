import { pool } from '../config/db';

export const getProjectStats = async (projectId: number) => {
  const statsQuery = `
    WITH review_times AS (
      SELECT s.id, EXTRACT(EPOCH FROM (r.reviewed_at - s.created_at)) AS review_duration
      FROM submissions s
      JOIN reviews r ON s.id = r.submission_id
      WHERE s.project_id = $1
    ),
    submission_counts AS (
      SELECT
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'changes_requested') AS changes_requested,
        COUNT(*) AS total
      FROM submissions
      WHERE project_id = $1
    ),
    active_reviewers AS (
      SELECT COUNT(DISTINCT reviewer_id) AS count FROM reviews
      WHERE submission_id IN (SELECT id FROM submissions WHERE project_id = $1)
    ),
    submission_comments AS (
      SELECT s.id, COUNT(c.id) AS comment_count
      FROM submissions s
      LEFT JOIN comments c ON s.id = c.submission_id
      WHERE s.project_id = $1
      GROUP BY s.id
      ORDER BY comment_count DESC
      LIMIT 1
    )
    SELECT
      (SELECT AVG(review_duration) FROM review_times) AS avg_review_time_seconds,
      (SELECT approved FROM submission_counts) AS approved_submissions,
      (SELECT changes_requested FROM submission_counts) AS changes_requested_submissions,
      (SELECT total FROM submission_counts) AS total_submissions,
      (SELECT count FROM active_reviewers) AS active_reviewer_count,
      (SELECT id FROM submission_comments) AS most_commented_submission_id,
      (SELECT comment_count FROM submission_comments) AS most_comments_count
  `;

  const { rows } = await pool.query(statsQuery, [projectId]);
  return rows[0];
};
