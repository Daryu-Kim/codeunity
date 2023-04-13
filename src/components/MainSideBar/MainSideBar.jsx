import React, { useState, useEffect } from "react";
import styles from "./MainSideBar.module.scss";
import font from "../../styles/Font.module.scss";
import { faDownload, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faMagnifyingGlass,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import {IoSend} from "react-icons/io5"
import baseImg from "../../assets/svgs/352174_user_icon.svg"
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router";
import { BsMailbox2 } from "react-icons/bs";
import { RiQuestionnaireFill } from "react-icons/ri";
import { toastError, toastSuccess } from "../../modules/Functions";
import { useReactPWAInstall } from "react-pwa-install";
import { ToastContainer } from "react-toastify";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";

const MainSideBar = () => {
  const userID = localStorage.getItem("uid");
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
  const navigate = useNavigate();
  const [codeValue, setCodeValue] = useState();
  const [userData] = useDocumentData(doc(firestore, "Users", userID));
  const [followingData] = useCollectionData(collection(firestore, `Follows/${userID}/Following`));
  const [followingUser, setFollowingUser] = useState([]);

  useEffect(() => {
    if (followingData) {
      Promise.all(
        followingData.map(async (item) => {
          const tempData = await getDoc(doc(firestore, "Users", item.userID));
          return tempData.data();
        })
      ).then((data) => setFollowingUser(data.sort((x, y) => y.followerCount - x.followerCount)));
    }
  }, [followingData])

  const movePath = (path, param) => {
    navigate(path, { replace: true, state: param });
  };

  const handleInstallClick = () => {
    pwaInstall({
      title: "CodeUnity",
      logo: logo,
      features: (
        <ul>
          <li>Cool feature 1</li>
          <li>Cool feature 2</li>
          <li>Even cooler feature</li>
          <li>Works offline</li>
        </ul>
      ),
      description: "CodeUnity PWA 설치 테스트입니다.",
    })
      .then(() => {
        toastSuccess(
          "앱이 성공적으로 설치되었거나 설치 지침이 표시되었습니다!"
        );
      })
      .catch(() => {
        toastError("사용자가 설치를 취소하였습니다!");
      });
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(codeValue); // 복사 기능
    toastSuccess("코드를 복사하였습니다!");
  };

  const handleCodeValueChange = (value) => {
    setCodeValue(value);
  };

  const handleFriendClick = async (targetID) => {
    const tempArr = [userID, targetID];
    const filter = query(
      collection(firestore, "Chats"),
      where("user1", "in", tempArr),
      where("user2", "in", tempArr),
    )
    const chatData = await getDocs(filter);
    if (chatData.docs.length !== 0) {
      
    }
    console.log(chatData.docs.length)
    // sessionStorage.setItem("tempChat", userID);
    // navigate("/chat", { replace: true });
  }

  return (
    <div className={styles.mainSideBar}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        bodyClassName={styles.toast}
      />
      <div className={styles.iconBox}>
        <div className={styles.onIconBox}>
          <div
            className={`${styles.logo} ${styles.sidebarIcon}`}
            onClick={() => movePath("/")}
          ></div>
          <FontAwesomeIcon
            onClick={() => movePath("/search")}
            icon={faMagnifyingGlass}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            onClick={() => movePath("/chat")}
            icon={faUserGroup}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <RiQuestionnaireFill
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
            onClick={() => movePath("/qna")}
          />
          <BsMailbox2
            onClick={() => movePath("/inquiry")}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
        <div className={styles.underIconBox}>
          {supported() && !isInstalled() && (
            <FontAwesomeIcon
              icon={faDownload}
              className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
              onClick={handleInstallClick}
            />
          )}
          {userData &&
            (userData.userImg ? (
              <div
                className={styles.myProfile}
                style={
                  {backgroundImage: `url(${userData.userImg})`}
                }
                onClick={() => {
                  movePath("/profile", userID);
                  sessionStorage.setItem("tempState", userID);
                }}
              ></div>
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                onClick={() => {
                  movePath("/profile", userID);
                  sessionStorage.setItem("tempState", userID);
                }}
                className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
              />
            ))}
          <FontAwesomeIcon
            onClick={() => movePath("/settings")}
            icon={faGear}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
      </div>
      <div className={`${styles.contBox}`}>
          <p className={`${font.fw_7} ${font.fs_20}`}>팔로잉</p>
        <div className={styles.friendsBox}>
          {
            followingUser.length && (
              followingUser.map((item, index) => (
                <div className={styles.friends} onClick={() => handleFriendClick(item.userID)} key={index}>
                  <div>
                    <div
                      className={styles.profileImg}
                      style={
                        item.userImg ?
                        {backgroundImage: `url(${item.userImg})`} :
                        {backgroundImage: `url(${baseImg})`}
                      }
                    ></div>
                    <p className={`${font.fs_16} ${font.fw_7}`}>
                      {item.userName}
                    </p>
                  </div>
                  <IoSend className={`${font.fs_16} ${font.fc_accent}`} />
                </div>
              ))
            )
          }
        </div>
        <div className={styles.codeBox}>
          <MarkdownEditor
            value={codeValue}
            onChange={(e) => handleCodeValueChange(e)}
            id={styles.code}
            previewWidth={"100%"}
            style={{
              fontSize: 16,
            }}
            height="16rem"
            toolbars={["code", "codeBlock"]}
            toolbarsMode={["preview"]}
          />
          <button
            className={`${styles.memoBoxBtn} ${font.fw_7} ${font.fs_12}`}
            onClick={handleCopyClick}
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
