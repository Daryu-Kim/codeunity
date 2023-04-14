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
import { IoSend } from "react-icons/io5";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router";
import { BsMailbox2 } from "react-icons/bs";
import { RiQuestionnaireFill } from "react-icons/ri";
import { toastError, toastSuccess } from "../../modules/Functions";
import { useReactPWAInstall } from "react-pwa-install";
import { ToastContainer } from "react-toastify";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../modules/Firebase";

const MainSideBar = () => {
  const userID = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall(); // PWA 설치를 위한 hook 사용
  const navigate = useNavigate(); // React Router의 useNavigate hook 사용
  const [codeValue, setCodeValue] = useState(); // 코드 값과 값을 변경하는 함수를 state로 관리
  const [userData] = useDocumentData(doc(firestore, "Users", userID)); // Firestore에서 현재 사용자의 데이터 가져오기
  const [followingData] = useCollectionData(
    collection(firestore, `Follows/${userID}/Following`)
  ); // Firestore에서 현재 사용자가 팔로우하는 사용자 데이터 가져오기
  const [followingUser, setFollowingUser] = useState([]); // 팔로우하는 사용자 데이터를 state로 관리

  useEffect(() => {
    if (followingData) {
      // followingData가 존재하는 경우
      Promise.all(
        // Promise.all로 비동기 처리
        followingData.map(async (item) => {
          // followingData를 map으로 순회하며
          const tempData = await getDoc(doc(firestore, "Users", item.userID)); // 해당 유저의 데이터를 가져옴
          return tempData.data(); // 해당 유저의 데이터 반환
        })
      ).then(
        (
          data // 모든 Promise가 처리되면
        ) =>
          setFollowingUser(
            data.sort((x, y) => y.followerCount - x.followerCount)
          ) // 팔로잉한 유저들의 데이터를 팔로워 수를 기준으로 내림차순 정렬하여 setFollowingUser로 저장
      );
    }
  }, [followingData]); // followingData가 변경될 때마다 useEffect 실행

  // path와 param을 받아 navigate 함수를 호출하는 movePath 함수 선언
  const movePath = (path, param) =>
    // navigate 함수 호출 시 replace와 state 옵션을 true와 param으로 설정하여 호출
    navigate(path, { replace: true, state: param });

  const handleInstallClick = () => {
    // PWA 설치 버튼 클릭 시 실행되는 함수
    pwaInstall({
      // PWA 설치 옵션 설정
      title: "CodeUnity", // 앱 이름
      logo: logo, // 앱 로고
      features: (
        // 앱 기능 목록
        <ul>
          <li>Cool feature 1</li>
          <li>Cool feature 2</li>
          <li>Even cooler feature</li>
          <li>Works offline</li>
        </ul>
      ),
      description: "CodeUnity PWA 설치 테스트입니다.", // 앱 설명
    })
      .then(() =>
        // 설치 성공 시 실행되는 함수
        toastSuccess("앱이 성공적으로 설치되었거나 설치 지침이 표시되었습니다!")
      )
      .catch(() =>
        // 설치 실패 시 실행되는 함수
        toastError("사용자가 설치를 취소하였습니다!")
      );
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(codeValue); // 복사 기능 실행
    toastSuccess("코드를 복사하였습니다!"); // 성공 메시지 출력
  };

  const handleCodeValueChange = (value) => {
    // 코드 값이 변경될 때마다 호출되는 함수
    setCodeValue(value); // 변경된 코드 값을 state에 저장
  };

  const handleFriendClick = async (targetID, name) => {
    // 현재 사용자와 대화할 대상의 ID를 배열에 담는다.
    const tempArr = [userID, targetID];
    // user1과 user2 필드 중 하나가 tempArr 배열 안에 있는 채팅방을 찾는다.
    const filter = query(
      collection(firestore, "Chats"),
      where("user1", "in", tempArr),
      where("user2", "in", tempArr)
    );
    // 채팅방이 이미 존재하는 경우
    const chatData = await getDocs(filter);
    if (chatData.docs.length !== 0) {
      // 해당 채팅방의 chatID를 로컬 스토리지에 저장한다.
      localStorage.setItem("lastChatID", chatData.docs[0].data().chatID);
    } else {
      // 채팅방이 존재하지 않는 경우
      // Chats 컬렉션에 새로운 채팅방을 추가한다.
      const result = await addDoc(collection(firestore, "Chats"), {
        user1: userID,
        user2: targetID,
        userArr: [userID, targetID],
      });
      // 새로 추가된 채팅방의 chatID를 업데이트한다.
      await updateDoc(doc(firestore, "Chats", result.id), {
        chatID: result.id,
      });
      // 새로 추가된 채팅방의 chatID를 로컬 스토리지에 저장한다.
      localStorage.setItem("lastChatID", result.id);
    }
    // 대화할 대상의 이름을 로컬 스토리지에 저장한다.
    localStorage.setItem("lastName", name);
    // 채팅방으로 이동한다.
    navigate("/chat", { replace: true });
  };

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
                style={{ backgroundImage: `url(${userData.userImg})` }}
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
          {followingUser.length !== 0 &&
            followingUser.map((item, index) => (
              <div
                className={styles.friends}
                onClick={() => handleFriendClick(item.userID, item.userName)}
                key={index}
              >
                <div>
                  <div
                    className={styles.profileImg}
                    style={
                      item.userImg
                        ? { backgroundImage: `url(${item.userImg})` }
                        : { backgroundImage: `url(${baseImg})` }
                    }
                  ></div>
                  <p className={`${font.fs_16} ${font.fw_7}`}>
                    {item.userName}
                  </p>
                </div>
                <IoSend className={`${font.fs_16} ${font.fc_accent}`} />
              </div>
            ))}
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
