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
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import MarkdownEditor from "@uiw/react-markdown-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage, langNames } from "@uiw/codemirror-extensions-langs";
import { useNavigate } from "react-router";
import { BsMailbox2 } from "react-icons/bs";
import { RiQuestionnaireFill } from "react-icons/ri";
import { isDarkMode, toastSuccess } from "../../modules/Functions";
import {
  githubDark,
  githubLight,
  vscodeDark,
  noctisLilac,
} from "@uiw/codemirror-themes-all";

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

  const navigate = useNavigate();

  const userID = localStorage.getItem("uid");

  const movePath = (path, param) => {
    navigate(path, { replace: true, state: param });
  };

  function MemoBox() {
    const [codeValue, setCodeValue] = useState();
    const [codeLang, setCodeLang] = useState("html");
    const [codeLangs, setCodeLangs] = useState([]);

    const codeTemp = "";

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
          <FontAwesomeIcon
            icon={faDownload}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
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
