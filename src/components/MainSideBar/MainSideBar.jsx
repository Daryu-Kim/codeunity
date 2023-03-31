import React from "react";
import styles from "./MainSideBar.module.scss";
import font from "../../styles/Font.module.scss";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faGear,
  faMagnifyingGlass,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const MainSideBar = () => {
  return (
    <div className={styles.mainSideBar}>
      <div className={styles.iconBox}>
        <div className={styles.onIconBox}>
          <div className={styles.logo}></div>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={`${styles.sidebarIcon} ${font.fs_20} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faUserGroup}
            className={`${styles.sidebarIcon} ${font.fs_20} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faCodeBranch}
            className={`${styles.sidebarIcon} ${font.fs_20} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faGithub}
            className={`${styles.sidebarIcon} ${font.fs_20} ${font.bg}`}
          />
        </div>
        <div className={styles.underIconBox}>
          <FontAwesomeIcon icon={faUser} className={font.fs_20} />
          {/* <div className={styles.myProfile}></div> */}
          <FontAwesomeIcon
            icon={faGear}
            className={`${styles.sidebarIcon} ${font.fs_20} ${font.bg}`}
          />
        </div>
      </div>
      <div className={styles.contBox}></div>
    </div>
  );
};

export default MainSideBar;
