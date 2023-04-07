import { useEffect, useState } from "react";
import styles from "./MainProfile.module.scss";
import font from "../../styles/Font.module.scss";
import { useLocation } from "react-router-dom";
import {
  doc,
  getFirestore,
  query,
  where,
  collection,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import MarkdownPreview from "@uiw/react-markdown-preview";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";

const MainProfile = () => {
  const firestore = getFirestore();
  const { state } = useLocation();
  const uid = sessionStorage.getItem("tempState");
  const [document, loading, error, snapshot] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  const [modalState, setModalState] = useState(false);
  const [modalPostID, setModalPostID] = useState("");
  const [menuTab, setMenuTab] = useState(true);
  const [userPost, userPostLoad, userPostError] = useCollectionData(
    query(collection(firestore, "Posts"), where("userID", "==", uid)) // 생성일 기준으로 내림차순 정렬
  );
  const [userQnA, userQnALoad, userQnAError] = useCollectionData(
    query(collection(firestore, "QnAs"), where("userID", "==", uid)) // 생성일 기준으로 내림차순 정렬
  );
  const [userPostData, setUserPostData] = useState(null);
  const [userQnAData, setUserQnAData] = useState(null);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    if (userPost != undefined) {
      setUserPostData(
        userPost.map((item) => {
          return (
            <div
              className={styles.postItem}
              onClick={() => showModal(item.postID)}
            >
              <MarkdownPreview
                className={`
                  ${styles.postItemMd}
                  ${isList && styles.list}
                `}
                key={item.postID}
                source={item.postContent}
              />
            </div>
          );
        })
      );
    }
  }, [userPost]);

  useEffect(() => {
    if (userQnA != undefined) {
      setUserQnAData(
        userQnA.map((item) => {
          return (
            <div>
              <MarkdownPreview
                className={`
                  ${styles.postItem}
                  ${isList && styles.list}
                `}
                key={item.questID}
                source={item.questContent}
              />
            </div>
          );
        })
      );
    }
  }, [userQnA]);

  const changePostTab = (e) => {
    if (e.target.checked) {
      setMenuTab(true);
    }
  };

  const changeQnaTab = (e) => {
    if (e.target.checked) {
      setMenuTab(false);
    }
  };

  const showModal = (postID) => {
    setModalPostID(postID);
    setModalState(true);
  };

  if (document) {
    return (
      <div className={styles.wrapper}>
        {modalState && (
          <div className={styles.mainCmtsModal}>
            <MainCmtsModal setModalState={setModalState} modalPostID={modalPostID} modalType="post"/>
          </div>
        )}
        <div className={styles.profileBox}>
          <div className={styles.imgBox}>
            <div
              className={styles.img}
              style={
                document.userImg
                  ? { backgroundImage: `url(${document.userImg})` }
                  : { backgroundImage: `url(${baseImg})` }
              }
            ></div>
            <div className={styles.btnBox}>
              {document.userID == uid ? (
                <button
                  className={`${styles.modifyBtn} ${font.fs_14} ${font.fw_7}`}
                >
                  편집
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.nameBox}>
            <p className={`${font.fs_24} ${font.fw_7}`}>{document.userName}</p>
            <p className={`${font.fs_14} ${font.fw_7} ${font.fc_accent}`}>
              {document.userSearchID}
            </p>
            <p className={`${font.fs_16} ${font.fc_sub}`}>
              {document.userDesc ? document.userDesc : "자기소개가 없습니다!"}
            </p>
          </div>
          <div className={styles.followBox}>
            <div className={styles.followerBox}>
              <p className={`${styles.followTitle} ${font.fs_14} ${font.fw_7}`}>
                팔로우
              </p>
              <p
                className={`${styles.followTitle} ${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
              >
                {document.followerCount}
              </p>
            </div>
            <div className={styles.followingBox}>
              <p className={`${styles.followTitle} ${font.fs_14} ${font.fw_7}`}>
                팔로잉
              </p>
              <p
                className={`${styles.followTitle} ${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
              >
                {document.followingCount}
              </p>
            </div>
          </div>
          <div className={styles.userTagBox}>{document.userTag}</div>
        </div>
        <div className={styles.contBox}>
          <div className={styles.menuTab}>
            <input
              type="radio"
              name="tab"
              checked={menuTab == true}
              id="post"
              onChange={(e) => changePostTab(e)}
              className={styles.none}
            />
            <label
              htmlFor="post"
              className={`${font.fs_16} ${font.fw_7} ${styles.menuTabPost}`}
            >
              게시물
            </label>
            <input
              type="radio"
              name="tab"
              checked={menuTab == false}
              id="qna"
              onChange={(e) => changeQnaTab(e)}
              className={styles.none}
            />
            <label
              htmlFor="qna"
              className={`${font.fs_16} ${font.fw_7} ${styles.menuTabQnA}`}
            >
              QnA
            </label>
          </div>
          {menuTab ? (
            <div className={styles.postBox}>{userPostData}</div>
          ) : (
            <div className={styles.postBox}>{userQnAData}</div>
          )}
        </div>
      </div>
    );
  }
};

export default MainProfile;
