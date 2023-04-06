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
import { useNavigate } from "react-router";
import { BsMailbox2 } from "react-icons/bs";
import { RiQuestionnaireFill } from "react-icons/ri";
import { toastError, toastSuccess } from "../../modules/Functions";
import { vscodeDark, noctisLilac } from "@uiw/codemirror-themes-all";
import { useReactPWAInstall } from "react-pwa-install";
import { ToastContainer } from "react-toastify";

const MainSideBar = () => {
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
  const [friendView, setFriendView] = useState(false);
  const [homeView, setHomeView] = useState(false);
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const navigate = useNavigate();

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

  function MemoBox() {
    const [codeValue, setCodeValue] = useState();
    const [codeLang, setCodeLang] = useState("html");
    const [codeLangs, setCodeLangs] = useState([]);

    let codeTemp = "";

    useEffect(() => {
      let tempLangs = [...langNames];
      tempLangs = tempLangs.sort();
      setCodeLangs(tempLangs);
    }, []);

    const handleCodeInputChange = (value) => {
      setCodeValue(value);
      codeTemp = value;
    };

    const handleCopyClick = () => {
      navigator.clipboard.writeText(codeValue); // 복사 기능
      toastSuccess("코드를 복사하였습니다!");
    };

    const handleMemoLang = (e) => {
      console.log(e.target.value);
      setCodeLang(e.target.value);
    };

    return (
      <div className={styles.memoBox}>
        <div>
          <select name="" id="" onChange={(e) => handleMemoLang(e)}>
            <option value="asciiArmor">언어를 선택하세요</option>
            {codeLangs.map((item, index) => (
              <option value={item} key={index}>
                {item.replace(/^[a-z]/, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
          <CodeMirror
            id={styles.code}
            onChange={handleCodeInputChange}
            extensions={[loadLanguage(codeLang)]}
            width={"calc(25vw - 4.8rem - 1.6rem)"}
            height={"20rem"}
            theme={noctisLilac}
            style={{ fontSize: 16 }}
          />
        </div>
        <button
          className={`${styles.memoBoxBtn} ${font.fw_7} ${font.fs_10}`}
          onClick={handleCopyClick}
        >
          복사
        </button>
      </div>
    );
  }
  return (
    <div className={styles.mainSideBar}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className={styles.iconBox}>
        <div className={styles.onIconBox}>
          <div
            className={`${styles.logo} ${styles.sidebarIcon}`}
            onClick={() => movePath("/")}
          ></div>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            onClick={() => movePath("/chat")}
            icon={faUserGroup}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faCodeBranch}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faGithub}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <RiQuestionnaireFill
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
            onClick={() => movePath("/qna")}
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

          <BsMailbox2
            onClick={() => movePath("/inquiry")}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faUser}
            onClick={() => movePath("/profile", userID)}
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
        <div>
          <ul
            className={font.fw_7}
            onClick={() => {
              setHomeView(!homeView);
            }}
          >
            {homeView ? (
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.contBoxIcon}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.contBoxIcon}
              />
            )}
            &nbsp; Home
          </ul>
          <ul
            className={font.fw_5}
            onClick={() => {
              setFriendView(!friendView);
            }}
          >
            &nbsp; &nbsp;
            {friendView ? (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.contBoxIcon}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.contBoxIcon}
              />
            )}
            &nbsp; 친구.List
            {friendView &&
              friends.map((friend, index) => (
                <li className={font.fw_4} key={index}>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <FontAwesomeIcon icon={faHashtag} /> &nbsp;
                  {friend}
                </li>
              ))}
          </ul>
        </div>
        <MemoBox />
      </div>
    </div>
  );
};

export default MainSideBar;
