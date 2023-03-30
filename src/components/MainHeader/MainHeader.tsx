import React from "react";
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import logo from "./임시로고.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faComments,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";

const MainHeader = () => {
  return (
    <div className={styles.wrapper}>
      <img src={logo} className={styles.logo} />
      <div className={styles.leftMenu}>
        <div className={styles.tabMenu}>
          <FontAwesomeIcon icon={faCircleQuestion} />
          개발자 QnA
        </div>
        <div>
          <FontAwesomeIcon icon={faEnvelope} />
          문의하기
        </div>
      </div>
      <div className={styles.rightMenu}>
        <FontAwesomeIcon icon={faComments} className={styles.navIcon} />
        <div className={styles.myProfile}>MY Profile</div>
      </div>
    </div>
  );
};

export default MainHeader;
