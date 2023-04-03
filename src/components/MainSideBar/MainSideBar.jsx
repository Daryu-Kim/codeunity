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
import MarkdownEditor from "@uiw/react-markdown-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { isDarkMode } from "../../modules/Functions";

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
  const [codeFS, setCodeFS] = useState(14);

  function MemoBox() {
    const [codeValue, setCodeValue] = useState();
    let codeTemp = "";

    const handleCodeInputChange = (value) => {
      setCodeValue(value);
      codeTemp = value;
    };

    const handleCodeSizeUp = async () => {
      setCodeFS(24);
      setCodeValue(codeTemp);
    };

    const handleCopyClick = () => {
      navigator.clipboard.writeText(codeValue); // 복사 기능
    };

    return (
      <div className={styles.memoBox}>
        <div>
          <MarkdownEditor
            value={codeValue}
            onChange={(e) => handleCodeInputChange(e)}
            className={styles.memoBoxMemo}
            previewWidth={"100%"}
            enableScroll={true}
            style={{
              maxWidth: "100%",
              // fontSize: codeFS
            }}
          />

          <MarkdownPreview
            className={styles.memoBoxMemo}
            source={codeValue}
          />
          {/* <CodeEditor
            id={styles.code}
            language="jsx"
            value={codeValue}
            onChange={handleCodeInputChange}
            data-color-mode={isDarkMode}
            style={
              {
                width: 100,
                fontSize: codeFS,
              }
            }
          /> */}
        </div>

        <div className={styles.memoBoxBtns}>
          <button
            className={`${styles.memoBoxBtn} ${font.fw_7}`}
            onClick={handleCopyClick}
          >
            복사
          </button>
          <button className={`${styles.memoBoxBtn} ${font.fw_7}`}
            onClick={handleCodeSizeUp}
          >
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
