import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../api/message.api.js";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import API_URL from "../config/api.js";

export const useChat = (conversationId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  if(!token) return;

  const fetchMessages = async(conversationId) => {
    const response = await axios.get(`${API_URL}/api/v1/messages/${conversationId}` , {
    headers: {
        Authorization: `Bearer ${token}`
    }
  });
    if(response.data.success){
        const messagesPerformed = response.data.messages;
        setMessages(messagesPerformed)
    };
  }
  
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);
    socket?.emit("joinConversation", conversationId);

    socket?.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket?.off("receiveMessage");
  }, [conversationId, socket]);

  const sendNewMessage = async (text) => {
    const { data } = await sendMessage({
      conversationId,
      text,
    });

    socket.emit("newMessage", data.data);
    setMessages((prev) => [...prev, data.data]);
  };

  return { messages, sendNewMessage };
};