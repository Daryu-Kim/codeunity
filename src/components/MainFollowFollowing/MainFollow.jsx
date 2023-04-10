import React, { useState, useRef, useEffect } from "react";
import styles from "./MainFollow.module.scss";
import font from "../../styles/Font.module.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import baseImg from "../../assets/svgs/352174_user_icon.svg";

const MainFollow = ({ closeModal, userID }) => {
  const [activeTab, setActiveTab] = useState("followers");
  const modalRef = useRef(null);
  const [follower, followerLoad, followerError] = useCollectionData(
    collection(firestore, `Follows/${userID}/Follower`)
  );
  const [following, followingLoad, followingError] = useCollectionData(
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
    if (follower) {
      const tempFollower = [...followerData];
      follower.map(async (item, index) => {
        const tempData = await getDoc(doc(firestore, "Users", item.userID));
        tempFollower[index] = tempData.data();
      });
      setFollowerData(tempFollower);
    }
  }, [follower]);

  useEffect(() => {
    if (following) {
      const tempfollowing = [...followingData];
      following.map(async (item, index) => {
        const tempData = await getDoc(doc(firestore, "Users", item.userID));
        tempfollowing[index] = tempData.data();
      });
      setFollowingData(tempfollowing);
    }
  }, [following]);

  return (
    <div className={styles.modal} onClick={overlayClick} ref={modalRef}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={`${font.fs_16} ${font.fw_7} ${styles.modalTitle}`}>
            Followers and Following
          </h2>
          <button
            className={`${font.fs_18} ${font.fw_6} ${styles.modalClose}`}
            onClick={closeModal}
          >
            &times;
          </button>
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
                  <li key={item.userID} className={styles.modalItem}>
                    <img
                      src={item.userImg}
                      alt={`${item.userName} ${font.fs_12} ${font.fw_6} profile`}
                      className={styles.modalAvatar}
                    />
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
                  <li key={item.userID} className={styles.modalItem}>
                    <img
                      src={item.userImg}
                      alt={`${item.userName} profile`}
                      className={styles.modalAvatar}
                    />
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
