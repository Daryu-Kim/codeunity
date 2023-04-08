import React, { useState, useRef } from "react";
import styles from "./MainFollow.module.scss";
import font from "../../styles/Font.module.scss";

const MainFollow = ({ follower, following1, closeModal }) => {
  const [activeTab, setActiveTab] = useState("followers");
  const modalRef = useRef(null);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const overlayClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  const followers = [
    {
      id: 1,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser1",
      name: "User One",
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser2",
      name: "User Two",
    },
    {
      id: 3,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser3",
      name: "User Three",
    },
    {
      id: 4,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser4",
      name: "User Four",
    },
    {
      id: 5,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser5",
      name: "User Five",
    },
    {
      id: 6,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser6",
      name: "User Six",
    },
    {
      id: 7,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser7",
      name: "User Seven",
    },
    {
      id: 8,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser8",
      name: "User Eight",
    },
    {
      id: 9,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser9",
      name: "User Nine",
    },
    {
      id: 10,
      avatar: "https://via.placeholder.com/50",
      username: "followeruser10",
      name: "User Ten",
    },
  ];

  const following = [
    {
      id: 1,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser1",
      name: "User One",
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser2",
      name: "User Two",
    },
    {
      id: 3,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser3",
      name: "User Three",
    },
    {
      id: 4,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser4",
      name: "User Four",
    },
    {
      id: 5,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser5",
      name: "User Five",
    },
    {
      id: 6,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser6",
      name: "User Six",
    },
    {
      id: 7,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser7",
      name: "User Seven",
    },
    {
      id: 8,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser8",
      name: "User Eight",
    },
    {
      id: 9,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser9",
      name: "User Nine",
    },
    {
      id: 10,
      avatar: "https://via.placeholder.com/50",
      username: "followinguser10",
      name: "User Ten",
    },
  ];

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
              {followers.map((follower) => (
                <li key={follower.id} className={styles.modalItem}>
                  <img
                    src={follower.avatar}
                    alt={`${follower.username} ${font.fs_12} ${font.fw_6} profile`}
                    className={styles.modalAvatar}
                  />
                  <div className={styles.modalUser}>
                    <p className={`${font.fs_12} ${font.fw_5}`}>
                      {follower.username}
                    </p>
                    <p className={`${styles.modalName} ${font.fs_10}`}>
                      {follower.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.modalList}>
              {following.map((follow) => (
                <li key={follow.id} className={styles.modalItem}>
                  <img
                    src={follow.avatar}
                    alt={`${follow.username} profile`}
                    className={styles.modalAvatar}
                  />
                  <div className={styles.modalUser}>
                    <p className={`${font.fs_12} ${font.fw_5}`}>
                      {follow.username}
                    </p>
                    <p className={styles.modalName}>{follow.name}</p>
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
