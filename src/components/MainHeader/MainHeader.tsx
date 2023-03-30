import React from 'react'
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import { checkDarkMode } from '../../modules/Functions';

const MainHeader = () => {
    checkDarkMode(styles);
  return (
    <div className={styles.wrapper}>
        asdf
    </div>
  )
}

export default MainHeader;