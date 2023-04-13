import React, { useState, useEffect } from "react";
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
import logo from "../../assets/images/logo.png";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage, langNames } from "@uiw/codemirror-extensions-langs";
import { useLocation, useNavigate } from "react-router";
import { BsMailbox2 } from "react-icons/bs";
import { RiQuestionnaireFill } from "react-icons/ri";
import { toastError, toastSuccess } from "../../modules/Functions";
import { vscodeDark, noctisLilac } from "@uiw/codemirror-themes-all";
import { useReactPWAInstall } from "react-pwa-install";
import { ToastContainer } from "react-toastify";
import MarkdownEditor from "@uiw/react-markdown-editor";

const MainSideBar = () => {
  const location = useLocation();

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
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const navigate = useNavigate();
  const [openFriendsMenu, setOpenFriendsMenu] = useState(false);
  const [codeValue, setCodeValue] = useState();

  const userID = localStorage.getItem("uid");

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

    const toggleFriendsMenu = () => {
      setOpenFriendsMenu(!openFriendsMenu);
    };

    const handleCopyClick = () => {
      navigator.clipboard.writeText(codeValue); // 복사 기능
      toastSuccess("코드를 복사하였습니다!");
    };

    const handleCodeValueChange = (value) => {
      setCodeValue(value);
    };

  return (
    <div className={styles.mainSideBar}>
      <ToastContainer position="top-right" autoClose={2000} bodyClassName={styles.toast} />
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

          <FontAwesomeIcon
            icon={faUser}
            onClick={() => {
              movePath("/profile", userID);
              sessionStorage.setItem("tempState", userID);
            }}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          {/* <div className={styles.myProfile}></div> */}
          <FontAwesomeIcon
            onClick={() => movePath("/settings")}
            icon={faGear}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
      </div>
      <div className={`${styles.contBox} ${font.fs_14}`}>
          <button onClick={toggleFriendsMenu}>
            <p>친구.List</p>
          </button>
          {openFriendsMenu ? <div>hello</div> : null}
          <div className={styles.codeBox}>
            <MarkdownEditor
              value={codeValue}
              onChange={(e) => handleCodeValueChange(e)}
              className={styles.code}
              previewWidth={"100%"}
              style={{
                fontSize: 16,
              }}
              height="16rem"
              toolbars={[
                "code", "codeBlock"
              ]}
              toolbarsMode={["preview"]}
            />
            <button
              className={`${styles.memoBoxBtn} ${font.fw_7} ${font.fs_10}`}
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
