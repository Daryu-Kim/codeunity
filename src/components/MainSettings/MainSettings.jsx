import React from "react";
import styles from "./MainSettings.module.scss";
import font from "../../styles/Font.module.scss";
import LogOut from "./LogOut";

const MainSettings = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.settingMenu}>
        <h1>사용자</h1>
        <div className={styles.settingMenuOption}>
          <h3>로그아웃</h3>
          <LogOut />
        </div>
        <div className={styles.settingMenuOption}>
          <h3>비밀번호 변경</h3>
          <button>비밀번호 변경하기</button>
        </div>
        <div className={styles.settingMenuOption}>
          <h3>회원 탈퇴</h3>
          <button>회원 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default MainSettings;
