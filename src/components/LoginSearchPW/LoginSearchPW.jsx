import React, { useState, useRef, useEffect } from "react";
import styles from "./LoginSearchPW.module.scss";
import font from "../../styles/Font.module.scss";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../modules/Firebase";
import { toastError, toastSuccess } from "../../modules/Functions";
import { ToastContainer } from "react-toastify";

const LoginSearchPW = ({ setModalState }) => {
const modalRef = useRef(null);
const inputID = useRef(null);
const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
const [email, setEmail] = useState("");

  const overlayClick = (e) => {
    if (e.target === modalRef.current) {
      setModalState(false);
    }
  };

  const actionCodeSettings = {
    url: "https://codeunity-93a11.firebaseapp.com/__/auth/action",
  };

  if (error) {
    if (error.code == "auth/invalid-email") {
      toastError("정확한 이메일을 입력해주세요!")
    } else if (error.code == "auth/user-not-found") {
      toastError("사용자를 찾을 수 없습니다!");
    } else {
      toastError("알 수 없는 오류입니다!")
    }
  }

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

  const isEntered = (e) => {
    if (e.key === "Enter") {
      sendResetEmail();
    }
  }

  const sendResetEmail = async () => {
    if (email.length > 0) {
      const success = await sendPasswordResetEmail(
        email,
        actionCodeSettings
      );

      if (success) {
        toastSuccess("비밀번호 재설정 이메일을 보냈습니다!")
      }
    } else {
      toastError("이메일을 입력해주세요!");
      inputID.current.focus();
    }
  }

  return (
    <div className={styles.modal} onClick={overlayClick} ref={modalRef}>
      <ToastContainer position="top-right" autoClose={2000} bodyClassName={styles.toast} />
      <div className={styles.modalContent}>
        <div className={styles.titleBox}>
          <p className={`${font.fs_20} ${font.fw_7}`}>
            비밀번호를 잊으셨나요?
            </p>
          <p className={`${font.fs_12} ${font.fc_sub_light}`}>
            이메일 인증하고 임시 비밀번호를 발급받으세요!
            </p>
        </div>
        <div className={styles.inputBox}>
          <input onKeyDown={(e) => isEntered(e)} ref={inputID} className={`${font.fs_14}`} type="email" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className={`${font.fs_14} ${font.fw_7} ${font.fc_white} `} onClick={sendResetEmail}>
            인증하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSearchPW;
