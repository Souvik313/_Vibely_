import MessageBubble from "../../components/messageBubble.jsx";
import MessageInput from "./MessageInput";
import { useChat } from "../../hooks/useChat.js";
import { useSocket } from "../../context/SocketContext.jsx";
import { formatMessageTime } from "../../utils/formatTime.js";

const ChatWindow = ({ conversation }) => {
  const loggedInUserId = localStorage.getItem("userId");
  const { onlineUsers } = useSocket();
  const { messages, sendNewMessage } = useChat(conversation?._id);

  if (!conversation) {
    return (
      <div className="chat-window empty">
        Select a conversation to start chatting
      </div>
    );
  }

  const otherUser = conversation.participants.find(
    (p) => p._id !== loggedInUserId
  );

  const isOnline = otherUser && onlineUsers?.has(otherUser._id);  console.log("🔍 ChatWindow - otherUser ID:", otherUser?._id, "isOnline:", isOnline, "onlineUsers:", Array.from(onlineUsers || []));
  return (
    <div className="chat-window">
      {/* 🧑 Header */}
      <div className="chat-header">
        <img
          src={otherUser?.profilePicture || "/default-avatar.png"}
          alt="profile"
        />
        <div className="chat-user-info">
          <span className="chat-username">{otherUser?.name}</span>
          <span className={`chat-status ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.sender._id === loggedInUserId ? "sent" : "received"
            }`}
          >
            {msg.text}
            <div className="message-time">
              {formatMessageTime(msg.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {/* ✍️ Input */}
      <MessageInput onSend={sendNewMessage} />
    </div>
  );
};

export default ChatWindow;