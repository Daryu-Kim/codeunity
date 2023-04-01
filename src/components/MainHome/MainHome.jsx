import React, { useEffect, useState } from 'react'
import MainSideBar from "../../components/MainSideBar/MainSideBar";
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFont, faImage, faLink, faVideo, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from '@firebase/auth';
import { useCollection, useCollectionData, useDocument, useDocumentData } from "react-firebase-hooks/firestore"
import { collection, doc, getFirestore, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const blockBoxData = [
  { icon: faFont, title: "텍스트" },
  { icon: faImage, title: "이미지" },
  { icon: faVideo, title: "비디오" },
  { icon: faLink, title: "링크" },
  { icon: faCode, title: "코드" },
];

const MainHome = () => {
  const auth = getAuth();
  const firestore = getFirestore();
  const uid = localStorage.getItem("uid");
  const [document, loading, error, snapshot] = useDocumentData(doc(firestore, "Users", uid));
  const handleResize = () => {
    setHtmlWidth(window.innerWidth);
  }
  console.log(document)
  const [userName, setUserName] = useState(null);
  const [htmlWidth, setHtmlWidth] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (document) {
      setUserName(document.userName);
    }
  }, [document])
  
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  // const [allUID, allUIDLoad, allUIDError] = useCollectionData(
  //   query(
  //     collection(firestore, "Users"),
  //     where("userID", "!=", uid.userID)
  //   )
  // )

  // console.log(allUID)

  // const [
  //   post,
  //   postLoad,
  //   postError,
  //   postSnapshot
  // ] = useCollectionData(
  //   query(
  //     collection(firestore, `/Users/${allUID}`)
  //   )
  // );
  
  // const [value, load, err] = useDocument(
  //   doc(firestore, "Users", uid)
  // );
  // const [userName, setUserName] = useState("");
  
  // const [myDoc, myDocLoad, myDocError] = useDocument(
  //   doc(firestore, "Users", user.uid)
  // )
  // const [userName, setUserName] = useState("");
  // // const myID = getMyUID();
  // // const myDoc = getUserData(myID);
  // // myDoc.then((result) => {
  // //   myData = result;
  // //   console.log(myData)
  // //   setUserName(myData.userName);
  // // })

  // if (allUID) {
  //   const allUIDArr = [];
  //   allUID.forEach((ele) => {
  //     allUIDArr.push(ele.data());
  //   })
  //   console.log(allUIDArr)
  // }
  

  // const myData = getMyData();
  // myData.then((result) => {
  //   console.log(result);
  // });

  const profileImgClick = (userID) => {
    navigate("/profile", {
      state: userID,
      replace: true,
    });
  }

  const renderBlockData = () => {
    const mapBlockData = blockBoxData.map(
      (item, index) => {
        return (
          <div className={styles.writePostBlockItem} key={index}>
            <FontAwesomeIcon
              className={`${font.fc_accent} ${font.fs_20}`}
              icon={item.icon}
            />
            <p className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light} ${styles.postBlockTitle}`}>
              {item.title}
            </p>
          </div>
        );
      }
    );
    return mapBlockData;
  };

  const renderFollowData = () => {

  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={`${styles.writePostBtn}`}>
          <div className={styles.writePostTopBox}>
            <div
              className={styles.writePostTopImg}
              onClick={() => profileImgClick(uid)}
            ></div>
            <div className={styles.writePostTopInputBox}>
              <p className={`${font.fs_14} ${font.fc_sub_light} ${styles.writePostTopName}`}>
                {htmlWidth > 767 ?
                `${userName}님, 무슨 생각중인가요?` :
                `글쓰기..`}
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