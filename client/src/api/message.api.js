import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getMessages = (conversationId) =>
  API.get(`/messages/${conversationId}`);

export const sendMessage = (data) =>
  API.post("/api/v1/messages", data,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });