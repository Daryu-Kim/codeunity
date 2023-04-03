import React, { useState } from "react";
import styles from "./MainChat.module.scss";
import font from "../../styles/Font.module.scss";

const MainChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleMessageChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      setMessages([...messages, { sender: "user", text: inputValue }]);
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message, index) => (
          <div className={`message ${message.sender}`} key={index}>
            <span className="message-text">{message.text}</span>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={handleMessageChange}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};
export default MainChat;
