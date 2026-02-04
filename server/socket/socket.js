import { Server } from "socket.io";
import onlineUsers from "./onlineUsers.js";
import User from "../models/user.model.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("setup", async (userId) => {
      try {
        socket.userId = userId;

        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }

        const userSockets = onlineUsers.get(userId);
        const wasOffline = userSockets.size === 0;

        userSockets.add(socket.id);

        // ✅ only when user comes online FIRST time
        if (wasOffline) {
          await User.findByIdAndUpdate(userId, {
            online: true,
            lastSeen: null,
          });

          console.log("✅ User online:", userId);
          socket.broadcast.emit("userOnline", userId);
        }

        // 🔹 send full list ONLY to this socket
        console.log("📡 Sending online users:", Array.from(onlineUsers.keys()));
        socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
      } catch (error) {
        console.error("Error in setup:", error);
      }
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("leaveConversation", (conversationId) => {
      try {
        socket.leave(conversationId);
      } catch (err) {
        console.error("Error leaving conversation room:", err);
      }
    });

    socket.on("newMessage", (message) => {
      socket.to(message.conversation).emit("receiveMessage", message);
    });

    socket.on("disconnect", async () => {
      try {
        const userId = socket.userId;
        if (!userId) return;

        const sockets = onlineUsers.get(userId);
        if (!sockets) return;

        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            online: false,
            lastSeen: new Date(),
          });

          console.log("🔴 User offline:", userId);
          socket.broadcast.emit("userOffline", userId);
        }

        console.log("⚫ Socket disconnected:", socket.id);
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });
  });

  return io;
};

export default initSocket;
