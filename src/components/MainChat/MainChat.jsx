import React, { useState, useRef } from "react";
import styles from "./MainChat.module.scss";
import font from "../../styles/Font.module.scss";
import { RiImageAddLine } from "react-icons/ri";
import "swiper/css";
import imageCompression from "browser-image-compression";
import { zipImage } from "../../modules/Functions";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import { BsChatDotsFill } from "react-icons/bs";

const MainChat = () => {
  const userID = localStorage.getItem("uid");
  const [chatListData] = useCollectionData(
    query(
      collection(firestore, "Chats"),
      where("userArr", "array-contains", userID)
    )
  );

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);

  const handleMessageChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(zipImage(file));
    }
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
      <Swiper
      className={styles.swiper}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          }
        }}
      >
{chatListData && (
        <SwiperSlide className={styles.listBox}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <p className={`${font.fs_18} ${font.fw_7}`}>
                채팅
              </p>
              <p className={`${font.fs_18} ${font.fw_7} ${font.fc_accent}`}>
                {chatListData.length}
              </p>
            </div>
            <BsChatDotsFill className={`${font.fs_20} ${styles.newChat}`} />
          </div>
          {chatListData.length > 0 ? (
            <p>채팅방이 있습니다!</p>
          ) : (
            <div className={styles.noExistsBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                채팅방이 없습니다!
              </p>
              <p className={`
                ${font.fs_14} ${font.fw_5} ${font.fc_sub_light}
              `}>
                팔로워 / 팔로잉 분들이랑 채팅을 시작해보세요!
              </p>
            </div>
          )}
        </SwiperSlide>
      )}

        <SwiperSlide className={styles.chatContainer}>
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
                  <div className={styles.messageBoxN}>
                    {message.file && (
                      <div className={styles.onMessageBoxN}>
                        <img
                          src={URL.createObjectURL(message.file)}
                          alt="attached file"
                        />
                      </div>
                    )}
                    {(message.text || message.file) && (
                      <div className={styles.underMessageBoxN}>
                        {message.text && (
                          <span className={styles.messageText}>
                            {message.text}
                          </span>
                        )}
                        <span className={`${styles.messageTime} ${font.fs_10}`}>
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
            <div className={`${styles.chatInputBox} ${font.fs_14}`}>
              <input
                className={`${styles.chatInputIn} ${font.fs_14}`}
                type="text"
                placeholder="메시지를 입력하세요"
                value={inputValue}
                onChange={handleMessageChange}
              />
              <div className={styles.postFunBox} onClick={handlePostFunBoxClick}>
                <RiImageAddLine />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={inputFileRef}
              className={styles.imgInput}
            />
            <button
              className={`${styles.chatInputBtn}  ${font.fs_14} ${font.fw_7}`}
              type="submit"
            >
              전송
            </button>
          </form>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default MainChat;
