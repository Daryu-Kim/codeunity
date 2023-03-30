import React, { useEffect, useState } from 'react'
import MainSideBar from "../../components/MainSideBar/MainSideBar";
import { auth, firestore, getAllUserUID, getUserData } from '../../modules/Firebase';
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFont, faImage, faLink, faVideo, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { signOut } from '@firebase/auth';
import { resolvePromise } from '../../modules/Functions';

const blockBoxData = [
  { icon: faFont, title: "텍스트" },
  { icon: faImage, title: "이미지" },
  { icon: faVideo, title: "비디오" },
  { icon: faLink, title: "링크" },
  { icon: faCode, title: "코드" },
];

const MainHome = () => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");
  const userData = getUserData();
  const tempUIDs = getAllUserUID();
  let allUserUID = [];  
  
  Promise.resolve(userData)
  .then((value) => {
    setUserName(value?.userName);
    console.log(value);
  });

  const temp = resolvePromise(tempUIDs)
  console.log(temp)
  // Promise.resolve(tempUIDs)
  // .then((value) => {
  //   allUserUID = value;
  // });

  console.log(allUserUID)

  const renderBlockData = () => {
    const mapBlockData = blockBoxData.map(
      (item, index) => {
        return (
          <div className={styles.writePostBlockItem} key={index}>
            <FontAwesomeIcon
              className={`${font.fc_accent} ${font.fs_20}`}
              icon={item.icon}
            />
            <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light}`}>
              {item.title}
            </p>
          </div>
        );
      }
    );
    return mapBlockData;
  }

  return (
    <div className={styles.wrapper}>
      <MainSideBar />
      <div className={styles.box}>
        <div className={`${styles.writePostBtn}`}>
          <div className={styles.writePostTopBox}>
            <div className={styles.writePostTopImg}></div>
            <div className={styles.writePostTopInputBox}>
              <p className={`${font.fs_16} ${font.fc_sub_light}`}>
                { userName }님, 무슨 생각을 하고 계신가요?
              </p>
            </div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.writePostBlockBox}>
            {renderBlockData()}
          </div>
        </div>
        <div className={styles.postBox} onClick={() => {signOut(auth)}}>
          asdf
        </div>
      </div>
    </div>
  )
}

export default MainHome;