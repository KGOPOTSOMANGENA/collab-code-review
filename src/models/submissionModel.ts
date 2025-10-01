import { pool } from '../config/db';

interface Submission {
  project_id: number;
  submitted_by: number;
  code: string;
  status?: 'pending' | 'in_review' | 'approved' | 'changes_requested';
}

export const createSubmission = async (submission: Submission) => {
  const { project_id, submitted_by, code, status = 'pending' } = submission;
  const query = `
    INSERT INTO submissions (project_id, submitted_by, code, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [project_id, submitted_by, code, status]);
  return rows[0];
};

export const getSubmissionsByProject = async (projectId: number) => {
  const query = `
    SELECT * FROM submissions
    WHERE project_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [projectId]);
  return rows;
};

export const getSubmissionById = async (id: number) => {
  const query = `SELECT * FROM submissions WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateSubmissionStatus = async (id: number, status: string) => {
  const query = `
    UPDATE submissions
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [status, id]);
  return rows[0];
};

export const deleteSubmission = async (id: number) => {
  const query = `DELETE FROM submissions WHERE id = $1`;
  await pool.query(query, [id]);
  return;
};
