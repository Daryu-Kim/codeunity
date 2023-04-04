import React, { useState, useRef } from "react";
import styles from "./MainChat.module.scss";
import font from "../../styles/Font.module.scss";
import { RiImageAddLine } from "react-icons/ri";

const MainChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);

  const handleMessageChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePostFunBoxClick = () => {
    inputFileRef.current.click();
  };

  const SendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "" || selectedFile !== null) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const hourDivision = hours >= 12 ? "오후" : "오전";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timestamp = `${hourDivision} ${hours}:${minutes}`;
      setMessages([
        ...messages,
        {
          sender: "user",
          text: inputValue,
          time: timestamp,
          file: selectedFile,
        },
      ]);
      setInputValue("");
      setSelectedFile(null);
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.chatContainer}>
        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div
              className={`${styles.message} ${
                message.sender === "user" ? styles.user : null
              }`}
              key={index}
            >
              {message.sender === "user" ? (
                <div className={styles.messageBox}>
                  {message.file && (
                    <div className={styles.onMessageBox}>
                      <img
                        src={URL.createObjectURL(message.file)}
                        alt="attached file"
                      />
                    </div>
                  )}
                  {(message.text || message.file) && (
                    <div className={styles.underMessageBox}>
                      <span className={`${styles.messageTime} ${font.fs_10}`}>
                        {message.time}
                      </span>
                      {message.text && (
                        <span className={styles.messageText}>
                          {message.text}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.messageBox}>
                  {message.file && (
                    <img
                      src={URL.createObjectURL(message.file)}
                      alt="attached file"
                    />
                  )}
                  {(message.text || message.file) && (
                    <div className={styles.underMessageBox}>
                      {message.text && (
                        <span className={styles.messageText}>
                          {message.text}
                        </span>
                      )}
                      <span className={`${styles.messageTime} ${font.fs_12}`}>
                        {message.time}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <form className={styles.chatInput} onSubmit={SendMessage}>
          <input
            className={`${styles.chatInputIn} ${font.fs_14}`}
            type="text"
            placeholder="메시지를 입력하세요"
            value={inputValue}
            onChange={handleMessageChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          <div className={styles.postFunBox} onClick={handlePostFunBoxClick}>
            <RiImageAddLine />
          </div>
          <button
            className={`${styles.chatInputBtn}  ${font.fs_14}`}
            type="submit"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};
export default MainChat;
