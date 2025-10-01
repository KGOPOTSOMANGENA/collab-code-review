import { pool } from '../config/db';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  created_by: number;
  created_at?: Date;
}

// Create a new project
export const createProject = async (project: Project) => {
  const { name, description, created_by } = project;
  const result = await pool.query(
    `INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *`,
    [name, description || '', created_by]
  );
  return result.rows[0];
};

// Get all projects
export const getAllProjects = async () => {
  const result = await pool.query(`SELECT * FROM projects`);
  return result.rows;
};

// Assign user to project
export const addUserToProject = async (projectId: number, userId: number) => {
  const result = await pool.query(
    `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) RETURNING *`,
    [projectId, userId]
  );
  return result.rows[0];
};

// Remove user from project
export const removeUserFromProject = async (projectId: number, userId: number) => {
  await pool.query(
    `DELETE FROM project_members WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );
};
