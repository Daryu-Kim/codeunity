import React, { useState, useRef, useEffect } from "react";
import styles from "./MainFollow.module.scss";
import font from "../../styles/Font.module.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom"

const MainFollow = ({ closeModal, userID, modalType }) => {
  const [activeTab, setActiveTab] = useState("");
  const modalRef = useRef(null);
  const myUID = localStorage.getItem("uid");
  const navigate = useNavigate();

  const [follower] = useCollectionData(
    collection(firestore, `Follows/${userID}/Follower`)
  );
  const [following] = useCollectionData(
    collection(firestore, `Follows/${userID}/Following`)
  );
  const [followerData, setFollowerData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const overlayClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  useEffect(() => {
    setActiveTab("followers");
  }, []);

  useEffect(() => {
    if (follower) {
      Promise.all(
        follower.map(async (item) => {
          const tempData = await getDoc(doc(firestore, "Users", item.userID));
          return tempData.data();
        })
      ).then((data) => setFollowerData(data));
    }
  }, [follower]);

  useEffect(() => {
    if (following) {
      Promise.all(
        following.map(async (item) => {
          const tempData = await getDoc(doc(firestore, "Users", item.userID));
          return tempData.data();
        })
      ).then((data) => setFollowingData(data));
    }
  }, [following]);

  const profileClick = (
    userID, userName // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    if (modalType == "Profile") {
      sessionStorage.setItem("tempState", userID);
      closeModal();
    } else if (modalType == "Chat") {
      handleFriendClick(userID, userName)
      closeModal();
    }
  };

  const handleFriendClick = async (targetID, name) => {
    const tempArr = [myUID, targetID];
    const filter = query(
      collection(firestore, "Chats"),
      where("user1", "in", tempArr),
      where("user2", "in", tempArr),
    )
    const chatData = await getDocs(filter);
    if (chatData.docs.length !== 0) {
      localStorage.setItem("lastChatID", chatData.docs[0].data().chatID);
      localStorage.setItem("lastName", name);
      navigate("/chat", { replace: true });
    } else {
      await addDoc(collection(firestore, "Chats"), {
        user1: myUID,
        user2: targetID,
        userArr: [myUID, targetID],
      }).then(async (result) => {
        localStorage.setItem("lastChatID", result.id);
        localStorage.setItem("lastName", name);
        await updateDoc(doc(firestore, "Chats", result.id), {
          chatID: result.id,
        }).then(() => {
          navigate("/chat", { replace: true });
        })
      })
    }
  }

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
                  <li key={item.userID} className={styles.modalItem}
                  onClick={() => profileClick(item.userID, item.userName)}>
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
                  <li key={item.userID} className={styles.modalItem}
                  onClick={() => profileClick(item.userID, item.userName)}>
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
