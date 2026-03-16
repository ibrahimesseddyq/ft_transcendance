export const registerNotificationSocketEvents = ({ io, socket, prisma, userId }) => {
  socket.on('message:read', async (data) => {
    try {
      const { conversationId } = data;

      socket.to(conversationId).emit('message:read-by', {
        userId,
        conversationId,
        readAt: new Date()
      });

      await prisma.notification.updateMany({
        where: {
          userId,
          type: 'newMessage',
          referenceType: 'conversation',
          referenceId: conversationId,
          isRead: false
        },
        data: { isRead: true }
      });

      io.in(`user_${userId}`).emit('notification:cleared', { conversationId });
    } catch {
    }
  });
};
