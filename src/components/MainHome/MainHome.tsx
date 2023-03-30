import React from 'react'
import MainSideBar from "../../components/MainSideBar/MainSideBar";
import { auth } from '../../modules/Firebase';
import { checkDarkMode } from '../../modules/Functions';
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFont, faImage, faLink, faVideo } from '@fortawesome/free-solid-svg-icons';

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
              <p className={`${font.fs_16} ${font.fc_sub_light}`}>
                { user?.displayName }님, 무슨 생각을 하고 계신가요?
              </p>
            </div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.writePostBlockBox}>
            <div className={styles.writePostBlockItem}>
              <FontAwesomeIcon
                className={`${font.fc_accent} ${font.fs_20}`}
                icon={faFont}
              />
              <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>텍스트</p>
            </div>
            <div className={styles.writePostBlockItem}>
              <FontAwesomeIcon
                className={`${font.fc_accent} ${font.fs_20}`}
                icon={faImage}
              />
              <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>사진</p>
            </div>
            <div className={styles.writePostBlockItem}>
              <FontAwesomeIcon
                className={`${font.fc_accent} ${font.fs_20}`}
                icon={faVideo}
              />
              <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>동영상</p>
            </div>
            <div className={styles.writePostBlockItem}>
              <FontAwesomeIcon
                className={`${font.fc_accent} ${font.fs_20}`}
                icon={faLink}
              />
              <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>링크</p>
            </div>
            <div className={styles.writePostBlockItem}>
              <FontAwesomeIcon
                className={`${font.fc_accent} ${font.fs_20}`}
                icon={faCode}
              />
              <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>코드</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHome