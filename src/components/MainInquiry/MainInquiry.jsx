import React from "react";
import styles from "./MainInquiry.module.scss";
import font from "../../styles/Font.module.scss";

const MainInquiry = () => {
  return (
    <div className={styles.wrapper}>
      <h3>MEMBERS</h3>
      <h1 className={font.fs_28}>Meet our Members</h1>
      <div className={styles.memberBox}>
        <div className={styles.member}>
          <img></img>
        </div>
      </div>
    </div>
  );
};

export default MainInquiry;
