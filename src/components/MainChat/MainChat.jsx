import React, { useState, useRef } from "react";
import styles from "./MainChat.module.scss";
import font from "../../styles/Font.module.scss";
import { RiImageAddLine } from "react-icons/ri";
import "swiper/css";
import imageCompression from "browser-image-compression";
import { toastError, zipImage } from "../../modules/Functions";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import { BsChatDotsFill } from "react-icons/bs";
import { useEffect } from "react";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { convertTimestamp } from "../../modules/Functions";
import { IoSend } from "react-icons/io5";
import { useCallback } from "react";
import { GrPrevious } from "react-icons/gr";
import MainFollow from "../MainFollowFollowing/MainFollow";

const MainChat = () => {
  const myUID = localStorage.getItem("uid");
  const currentTime = Timestamp.fromDate(new Date());
  const [chatListData] = useCollectionData(
    query(
      collection(firestore, "Chats"),
      where("userArr", "array-contains", myUID)
    )
  );

  const [targetData, setTargetData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);
  const [selectedChatID, setSelectedChatID] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const modalRef = useRef(null);
  const chatRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    if (chatListData !== undefined) {
      Promise.all(
        chatListData.map(async (item) => {
          const filterArr = item.userArr.filter((el) => el !== myUID);
          const tempData = await getDoc(doc(firestore, "Users", filterArr[0]));
          return tempData.data();
        })
      ).then((data) => setTargetData(data));
    }
    
  }, [chatListData])

  useEffect(() => {
    setSelectedChatID(localStorage.getItem("lastChatID"));
    console.log(selectedChatID);
  }, [localStorage.getItem("lastChatID")]);

  useEffect(() => {
    setSelectedName(localStorage.getItem("lastName"));
    console.log(selectedName);
  }, [localStorage.getItem("lastName")]);

  useEffect(() => {
    const filter = query(
      collection(firestore, `Chats/${selectedChatID}/Msgs`),
      orderBy("createdAt")
    );
    onSnapshot(filter, (snapshot) => {
      const tempMessages = []
      snapshot.forEach((doc) => {
        tempMessages.push(doc.data());
      })
      setMessages(tempMessages)
    })
  }, [selectedChatID])

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, [messages])

  const handleListClick = (chatID, name) => {
    localStorage.setItem("lastChatID", chatID);
    localStorage.setItem("lastName", name);
    setSelectedChatID(chatID)
    setSelectedName(name)
    handleNext();
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }

  const handlePrev = useCallback(() => {
    if (!modalRef.current.swiper.slidePrev());
  }, []);

  const handleNext = useCallback(() => {
    if (!modalRef.current.swiper.slideNext());
  }, []);

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

  const sendMessage = async (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "" || selectedFile !== null) {
      const chatID = localStorage.getItem("lastChatID");
      await addDoc(collection(firestore, `Chats/${chatID}/Msgs`), {
        createdAt: Timestamp.fromDate(new Date()),
        msgText: inputValue.trim(),
        msgImg: selectedFile,
        userID: myUID,
      })
        .then(async (result) => {
          await updateDoc(
            doc(firestore, `Chats/${chatID}/Msgs`, result.id),
            {
              msgID: result.id,
            }
          )
            .then((result) => {

              setInputValue("");
              setSelectedFile(null);
            })
            .catch((err) => {
              toastError("메시지를 보내지 못했습니다!");
            });
        })
        .catch((err) => {
          toastError("메시지를 보내지 못했습니다!");
        });
    } else {
      toastError("메시지를 입력해주세요!");
    }
  };

  return (
    <div className={styles.wrapper}>
      {isModalOpen && (
          <MainFollow userID={myUID} closeModal={handleModalClose} modalType="Chat" />
        )}
      <Swiper
        ref={modalRef}
        className={styles.swiper}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {chatListData && targetData && (
          <SwiperSlide className={styles.listBox}>
            <div className={styles.titleBox}>
              <div className={styles.title}>
                <p className={`${font.fs_18} ${font.fw_7}`}>채팅</p>
                <p className={`${font.fs_18} ${font.fw_7} ${font.fc_accent}`}>
                  {chatListData.length}
                </p>
              </div>
              <BsChatDotsFill className={`${font.fs_20} ${styles.newChat}`} onClick={handleModalOpen} />
            </div>
            {chatListData.length > 0 ? (
              <div className={styles.paddingBox}>
                {chatListData.map((item, index) => (
                  <div className={styles.chatListBox} key={index} onClick={() => handleListClick(item.chatID, targetData[index].userName)}>
                    <div className={styles.list}>
                      <div
                        className={styles.profileImg}
                        style={
                          targetData.length && (
                            targetData[index].userImg ?
                            {backgroundImage: `url(${targetData[index].userImg})`} :
                            {backgroundImage: `url(${baseImg})`}
                          )
                        }
                      ></div>
                      <p className={`${font.fs_16} ${font.fw_7}`}>
                        {targetData[index].userName}
                      </p>
                    </div>
                    <IoSend className={`${font.fs_16} ${font.fc_accent}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noExistsBox}>
                <p className={`${font.fs_20} ${font.fw_7}`}>
                  채팅방이 없습니다!
                </p>
                <p
                  className={`
                ${font.fs_14} ${font.fw_5} ${font.fc_sub_light}
              `}
                >
                  팔로워 / 팔로잉 분들이랑 채팅을 시작해보세요!
                </p>
              </div>
            )}
          </SwiperSlide>
        )}

        <SwiperSlide className={styles.chatContainer}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
                <GrPrevious className={`${styles.nav} ${styles.mobile}`} onClick={handlePrev} />
                <p className={`${font.fs_18} ${font.fw_7}`}>
                  {selectedName ? selectedName : "대화상대 없음"}
                </p>
                <div className={styles.mobile}></div>
            </div>
          </div>
          <div className={styles.messageList} ref={chatRef}>
            {
              selectedChatID ? (
                messages.map((item, index) =>  item && (
                  <div
                    className={`
                    ${styles.message}
                    ${item.userID !== myUID ? null : styles.user}
                    `}
                    key={index}
                  >
                    {item.userID === myUID ? (
                    <div className={styles.messageBox}>
                      {item.msgImg && (
                        <div className={styles.onMessageBox}>
                          <img
                            src={item.msgImg}
                            alt="attached file"
                          />
                        </div>
                      )}
                      {(item.msgText || item.msgImg) && (
                        <div className={styles.underMessageBox}>
                          <span className={`${styles.messageTime} ${font.fs_10}`}>
                            {convertTimestamp(currentTime.seconds, item.createdAt.seconds)}
                          </span>
                          {item.msgText && (
                            <span className={`${styles.messageText} ${font.fw_5}`}>
                              {item.msgText}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.messageBoxN}>
                      {item.msgImg && (
                        <div className={styles.onMessageBoxN}>
                          <img
                            src={item.msgImg}
                            alt="attached file"
                          />
                        </div>
                      )}
                      {(item.msgText || item.msgImg) && (
                        <div className={styles.underMessageBoxN}>
                          {item.msgText && (
                            <span className={`${styles.messageText} ${font.fw_5}`}>
                              {item.msgText}
                            </span>
                          )}
                          <span className={`${styles.messageTime} ${font.fs_10}`}>
                            {convertTimestamp(currentTime.seconds, item.createdAt.seconds)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                  
                ))
              ) :
              <p>채팅방 내놔</p>
            }
            
          </div>
          <form className={styles.chatInput} onSubmit={sendMessage}>
            <div className={`${styles.chatInputBox} ${font.fs_14}`}>
              <input
                className={`${styles.chatInputIn} ${font.fs_14} ${font.fw_5}`}
                type="text"
                placeholder="메시지를 입력하세요"
                value={inputValue}
                onChange={handleMessageChange}
                disabled={
                  selectedChatID ? false : true
                }
              />
              <div
                className={styles.postFunBox}
                onClick={handlePostFunBoxClick}
              >
                <RiImageAddLine />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={inputFileRef}
              className={styles.imgInput}
              disabled={
                selectedChatID ? false : true
              }
            />
            <button
              className={`${styles.chatInputBtn}  ${font.fs_14} ${font.fw_7}`}
              type="submit"
              disabled={
                selectedChatID ? false : true
              }
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
