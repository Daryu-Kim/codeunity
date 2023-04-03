import React, { useEffect, useRef, useState } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./MainPQModal.module.scss";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { toastClear, toastError, toastLoading } from "../../modules/Functions";
import {
  collection,
  doc,
  addDoc,
  Timestamp,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

const MainPQModal = ({ setModalState, isQnA }) => {
  const firestore = getFirestore();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [mdValue, setMDValue] = useState("");
  const [tags, setTags] = useState([]);
  const modalRef = useRef(null);

  const uid = localStorage.getItem("uid");

  const titleChange = (e) => setTitle(e.target.value);
  const mdValueChange = (e) => setMDValue(e);
  // const mdValueChange = (e) => console.log(e);
  const tagsChange = (e) => tags.push(e.target.value);

  const closeModal = () => {
    setModalState(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalState(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const submitPQ = async () => {
    // if문으로 바꾸기.
    if (title) {
      if (mdValue) {
        if (location.pathname == "/qna") {
          if (tags.length > 0) {
            toastLoading("게시물을 업로드 중입니다!");
            await addDoc(collection(firestore, "Posts"), {
              userID: uid,
              createdAt: Timestamp.fromDate(new Date()),
              postTitle: title,
              postContent: mdValue,
            }).then(async (result) => {
              await updateDoc(doc(firestore, "QnAs", result.id), {
                postID: result.id,
              }).then(() => {
                toastClear();
                closeModal();
              });
            });
          } else {
            toastError("태그를 입력해주세요!");
          }
        } else {
          toastLoading("다른 개발자에게 질문하는중입니다!");
          await addDoc(collection(firestore, "Posts"), {
            userID: uid,
            createdAt: Timestamp.fromDate(new Date()),
            postTitle: title,
            postContent: mdValue,
          }).then(async (result) => {
            await updateDoc(doc(firestore, "Posts", result.id), {
              postID: result.id,
            }).then(() => {
              toastClear();
              closeModal();
            });
          });
        }
      } else {
        toastError("내용을 입력해주세요!");
      }
    } else {
      toastError("제목을 입력해주세요!");
    }
  };

  return (
    <div className={styles.modalWrapper}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.writeTitle}>
          <label className={font.fs_16} htmlFor="title">
            제목
          </label>
          <input
            className={font.fs_12}
            type="text"
            id="title"
            value={title}
            placeholder="제목을 입력해주세요"
            onChange={titleChange}
          />
        </div>
        <div className={styles.writeContent}>
          <label htmlFor="content">내용</label>
          <MarkdownEditor
            value={mdValue}
            onChange={(e) => mdValueChange(e)}
            className={styles.memoBoxMemo}
            previewWidth={"100%"}
            style={{
              fontSize: 16,
            }}
          />
        </div>
        {location.pathname == "/qna" ? (
          <div className={styles.writeTag}>
            <label htmlFor="tags">태그</label>
            <input
              className={font.fs_12}
              type="text"
              id="tags"
              value={tags}
              placeholder="태그를 선택해주세요"
              onChange={tagsChange}
            />
          </div>
        ) : null}

        <div className={styles.buttonsWrapper}>
          <button className={styles.submitBtn} onClick={submitPQ}>
            글쓰기
          </button>
        </div>
        <button className={styles.closeBtn} type="button" onClick={closeModal}>
          X
        </button>
      </div>
    </div>
  );
};
export default MainPQModal;
