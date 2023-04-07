import { useEffect, useRef, useState } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./MainCmtsModal.module.scss";
import MarkdownPreview from "@uiw/react-markdown-preview";
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
  getDoc,
} from "firebase/firestore";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";

const MainCmtsModal = ({ setModalState, modalPostID, modalType }) => {
  const firestore = getFirestore();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [mdValue, setMDValue] = useState({});
  const [tags, setTags] = useState([]);
  const modalRef = useRef(null);
  const [modalData, modalDataLoad, modalDataError] = useDocumentData(
    doc(
      firestore, "Posts", modalPostID
    )
  );

  const uid = localStorage.getItem("uid");

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

  useEffect(() => {
    if (modalPostID) {
      setMDValue(modalData)
    }
  }, [modalData])

  return (
    mdValue &&
    (
      <div className={styles.modalWrapper}>
      <button
        className={`${styles.closeBtn} ${font.fs_16} `}
        type="button"
        onClick={closeModal}
      >
        X
      </button>
      <ToastContainer position="top-right" autoClose={2000} />
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.postBox}>
          {/* {location.pathname == "/qna" ? ( */}
            <p className={`${font.fs_24} ${font.fw_7}`}>
              제목
            </p>
          {/* ) : null} */}
          <MarkdownPreview
            className={styles.postContent}
            source={mdValue.postContent}
          />
          {location.pathname == "/qna" ? (
            <label htmlFor="tags">태그</label>
          ) : null}
        </div>
        <div className={styles.cmtsBox}>
          Comments
        </div>
      </div>
    </div>
    )
    
  );
};
export default MainCmtsModal;
