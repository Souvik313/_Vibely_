import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../api/message.api.js";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import API_URL from "../config/api.js";

export const useChat = (conversationId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch messages
  const fetchMessages = async () => {
    if (!conversationId || !token) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // 🔄 Handle conversation change
  useEffect(() => {
    if (!socket || !conversationId || !token) return;

    setMessages([]); // prevent bleed
    fetchMessages();

    // join new room
    socket.emit("joinConversation", conversationId);

    const handleReceiveMessage = (message) => {
      if (message.conversation.toString() === conversationId.toString()) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationId, socket, token]);

  // 📤 Send message
  const sendNewMessage = async (text) => {
    if (!conversationId || !token) return;

    try {
      const { data } = await sendMessage({ conversationId, text });

  console.log("📤 Sent message:", data.data);

  setMessages((prev) => {
    console.log("🧠 UI append (sender):", [...prev, data.data]);
    return [...prev, data.data];
  });

  socket.emit("newMessage", data.data);

  return data.data;
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return { messages, sendNewMessage };
};
