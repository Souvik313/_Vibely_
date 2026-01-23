import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "./Chat.css";
import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";

import API_URL from "../../config/api.js";

const Chat = () => {
  const { conversationId } = useParams();
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    if (!conversationId) return;
    
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setActiveConversation(res.data.conversation);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversation();
  }, [conversationId]);

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <ChatList setActiveConversation={setActiveConversation} activeConversation={activeConversation} />
        <ChatWindow conversation={activeConversation} />
      </div>
    </>
  );
};

export default Chat;