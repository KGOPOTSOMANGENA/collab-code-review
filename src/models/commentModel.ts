import { pool } from '../config/db';

interface Comment {
  submission_id: number;
  commented_by: number;
  line_number?: number;
  content: string;
}

export const addComment = async (comment: Comment) => {
  const { submission_id, commented_by, line_number, content } = comment;
  const query = `
    INSERT INTO comments (submission_id, commented_by, line_number, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [submission_id, commented_by, line_number || null, content]);
  return rows[0];
};

export const getCommentsBySubmission = async (submissionId: number) => {
  const query = `
    SELECT * FROM comments
    WHERE submission_id = $1
    ORDER BY created_at ASC;
  `;
  const { rows } = await pool.query(query, [submissionId]);
  return rows;
};

export const updateComment = async (id: number, content: string) => {
  const query = `
    UPDATE comments
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [content, id]);
  return rows[0];
};

export const deleteComment = async (id: number) => {
  const query = `DELETE FROM comments WHERE id = $1`;
  await pool.query(query, [id]);
};
