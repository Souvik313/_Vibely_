import { createContext, useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ user, children }) => {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  console.log("🔌 SocketProvider - user:", user);

  useEffect(() => {
    if (!user?._id) {
      console.log("❌ No user ID found, socket not initialized");
      return;
    }

    if (socketRef.current) {
      console.log("⚠️ Socket already exists, skipping init");
      return;
    }

    console.log("🚀 Initializing socket for user:", user._id);

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔗 Socket connected with id:", socket.id);
      console.log("📤 Emitting setup event with userId:", user._id);
      socket.emit("setup", user._id);
    });

    socket.on("onlineUsers", (users) => {
      console.log("📡 Received onlineUsers:", users);
      setOnlineUsers(new Set(users));
    });

    socket.on("userOnline", (userId) => {
      console.log("✅ User came online:", userId);
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("userOffline", (userId) => {
      console.log("🔴 User went offline:", userId);
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

