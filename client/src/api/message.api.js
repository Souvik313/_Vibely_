import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const getMessages = (conversationId) =>
  API.get(`/messages/${conversationId}`);

export const sendMessage = (data) =>
  API.post("/messages", data);