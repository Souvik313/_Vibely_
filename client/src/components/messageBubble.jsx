const MessageBubble = ({ message }) => {
  const userId = localStorage.getItem("userId");

  return (
    <div
      className={`message ${
        message.sender._id === userId ? "own" : ""
      }`}
    >
      <p>{message.text}</p>
    </div>
  );
};

export default MessageBubble;