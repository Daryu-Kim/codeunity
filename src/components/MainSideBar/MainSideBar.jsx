import React, { useState } from "react";
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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  function MemoBox() {
    const [codeInputValue, setCodeInputValue] = useState("");

    const handleCodeInputChange = (event) => {
      setCodeInputValue(event.target.value);
    };

    const handleCopyClick = () => {
      navigator.clipboard.writeText(codeInputValue); // 복사 기능
    };

    return (
      <div className={styles.memoBox}>
        <div>
          <SyntaxHighlighter
            className={`${styles.memoBoxShow} ${font.fs_10}`}
            language="javascript"
            style={coy}
            showLineNumbers={true} // 옵션: 라인넘버 추가
            wrapLines={true} // 옵션: 긴 코드 줄바꿈
          >
            {codeInputValue}
          </SyntaxHighlighter>
          <textarea
            className={styles.memoBoxMemo}
            value={codeInputValue}
            onChange={handleCodeInputChange}
            placeholder="코드를 입력해주세요"
          />
        </div>

        <div className={styles.memoBoxBtns}>
          <button
            className={`${styles.memoBoxBtn} ${font.fw_7}`}
            onClick={handleCopyClick}
          >
            복사
          </button>
          <button className={`${styles.memoBoxBtn} ${font.fw_7}`}>
            글쓰기
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.mainSideBar}>
      <div className={`${styles.contBox} ${font.fs_14}`}>
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
        <MemoBox />
      </div>
      <div className={styles.iconBox}>
        <div className={styles.onIconBox}>
          <div className={`${styles.logo} ${styles.sidebarIcon}`}></div>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
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
        </div>
        <div className={styles.underIconBox}>
          <FontAwesomeIcon
            icon={faDownload}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          <FontAwesomeIcon
            icon={faUser}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
          {/* <div className={styles.myProfile}></div> */}
          <FontAwesomeIcon
            icon={faGear}
            className={`${styles.sidebarIcon} ${font.fs_24} ${font.bg}`}
          />
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
