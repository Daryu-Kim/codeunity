import React, { useState, useRef, useEffect } from "react";
import styles from "./LoginSearchPW.module.scss";
import font from "../../styles/Font.module.scss";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../modules/Firebase";
import { toastError, toastSuccess } from "../../modules/Functions";
import { ToastContainer } from "react-toastify";

const LoginSearchPW = ({ setModalState }) => {
  const modalRef = useRef(null); // 모달 참조
  const inputID = useRef(null); // 이메일 입력 참조
  const [email, setEmail] = useState(""); // 이메일 상태
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth); // 비밀번호 재설정 이메일 보내기
  const actionCodeSettings = {
    url: "https://codeunity-93a11.firebaseapp.com/__/auth/action", // 비밀번호 재설정 이메일에서 클릭 시 이동할 링크
  };

  useEffect(() => {
    // 마우스 다운 이벤트 핸들러 함수 정의
    const handler = (e) => {
      // 모달 창이 열려있고, 클릭한 요소가 모달 창 안에 없으면 모달 창 닫기
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalState(false);
      }
    };

    // 마우스 다운 이벤트 리스너 등록
    document.addEventListener("mousedown", handler);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleErrors = () => {
    // 에러 핸들링
    if (error) {
      if (error.code == "auth/invalid-email") {
        // 이메일 형식이 올바르지 않은 경우
        toastError("정확한 이메일을 입력해주세요!");
      } else if (error.code == "auth/user-not-found") {
        // 사용자를 찾을 수 없는 경우
        toastError("사용자를 찾을 수 없습니다!");
      } else {
        // 그 외의 경우
        toastError("알 수 없는 오류입니다!");
      }
    }
  };

  const overlayClick = (e) => {
    // 모달 외부 클릭 시 모달 닫기
    if (e.target === modalRef.current) {
      setModalState(false);
    }
  };

  const isEntered = (e) => {
    // 엔터키 입력 시 이메일 인증
    if (e.key === "Enter") {
      sendResetEmail();
    }
  };

  const sendResetEmail = async () => {
    // 비밀번호 재설정 이메일 보내기
    if (email.length > 0) {
      // 이메일이 입력되어 있는 경우
      const success = await sendPasswordResetEmail(email, actionCodeSettings);

      if (success) {
        // 이메일 전송 성공 시
        toastSuccess("비밀번호 재설정 이메일을 보냈습니다!");
      }
    } else {
      // 이메일이 입력되어 있지 않은 경우
      toastError("이메일을 입력해주세요!");
      inputID.current.focus();
    }
  };

  return (
    <div className={styles.modal} onClick={overlayClick} ref={modalRef}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        bodyClassName={styles.toast}
      />
      <div className={styles.modalContent}>
        <div className={styles.titleBox}>
          <p className={`${font.fs_20} ${font.fw_7}`}>비밀번호를 잊으셨나요?</p>
          <p className={`${font.fs_12} ${font.fc_sub_light}`}>
            이메일 인증하고 임시 비밀번호를 발급받으세요!
          </p>
        </div>
        <div className={styles.inputBox}>
          <input
            onKeyDown={(e) => isEntered(e)}
            ref={inputID}
            className={`${font.fs_14}`}
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className={`${font.fs_14} ${font.fw_7} ${font.fc_white} `}
            onClick={sendResetEmail}
          >
            인증하기
          </button>
        </div>
      </div>
      {handleErrors()}
      {/* // 에러 핸들링 함수 호출 */}
    </div>
  );
};

export default LoginSearchPW;
