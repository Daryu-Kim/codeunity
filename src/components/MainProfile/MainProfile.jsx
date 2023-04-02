import React from 'react'
import styles from "./MainProfile.module.scss";
import font from "../../styles/Font.module.scss";
import { useLocation } from 'react-router-dom';
import { doc, getFirestore } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import baseImg from "../../assets/svgs/352174_user_icon.svg";

const MainProfile = () => {
  const firestore = getFirestore();
  const { state } = useLocation();
  const [document, loading, error, snapshot] = useDocumentData(doc(firestore, "Users", state));
  console.log(document)
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.profileBox}>
        <div className={styles.imgBox}>
          <div
            className={styles.img}
            style={
              document ?
                document.userImg ?
                {backgroundImage: `url(${document.userImg})`} :
                {backgroundImage: `url(${baseImg})`} :
              null
            }
          ></div>
          <button className={styles.shareBtn}></button>
          <button className={styles.modifyBtn}></button>
        </div>
      </div>
    </div>
  )
}

export default MainProfile