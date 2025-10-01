import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { pool } from '../config/db';

const router = express.Router();

router.get('/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, display_picture, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
