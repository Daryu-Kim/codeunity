import React from "react";
import styles from "./MainProfile.module.scss";
import font from "../../styles/Font.module.scss";
import { useLocation } from "react-router-dom";
import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import baseImg from "../../assets/svgs/352174_user_icon.svg";

const MainProfile = () => {
  const firestore = getFirestore();
  const { state } = useLocation();
  const [document, loading, error, snapshot] = useDocumentData(
    doc(firestore, "Users", state)
  );
  const uid = localStorage.getItem("uid");

  if (document) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.profileBox}>
          <div className={styles.imgBox}>
            <div
              className={styles.img}
              style={
                document.userImg
                  ? { backgroundImage: `url(${document.userImg})` }
                  : { backgroundImage: `url(${baseImg})` }
              }
            ></div>
            <div className={styles.btnBox}>
              <button
                className={`${styles.shareBtn} ${font.fs_14} ${font.fw_7}`}
              >
                공유
              </button>
              {document.userID == uid ? (
                <button
                  className={`${styles.modifyBtn} ${font.fs_14} ${font.fw_7}`}
                >
                  편집
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.nameBox}>
            <p className={`${font.fs_24} ${font.fw_7}`}>
              {document.userName}
            </p>
            <p className={`${font.fs_16} ${font.fc_sub}`}>
              {
                document.userDesc
                  ? document.userDesc
                  : "자기소개가 없습니다!"
              }
            </p>
          </div>
          <div className={styles.followBox}>
            <div className={styles.followerBox}></div>
            <div className={styles.followingBox}></div>
          </div>
        </div>
      </div>
    );
  }
};

export default MainProfile;
