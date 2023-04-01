import React, { useState } from "react";
import styles from "./MainSideBar.module.scss";
import font from "../../styles/Font.module.scss";
import {
  faChevronDown,
  faChevronRight,
  faDownload,
  faHashtag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faGear,
  faMagnifyingGlass,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const MainSideBar = () => {
  const friends = [
    "친구1.scss",
    "친구2.scss",
    "친구3.scss",
    "친구4.scss",
    "친구5.scss",
    "친구6.scss",
    "친구7.scss",
    "친구8.scss",
    "친구9.scss",
  ];
  const [friendView, setFriendView] = useState(false);
  const [homeView, setHomeView] = useState(false);
  return (
    <div className={styles.mainSideBar}>
      <div className={`${styles.contBox} ${font.fs_14}`}>
        <ul
          className={font.fw_7}
          onClick={() => {
            setHomeView(!homeView);
          }}
        >
          {homeView ? (
            <FontAwesomeIcon icon={faChevronRight} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
          &nbsp; Home
        </ul>
        <ul
          className={font.fw_5}
          onClick={() => {
            setFriendView(!friendView);
          }}
        >
          &nbsp; &nbsp;
          {friendView ? (
            <FontAwesomeIcon icon={faChevronRight} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
          &nbsp; 친구.List
          {friendView &&
            friends.map((friend, index) => (
              <li className={font.fw_4} key={index}>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <FontAwesomeIcon icon={faHashtag} /> &nbsp;
                {friend}
              </li>
            ))}
        </ul>
      </div>
      <div className={styles.iconBox}>
        <div className={styles.onIconBox}>
          <div className={`${styles.logo} ${styles.sidebarIcon}`}></div>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faUserGroup}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faCodeBranch}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faGithub}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
        <div className={styles.underIconBox}>
          <FontAwesomeIcon
            icon={faDownload}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faUser}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          {/* <div className={styles.myProfile}></div> */}
          <FontAwesomeIcon
            icon={faGear}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
