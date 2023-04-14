import React, { useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import styles from "./ChangePassword.module.scss";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../modules/Functions";

const ChangePassword = () => {
  // 현재 비밀번호 상태 변수
  const [currentPassword, setCurrentPassword] = useState("");
  // 새 비밀번호 상태 변수
  const [newPassword, setNewPassword] = useState("");
  // 새 비밀번호 확인 상태 변수
  const [confirmPassword, setConfirmPassword] = useState("");
  // 에러 메시지 상태 변수
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitDisabled =
    !currentPassword || // 현재 비밀번호가 없으면
    !newPassword || // 새로운 비밀번호가 없으면
    !confirmPassword || // 비밀번호 확인이 없으면
    newPassword !== confirmPassword; // 새로운 비밀번호와 비밀번호 확인이 다르면

  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트 객체에서 name과 value를 추출하여 상수에 할당
    switch (
      name // name 값에 따라 분기 처리
    ) {
      case "currentPassword": // name이 "currentPassword"인 경우
        setCurrentPassword(value); // setCurrentPassword 함수를 호출하여 상태값 변경
        break; // switch 문을 빠져나감
      case "newPassword": // name이 "newPassword"인 경우
        setNewPassword(value); // setNewPassword 함수를 호출하여 상태값 변경
        break; // switch 문을 빠져나감
      case "confirmPassword": // name이 "confirmPassword"인 경우
        setConfirmPassword(value); // setConfirmPassword 함수를 호출하여 상태값 변경
        break; // switch 문을 빠져나감
      default: // 위의 case에 해당하지 않는 경우
        break; // switch 문을 빠져나감
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 이벤트 기본 동작 방지

    if (newPassword !== confirmPassword) {
      // 새로운 비밀번호와 확인용 비밀번호가 일치하지 않을 경우
      setErrorMessage("새로운 비밀번호가 일치하지 않습니다."); // 에러 메시지 설정
      return; // 함수 종료
    }

    const auth = getAuth(); // 인증 객체 생성
    const user = auth.currentUser; // 현재 사용자 정보 가져오기
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    ); // 이메일 인증 자격 증명 객체 생성

    reauthenticateWithCredential(user, credential) // 사용자 재인증
      .then(() => updatePassword(user, newPassword)) // 비밀번호 업데이트
      .then(() => {
        toastSuccess("비밀번호가 업데이트되었습니다."); // 성공 메시지 토스트 출력
        setCurrentPassword(""); // 현재 비밀번호 초기화
        setNewPassword(""); // 새로운 비밀번호 초기화
        setConfirmPassword(""); // 확인용 비밀번호 초기화
        setErrorMessage(""); // 에러 메시지 초기화
      })
      .catch((error) => {
        console.log(error.message); // 에러 메시지 콘솔 출력
        if (error.code === "auth/wrong-password") {
          // 현재 비밀번호가 일치하지 않을 경우
          toastError("현재 비밀번호가 일치하지 않습니다."); // 에러 메시지 토스트 출력
        } else {
          setErrorMessage(error.message); // 에러 메시지 설정
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        bodyClassName={styles.toast}
      />

      <label className={styles.passwordBox}>
        현재 비밀번호 :
        <input
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={handleChange}
        />
      </label>
      <label className={styles.passwordBox}>
        새로운 비밀번호 :
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={handleChange}
        />
      </label>
      <label className={styles.passwordBox}>
        새로운 비밀번호 확인 :
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
      </label>
      {errorMessage && <div>{errorMessage}</div>}
      <button
        className={styles.changeBtn}
        type="submit"
        disabled={isSubmitDisabled}
      >
        변경하기
      </button>
    </form>
  );
};

export default ChangePassword;
