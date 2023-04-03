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
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.map((message, index) => (
          <div className={`${styles.message} ${message.sender}`} key={index}>
            <span className={styles.messageText}>{message.text}</span>
          </div>
        ))}
      </div>
      <form className={styles.chatInput} onSubmit={handleSendMessage}>
        <input
          className={`${styles.chatInputIn} ${font.fs_14}`}
          type="text"
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={handleMessageChange}
        />
        <button
          className={`${styles.chatInputBtn}  ${font.fs_14}`}
          type="submit"
        >
          전송
        </button>
      </form>
    </div>
  );
};
export default MainChat;
