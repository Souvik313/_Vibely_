import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext.jsx";
import API_URL from "../../config/api.js";

const ChatList = ({ setActiveConversation, activeConversation }) => {
  const [conversations, setConversations] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { onlineUsers } = useSocket();

  console.log("🔍 ChatList onlineUsers:", Array.from(onlineUsers || []));

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setConversations(res.data.conversations || []);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>My Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <p className="no-chats">No conversations yet</p>
      ) : (
        conversations.map((c) => {
          const otherUser = c.participants.find(
            (p) => p._id !== loggedInUserId
          );

          const isOnline = onlineUsers?.has(otherUser?._id);

          return (
            <div
              key={c._id}
              className={`chat-item ${
                activeConversation?._id === c._id ? "active" : ""
              }`}
              onClick={() => setActiveConversation(c)}
            >
              <div className="chat-avatar-wrapper">
                <img
                  src={otherUser?.profilePicture || "/default-avatar.png"}
                  alt="profile"
                  className="chat-avatar"
                />
                <span
                  className={`status-dot ${isOnline ? "online" : "offline"}`}
                />
              </div>

              <div className="chat-info">
                <span className="chat-name">{otherUser?.name}</span>
                <span className="chat-last-msg">
                  {c.lastMessage?.text || "Start chatting"}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;