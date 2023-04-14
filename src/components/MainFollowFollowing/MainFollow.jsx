import React, { useState, useRef, useEffect } from "react";
import styles from "./MainFollow.module.scss";
import font from "../../styles/Font.module.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const MainFollow = ({ closeModal, userID, modalType }) => {
  const myUID = localStorage.getItem("uid"); // 로컬 스토리지에서 uid를 가져와 myUID 변수에 할당
  const [activeTab, setActiveTab] = useState(""); // activeTab 상태와 이를 변경하는 setActiveTab 함수를 생성
  const modalRef = useRef(null); // modalRef 변수를 생성하고 null로 초기화
  const navigate = useNavigate(); // useNavigate hook을 사용하여 navigate 함수를 생성
  const [followerData, setFollowerData] = useState([]); // followerData 상태와 이를 변경하는 setFollowerData 함수를 생성하고, 초기값으로 빈 배열을 할당
  const [followingData, setFollowingData] = useState([]); // followingData 상태와 이를 변경하는 setFollowingData 함수를 생성하고, 초기값으로 빈 배열을 할당

  // userID를 기반으로 Follower와 Following 컬렉션에서 데이터를 가져온다.
  const [follower] = useCollectionData(
    collection(firestore, `Follows/${userID}/Follower`)
  );

  const [following] = useCollectionData(
    collection(firestore, `Follows/${userID}/Following`)
  );

  // useEffect hook을 사용하여 컴포넌트가 마운트될 때 "followers" 탭을 활성화한다.
  useEffect(() => setActiveTab("followers"), []);

  useEffect(() => {
    // follower가 변경될 때마다 실행
    if (follower) {
      // Promise.all을 사용하여 follower 배열의 모든 아이템에 대해 비동기적으로 데이터를 가져옴
      Promise.all(
        follower.map(async (item) => {
          // firestore에서 해당 유저의 데이터를 가져옴
          const tempData = await getDoc(doc(firestore, "Users", item.userID));
          // 가져온 데이터를 반환
          return tempData.data();
        })
        // 모든 비동기 작업이 끝나면 followerData를 업데이트
      ).then(setFollowerData);
    }
  }, [follower]);

  useEffect(() => {
    // following이 변경될 때마다 실행
    if (following) {
      // Promise.all을 사용하여 following 배열의 모든 아이템에 대해 비동기적으로 데이터를 가져옴
      Promise.all(
        following.map(
          async (item) =>
            await getDoc(doc(firestore, "Users", item.userID)).then(
              (tempData) => tempData.data()
            )
        )
      ).then((data) => setFollowingData(data)); // 가져온 데이터를 setFollowingData를 사용하여 상태 업데이트
    }
  }, [following]);

  const handleTabClick = (tab) => setActiveTab(tab); // 탭 클릭 시 activeTab을 변경하는 함수

  // modalRef.current이 클릭된 요소와 같으면 closeModal() 함수를 호출하는 overlayClick 함수를 정의합니다.
  const overlayClick = (e) => e.target === modalRef.current && closeModal();

  const profileClick = (userID, userName) => {
    // 만약 모달 타입이 "Profile"이면
    if (modalType === "Profile") {
      // sessionStorage에 "tempState" 키로 userID를 저장한다.
      sessionStorage.setItem("tempState", userID);
      // 만약 모달 타입이 "Chat"이면
    } else if (modalType === "Chat") {
      // handleFriendClick 함수를 호출하여 userID와 userName을 전달한다.
      handleFriendClick(userID, userName);
    }
    // closeModal 함수를 호출한다.
    closeModal();
  };

  const handleFriendClick = async (targetID, name) => {
    // 현재 사용자와 대화할 대상의 ID를 배열에 담는다.
    const tempArr = [myUID, targetID];
    // user1과 user2 필드 중 하나가 tempArr 배열 안에 있는 채팅방을 찾는다.
    const filter = query(
      collection(firestore, "Chats"),
      where("user1", "in", tempArr),
      where("user2", "in", tempArr)
    );
    // 채팅방이 이미 존재하는 경우
    const chatData = await getDocs(filter);
    if (chatData.docs.length !== 0) {
      // 해당 채팅방의 ID를 로컬 스토리지에 저장한다.
      localStorage.setItem("lastChatID", chatData.docs[0].data().chatID);
    } else {
      // 채팅방이 존재하지 않는 경우
      // 새로운 채팅방을 생성하고, user1, user2, userArr 필드에 값을 저장한다.
      const result = await addDoc(collection(firestore, "Chats"), {
        user1: myUID,
        user2: targetID,
        userArr: [myUID, targetID],
      });
      // 채팅방의 ID를 chatID 필드에 저장한다.
      await updateDoc(doc(firestore, "Chats", result.id), {
        chatID: result.id,
      });
      // 새로 생성된 채팅방의 ID를 로컬 스토리지에 저장한다.
      localStorage.setItem("lastChatID", result.id);
    }
    // 대화할 대상의 이름을 로컬 스토리지에 저장한다.
    localStorage.setItem("lastName", name);
    // 채팅방으로 이동한다.
    navigate("/chat", { replace: true });
  };

  return (
    <div className={styles.modal} onClick={overlayClick} ref={modalRef}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={`${font.fs_16} ${font.fw_7} ${styles.modalTitle}`}>
            Followers and Following
          </h2>
          <AiOutlineClose
            className={`${styles.modalClose}`}
            onClick={closeModal}
          />
        </div>
        <div className={styles.modalTabs}>
          <button
            className={`${styles.modalTab} ${
              activeTab === "followers" ? styles.modalTabActive : ""
            }`}
            onClick={() => handleTabClick("followers")}
          >
            Followers
          </button>
          <button
            className={`${styles.modalTab} ${
              activeTab === "following" ? styles.modalTabActive : ""
            }`}
            onClick={() => handleTabClick("following")}
          >
            Following
          </button>
        </div>
        <div className={styles.modalBody}>
          {activeTab === "followers" ? (
            <ul className={styles.modalList}>
              {followerData &&
                followerData.map((item) => (
                  <li
                    key={item.userID}
                    className={styles.modalItem}
                    onClick={() => profileClick(item.userID, item.userName)}
                  >
                    <div
                      className={styles.modalAvatar}
                      style={
                        item.userImg
                          ? { backgroundImage: `url(${item.userImg})` }
                          : { backgroundImage: `url(${baseImg})` }
                      }
                    ></div>
                    <div className={styles.modalUser}>
                      <p className={`${font.fs_12} ${font.fw_5}`}>
                        {item.userName}
                      </p>
                      <p className={`${styles.modalName} ${font.fs_10}`}>
                        {item.userSearchID}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <ul className={styles.modalList}>
              {following &&
                followingData.map((item) => (
                  <li
                    key={item.userID}
                    className={styles.modalItem}
                    onClick={() => profileClick(item.userID, item.userName)}
                  >
                    <div
                      className={styles.modalAvatar}
                      style={
                        item.userImg
                          ? { backgroundImage: `url(${item.userImg})` }
                          : { backgroundImage: `url(${baseImg})` }
                      }
                    ></div>
                    <div className={styles.modalUser}>
                      <p className={`${font.fs_12} ${font.fw_5}`}>
                        {item.userName}
                      </p>
                      <p className={styles.modalName}>{item.userSearchID}</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFollow;
