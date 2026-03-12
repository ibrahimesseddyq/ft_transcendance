import { prisma } from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.status(200).json({ success: true, data: notifications });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });
  res.status(200).json({ success: true });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  res.status(200).json({ success: true });
});
