import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../config/api.js";
const SOCKET_URL = API_URL;
const SocketContext = createContext();

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  console.log("🔌 SocketProvider - user:", user);

  useEffect(() => {
    if (!user?._id) {
      console.log("❌ No user ID found, socket not initialized");
      return;
    }

    console.log("🚀 Initializing socket for user:", user._id);

    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
    });

    console.log("🔗 Socket instance created:", socketInstance.id);
    setSocket(socketInstance);

    // 🔐 setup
    console.log("📤 Emitting setup event with userId:", user._id);
    socketInstance.emit("setup", user._id);

    // 📦 full list (on connect)
    socketInstance.on("onlineUsers", (users) => {
      console.log("📡 Received onlineUsers:", users);
      setOnlineUsers(new Set(users));
    });

    // 🟢 single user online
    socketInstance.on("userOnline", (userId) => {
      console.log("✅ User came online:", userId);
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    // 🔴 single user offline
    socketInstance.on("userOffline", (userId) => {
      console.log("🔴 User went offline:", userId);
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

