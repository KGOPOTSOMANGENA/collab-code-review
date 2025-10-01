import { Request, Response } from 'express';
import * as NotificationModel from '../models/notificationModel';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user?.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const notifications = await NotificationModel.getNotificationsByUser(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notifications', error });
  }
};
