import {emitNotification} from '../services/notificationService.js'

export const createNotification = async (io, payload) => {

  const notification = await prisma.notification.create({
    data: payload
  });


  emitNotification(io, payload.recipientId, notification);
  
  return notification;
};