import React from "react";
import styles from "./MainSideBar.module.scss";
import font from "../../styles/Font.module.scss";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const MainSideBar = () => {
  return (
    <div className={styles.mainSideBar}>
      <FontAwesomeIcon
        icon={faMoon}
        className={`${styles.sidebarIcon} ${font.fs_28} ${font.fc_accent}`}
      />
      <FontAwesomeIcon
        icon={faGear}
        className={`${styles.sidebarIcon} ${font.fs_28} ${font.fc_accent}`}
      />
    </div>
  );
};

export default MainSideBar;
