import { pool } from '../config/db';

export interface Notification {
  id?: number;
  user_id: number;
  message: string;
  read?: boolean;
  created_at?: Date;
}

export const getNotificationsByUser = async (userId: number) => {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const markNotificationRead = async (notificationId: number) => {
  const query = `
    UPDATE notifications SET read = TRUE WHERE id = $1
  `;
  await pool.query(query, [notificationId]);
};
