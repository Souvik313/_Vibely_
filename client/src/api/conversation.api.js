import axios from "axios";
import API_URL from "../config/api.js";
const API = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

export const getMyConversations = () => 
    API.get("/conversations");

export const getConversationById = (id) =>
    API.get(`/conversations/${id}`);

export const createOrGetConversation = (receiverId) =>
    API.post("/conversations", { receiverId });

