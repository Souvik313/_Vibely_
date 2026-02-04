import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_URL from "../../config/api.js";
const MessageInput = ({conversationId , onSend}) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    try {
      await onSend(text);
      alert("Message sent successfully!")
      setText("");
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="send-button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
