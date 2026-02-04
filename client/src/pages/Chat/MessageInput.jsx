import { useState } from "react";
import axios from "axios";
import API_URL from "../../config/api.js";
const MessageInput = ({ conversationId, onSend }) => {
  const [text, setText] = useState("");

  const handleSend = async() => {
    if (!text.trim()) return;
    try{
        if (onSend) {
          await onSend(text);
        } else {
          if (!conversationId) {
            console.error("No conversationId available to send message.");
            return;
          }
          const response = await axios.post(`${API_URL}/api/v1/messages/` , {conversationId : conversationId , text: text} , {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          });
          if(response.data.success){
              alert("Message sent successfully!");
          }
        }
    } catch(error){
        console.log(error);
        alert("Failed to send message. Please try again..");
    } finally{
        setText("");
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
