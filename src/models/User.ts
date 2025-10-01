import { pool } from '../config/db';

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string = 'submitter',
  display_picture: string = ''
) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, display_picture)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, display_picture`,
    [name, email, hashedPassword, role, display_picture]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id: number) => {
  const result = await pool.query(
    'SELECT id, name, email, role, display_picture FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};