import React from 'react'
import MainSideBar from "../../components/MainSideBar/MainSideBar";
import { auth } from '../../modules/Firebase';
import { checkDarkMode } from '../../modules/Functions';
import styles from "./MainHome.module.scss";

const MainHome = () => {
  const user = auth.currentUser;
  return (
    <div className={styles.wrapper}>
      <MainSideBar />
      <div className={styles.box}>
        <div className={`${styles.writePostBtn}`}>
          <div className={styles.writePostTopBox}>
            <div className={styles.writePostTopImg}></div>
            <div className={styles.writePostTopInputBox}>
              { user?.displayName }님, 무슨 생각을 하고 계신가요?
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHome