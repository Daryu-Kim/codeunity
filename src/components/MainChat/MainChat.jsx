import React, { useState, useRef } from "react";
import styles from "./MainChat.module.scss";
import font from "../../styles/Font.module.scss";
import { RiImageAddLine } from "react-icons/ri";
import "swiper/css";
import imageCompression from "browser-image-compression";
import { toastError, zipImage } from "../../modules/Functions";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
  const myUID = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 값을 가져와 myUID 변수에 할당
  const currentTime = Timestamp.fromDate(new Date()); // 현재 시간을 Timestamp 형태로 currentTime 변수에 할당

  const [targetData, setTargetData] = useState(null); // targetData와 setTargetData를 선언하고 초기값은 null로 설정
  const [messages, setMessages] = useState([]); // messages와 setMessages를 선언하고 초기값은 빈 배열로 설정
  const [inputValue, setInputValue] = useState(""); // inputValue와 setInputValue를 선언하고 초기값은 빈 문자열로 설정
  const [selectedFile, setSelectedFile] = useState(null); // selectedFile과 setSelectedFile을 선언하고 초기값은 null로 설정
  const [selectedChatID, setSelectedChatID] = useState(null); // selectedChatID와 setSelectedChatID를 선언하고 초기값은 null로 설정
  const [selectedName, setSelectedName] = useState(null); // selectedName과 setSelectedName을 선언하고 초기값은 null로 설정
  const [isModalOpen, setIsModalOpen] = useState(false); // isModalOpen과 setIsModalOpen을 선언하고 초기값은 false로 설정

  const inputFileRef = useRef(null); // inputFileRef를 선언하고 초기값은 null로 설정
  const modalRef = useRef(null); // modalRef를 선언하고 초기값은 null로 설정
  const chatRef = useRef(null); // chatRef를 선언하고 초기값은 null로 설정

  // firestore의 "Chats" collection에서 "userArr" 필드에 현재 사용자의 UID가 포함된 document들을 가져온다.
  const [chatListData] = useCollectionData(
    query(
      collection(firestore, "Chats"),
      where("userArr", "array-contains", myUID)
    )
  );

  useEffect(() => {
    if (chatListData) {
      // chatListData가 존재할 경우
      Promise.all(
        // Promise.all로 비동기 처리
        chatListData.map(async (item) => {
          // chatListData를 map으로 순회하며
          const filterArr = item.userArr.filter((el) => el !== myUID); // userArr에서 myUID를 제외한 값들을 filterArr에 저장
          const tempData = await getDoc(doc(firestore, "Users", filterArr[0])); // filterArr의 첫 번째 값으로 해당 유저의 데이터를 가져옴
          return tempData.data(); // 해당 유저의 데이터를 반환
        })
      ).then(setTargetData); // 모든 Promise가 끝나면 setTargetData로 결과값을 저장
    }
  }, [chatListData]); // chatListData가 변경될 때마다 useEffect 실행

  useEffect(() => {
    // 로컬 스토리지에서 lastName 값을 가져와 변수에 저장합니다.
    const lastName = localStorage.getItem("lastName");
    // 가져온 lastName 값을 setSelectedName 함수를 사용하여 상태값으로 설정합니다.
    setSelectedName(lastName);
    // 로컬 스토리지에서 lastChatID 값을 가져와 변수에 저장합니다.
    setSelectedChatID(localStorage.getItem("lastChatID"));
  }, []);

  useEffect(() => {
    // 선택된 채팅방의 메시지들을 가져오기 위한 쿼리 생성
    const filter = query(
      collection(firestore, `Chats/${selectedChatID}/Msgs`),
      orderBy("createdAt")
    );
    // 쿼리 결과를 실시간으로 감시하며 메시지들을 업데이트
    onSnapshot(filter, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
  }, [selectedChatID]);

  // messages 배열이 업데이트 될 때마다 scrollToBottom 함수를 호출하는 타이머를 생성합니다.
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 200);
    // cleanup 함수를 이용하여 타이머를 제거합니다.
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // 모달을 열기 위한 함수
  const handleModalOpen = () => setIsModalOpen(true);
  // 모달을 닫기 위한 함수
  const handleModalClose = () => setIsModalOpen(false);

  const handleListClick = (chatID, name) => {
    // chatID와 name을 localStorage에 저장합니다.
    localStorage.setItem("lastChatID", chatID);
    localStorage.setItem("lastName", name);
    // 선택된 채팅방의 chatID와 name을 state에 저장합니다.
    setSelectedChatID(chatID);
    setSelectedName(name);
    // 채팅 페이지로 이동합니다.
    handleNext();
  };

  const scrollToBottom = () =>
    // 스크롤을 맨 아래로 이동하는 함수
    chatRef.current && // chatRef가 존재하면
    (chatRef.current.scrollTop = chatRef.current.scrollHeight); // chatRef의 scrollTop을 chatRef의 scrollHeight로 설정

  const handlePrev = useCallback(
    () => !modalRef.current.swiper.slidePrev(), // modalRef의 swiper를 이용하여 이전 슬라이드로 이동하는 함수를 useCallback으로 선언
    []
  );
  const handleNext = useCallback(
    () => !modalRef.current.swiper.slideNext(), // modalRef의 swiper를 이용하여 다음 슬라이드로 이동하는 함수를 useCallback으로 선언
    []
  );

  // 입력값이 변경될 때마다 호출되는 함수
  const handleMessageChange = ({ target: { value } }) => setInputValue(value);

  const handleFileChange = (event) => {
    // 이벤트에서 파일을 가져온다.
    const file = event.target.files[0];
    // 파일이 존재하면 zipImage 함수를 이용하여 파일을 압축한다.
    file && setSelectedFile(zipImage(file));
  };

  // inputFileRef.current을 클릭하는 함수를 정의합니다.
  const handlePostFunBoxClick = () => inputFileRef.current.click();

  const sendMessage = async (event) => {
    event.preventDefault(); // 이벤트 기본 동작 방지
    if (!inputValue.trim() && !selectedFile) {
      // 입력값이 없거나 선택된 파일이 없을 경우
      toastError("메시지를 입력해주세요!"); // 에러 메시지 출력
      return; // 함수 종료
    }
    const chatID = localStorage.getItem("lastChatID"); // 로컬 스토리지에서 마지막 채팅방 ID 가져오기
    try {
      const result = await addDoc(
        // Firestore에 데이터 추가
        collection(firestore, `Chats/${chatID}/Msgs`), // 채팅방 메시지 컬렉션에 추가
        {
          createdAt: Timestamp.fromDate(new Date()), // 현재 시간으로 생성 시간 설정
          msgText: inputValue.trim(), // 입력된 메시지 텍스트
          msgImg: selectedFile, // 선택된 이미지 파일
          userID: myUID, // 사용자 ID
        }
      );
      await updateDoc(doc(firestore, `Chats/${chatID}/Msgs`, result.id), {
        // Firestore에 데이터 업데이트
        msgID: result.id, // 메시지 ID 설정
      });
      setInputValue(""); // 입력값 초기화
      setSelectedFile(null); // 선택된 파일 초기화
    } catch (err) {
      toastError("메시지를 보내지 못했습니다!"); // 에러 메시지 출력
    }
  };

  return (
    <div className={styles.wrapper}>
      {isModalOpen && (
        <MainFollow
          userID={myUID}
          closeModal={handleModalClose}
          modalType="Chat"
        />
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
              <BsChatDotsFill
                className={`${font.fs_20} ${styles.newChat}`}
                onClick={handleModalOpen}
              />
            </div>
            {chatListData.length > 0 ? (
              <div className={styles.paddingBox}>
                {chatListData.map((item, index) => (
                  <div
                    className={styles.chatListBox}
                    key={index}
                    onClick={() =>
                      handleListClick(item.chatID, targetData[index].userName)
                    }
                  >
                    <div className={styles.list}>
                      <div
                        className={styles.profileImg}
                        style={
                          targetData.length &&
                          (targetData[index].userImg
                            ? {
                                backgroundImage: `url(${targetData[index].userImg})`,
                              }
                            : { backgroundImage: `url(${baseImg})` })
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
              <GrPrevious
                className={`${styles.nav} ${styles.mobile}`}
                onClick={handlePrev}
              />
              <p className={`${font.fs_18} ${font.fw_7}`}>
                {selectedName ? selectedName : "대화상대 없음"}
              </p>
              <div className={styles.mobile}></div>
            </div>
          </div>
          <div className={styles.messageList} ref={chatRef}>
            {selectedChatID ? (
              messages.map(
                (item, index) =>
                  item && (
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
                              <img src={item.msgImg} alt="attached file" />
                            </div>
                          )}
                          {(item.msgText || item.msgImg) && (
                            <div className={styles.underMessageBox}>
                              <span
                                className={`${styles.messageTime} ${font.fs_10}`}
                              >
                                {convertTimestamp(
                                  currentTime.seconds,
                                  item.createdAt.seconds
                                )}
                              </span>
                              {item.msgText && (
                                <span
                                  className={`${styles.messageText} ${font.fw_5}`}
                                >
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
                              <img src={item.msgImg} alt="attached file" />
                            </div>
                          )}
                          {(item.msgText || item.msgImg) && (
                            <div className={styles.underMessageBoxN}>
                              {item.msgText && (
                                <span
                                  className={`${styles.messageText} ${font.fw_5}`}
                                >
                                  {item.msgText}
                                </span>
                              )}
                              <span
                                className={`${styles.messageTime} ${font.fs_10}`}
                              >
                                {convertTimestamp(
                                  currentTime.seconds,
                                  item.createdAt.seconds
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
              )
            ) : (
              <p>채팅방이 없습니다!</p>
            )}
          </div>
          <form className={styles.chatInput} onSubmit={sendMessage}>
            <div className={`${styles.chatInputBox} ${font.fs_14}`}>
              <input
                className={`${styles.chatInputIn} ${font.fs_14} ${font.fw_5}`}
                type="text"
                placeholder="메시지를 입력하세요"
                value={inputValue}
                onChange={handleMessageChange}
                disabled={selectedChatID ? false : true}
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
              disabled={selectedChatID ? false : true}
            />
            <button
              className={`${styles.chatInputBtn}  ${font.fs_14} ${font.fw_7}`}
              type="submit"
              disabled={selectedChatID ? false : true}
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
