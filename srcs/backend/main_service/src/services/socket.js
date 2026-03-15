import { Server } from "socket.io";
import http from "http";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" } 
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Users should join a room based on their User ID for private notifications
  socket.on("join-private-room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Helper function to trigger from your API routes
export const notifyNewJob = (jobData) => {
  io.emit("new-job-posted", jobData); // Broadcast to everyone
};

export const notifyStatusChange = (userId, status) => {
  io.to(userId).emit("application-update", { status }); // Private message
};