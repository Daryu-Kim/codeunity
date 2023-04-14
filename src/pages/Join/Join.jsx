import React, { useState } from "react";
import styles from "./Join.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  isDarkMode,
  toastClear,
  toastError,
  toastLoading,
} from "../../modules/Functions";
import { Link, useNavigate } from "react-router-dom";
import logoImgLight from "../../assets/svgs/Symbol+type_Columns_Light.svg";
import logoImgDark from "../../assets/svgs/Symbol+type_Columns_Dark.svg";

import { ToastContainer } from "react-toastify";

import "./Join.module.scss";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const Join = () => {
  const [isEmailActive, setIsEmailActive] = useState(false); // 이메일 입력창 활성화 여부
  const [isIDActive, setIsIDActive] = useState(false); // 아이디 입력창 활성화 여부
  const [isPWActive, setIsPWActive] = useState(false); // 비밀번호 입력창 활성화 여부
  const [isPWCActive, setIsPWCActive] = useState(false); // 비밀번호 확인 입력창 활성화 여부
  const [isPhoneActive, setIsPhoneActive] = useState(false); // 전화번호 입력창 활성화 여부
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 비밀번호 입력창에 입력한 값의 가리기/보이기 여부
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false); // 비밀번호 확인 입력창에 입력한 값의 가리기/보이기 여부

  const [emailValue, setEmailValue] = useState(""); // 이메일 입력값
  const [idValue, setIdValue] = useState(""); // 아이디 입력값
  const [pwValue, setPwValue] = useState(""); // 비밀번호 입력값
  const [pwCValue, setPwCValue] = useState(""); // 비밀번호 확인 입력값

  const auth = getAuth(); // Firebase 인증 객체
  const firestore = getFirestore(); // Firebase Firestore 객체
  const navigate = useNavigate(); // React Router의 navigate 함수

  const [
    createUserWithEmailAndPassword,
    createUser,
    createLoading,
    createError,
  ] = useCreateUserWithEmailAndPassword(auth); // Firebase 인증을 이용한 회원가입 함수, 회원가입 함수 실행 여부, 회원가입 에러 메시지

  if (createError) {
    toastClear(); // toastClear 함수 호출
    switch (
      createError.code // createError.code 값에 따라 분기
    ) {
      case "auth/email-already-in-use": // 이메일이 이미 사용 중인 경우
        toastError("이미 사용 중인 이메일입니다."); // 에러 메시지 출력
        break;
      case "auth/invalid-email": // 유효하지 않은 이메일인 경우
        toastError("유효하지 않은 이메일입니다. 다시 확인해주세요."); // 에러 메시지 출력
        break;
      case "auth/weak-password": // 비밀번호가 약한 경우
        toastError("비밀번호는 최소 6자리 이상이어야 합니다!"); // 에러 메시지 출력
        break;
      case "auth/too-many-requests": // 요청이 너무 많은 경우
        toastError("잠시 후 다시 시도해주세요!"); // 에러 메시지 출력
        break;
      default:
        break;
    }
  }

  createLoading && toastLoading("회원가입 중입니다..."); // createLoading이 true일 경우에만 toastLoading 함수를 실행하여 "회원가입 중입니다..." 메시지를 띄움

  if (createUser) {
    const user = createUser.user; // createUser 객체에서 user 객체를 가져옴
    setDoc(doc(firestore, "Users", user.uid), {
      // firestore의 Users 컬렉션에 새로운 문서를 생성하고 user 정보를 저장
      followerCount: 0, // 팔로워 수 초기값 0으로 설정
      followingCount: 0, // 팔로잉 수 초기값 0으로 설정
      userDesc: "", // 사용자 설명 초기값 빈 문자열로 설정
      userID: user.uid, // 사용자 ID를 user.uid로 설정
      userImg: "", // 사용자 이미지 초기값 빈 문자열로 설정
      userName: idValue, // 사용자 이름을 idValue로 설정
      verifiedEmail: user.emailVerified, // 이메일 인증 여부를 user.emailVerified로 설정
      userTag: [], // 사용자 태그 초기값 빈 배열로 설정
      userSearchID: `@${user.uid}`, // 사용자 검색 ID를 @와 user.uid를 조합하여 설정
    }).then(() => {
      localStorage.setItem("uid", user.uid); // 로컬 스토리지에 사용자 ID를 저장
      setTimeout(() => navigate("/", { replace: true }), 500); // 0.5초 후에 "/" 경로로 이동
    });
  }

  const togglePasswordVisiblity = () =>
    // 비밀번호 가리기/보이기를 토글하는 함수
    setIsPasswordVisible(!isPasswordVisible); // isPasswordVisible의 값을 반전시킨 후, setIsPasswordVisible 함수를 호출하여 상태를 업데이트한다.

  const togglePasswordConfirmVisiblity = () =>
    // 비밀번호 확인 가리기/보이기를 토글하는 함수
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible); // isPasswordConfirmVisible의 값을 반전시킴

  const onChangeEmail = (e) => {
    // 이메일 입력값에서 공백 제거
    const emailValue = e.target.value.trim();
    // 이메일 상태 업데이트
    setEmailValue(emailValue);
    // 이메일 입력값이 있으면 이메일 활성화
    setIsEmailActive(emailValue.length > 0);
  };

  const onChangeName = (e) => {
    // 입력값의 공백을 제거하여 trimmedValue 변수에 할당
    const trimmedValue = e.target.value.trim();
    // setIdValue 함수를 호출하여 trimmedValue 변수 값을 idValue 상태 변수에 할당
    setIdValue(trimmedValue);
    // trimmedValue 변수의 길이가 0보다 크면 setIsIDActive 함수를 호출하여 isIDActive 상태 변수 값을 true로 설정
    setIsIDActive(trimmedValue.length > 0);
  };

  const onChangePassword = (e) => {
    // 비밀번호 입력값에서 공백 제거
    const trimmedValue = e.target.value.trim();
    // 상태값 업데이트: 비밀번호 입력값
    setPwValue(trimmedValue);
    // 상태값 업데이트: 비밀번호 입력값이 있는지 여부
    setIsPWActive(trimmedValue.length > 0);
  };

  const onChangePasswordConfirm = (e) => {
    // 입력값에서 공백 제거
    const value = e.target.value.trim();
    // 입력값을 state에 저장
    setPwCValue(value);
    // 입력값이 있으면 isActive 상태를 true로 변경
    setIsPWCActive(value.length > 0);
  };

  const emailLogin = (emailValue, idValue, pwValue, pwCValue) => {
    // 이메일, 아이디, 비밀번호, 비밀번호 확인 필드가 모두 입력되었는지 확인
    if (!emailValue || !idValue || !pwValue || !pwCValue) {
      toastError("모든 필드를 입력해주세요!");
    }
    // 비밀번호가 6자리 이상인지 확인
    else if (pwValue.length < 6) {
      toastError("비밀번호는 최소 6자리 이상이어야 합니다!");
    }
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    else if (pwValue !== pwCValue) {
      toastError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
    // 모든 조건을 만족하면 이메일과 비밀번호로 계정 생성
    else {
      createUserWithEmailAndPassword(emailValue, pwValue);
    }
  };

  // Renderer
  return (
    <div className={styles.wrapper}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        bodyClassName={styles.toast}
      />
      <div className={styles.box}>
        <div className={styles.logoBox}>
          <img
            src={isDarkMode() ? logoImgDark : logoImgLight}
            alt="logoImg"
            className={styles.logoImg}
          />
        </div>
        <button className={styles.githubBtn}>
          <FontAwesomeIcon icon={faGithub} className={styles.github} />
          <p className={`${font.fs_16} ${font.fw_7}`}>GitHub로 로그인</p>
        </button>
        <div className={styles.hrBox}>
          <hr />
          <p className={font.fs_12}>또는</p>
          <hr />
        </div>
        <div className={styles.formParent}>
          <label
            htmlFor="idInput"
            className={
              isEmailActive
                ? `${styles.formGroup} ${styles.active}`
                : `${styles.formGroup}`
            }
          >
            <p
              className={
                isEmailActive
                  ? `${styles.inputDes} ${styles.active} ${font.fs_12}`
                  : `${styles.inputDes} ${font.fs_14}`
              }
            >
              이메일
            </p>
            <input
              id="email"
              name="name"
              type="text"
              value={emailValue}
              onChange={onChangeEmail}
              className={
                isEmailActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              autocomplete="off"
            />
          </label>
          <label
            htmlFor="idInput"
            className={
              isIDActive
                ? `${styles.formGroup} ${styles.active}`
                : `${styles.formGroup}`
            }
          >
            <p
              className={
                isIDActive
                  ? `${styles.inputDes} ${styles.active} ${font.fs_12}`
                  : `${styles.inputDes} ${font.fs_14}`
              }
            >
              사용자 닉네임
            </p>
            <input
              id="name"
              name="name"
              value={idValue}
              onChange={onChangeName}
              className={
                isIDActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              autocomplete="off"
            />
          </label>
          <label
            htmlFor="idInput"
            className={
              isPWActive
                ? `${styles.formGroup} ${styles.active}`
                : `${styles.formGroup}`
            }
          >
            <p
              className={
                isPWActive
                  ? `${styles.inputDes} ${styles.active} ${font.fs_12}`
                  : `${styles.inputDes} ${font.fs_14}`
              }
            >
              비밀번호
            </p>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={pwValue}
              onChange={onChangePassword}
              className={
                isPWActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              autocomplete="off"
            />
            <FontAwesomeIcon
              icon={!isPasswordVisible ? faEye : faEyeSlash}
              className={styles.inputToggle}
              onClick={togglePasswordVisiblity}
            />
          </label>
          <label
            htmlFor="idInput"
            className={
              isPWCActive
                ? `${styles.formGroup} ${styles.active}`
                : `${styles.formGroup}`
            }
          >
            <p
              className={
                isPWCActive
                  ? `${styles.inputDes} ${styles.active} ${font.fs_12}`
                  : `${styles.inputDes} ${font.fs_14}`
              }
            >
              비밀번호 확인
            </p>
            <input
              type={isPasswordConfirmVisible ? "text" : "password"}
              id="passwordConfirm"
              name="passwordConfirm"
              value={pwCValue}
              onChange={onChangePasswordConfirm}
              className={
                isPWCActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              autocomplete="off"
            />
            <FontAwesomeIcon
              icon={!isPasswordConfirmVisible ? faEye : faEyeSlash}
              className={styles.inputToggle}
              onClick={togglePasswordConfirmVisiblity}
            />
          </label>
          {/* <label
            htmlFor="idInput"
            className={
              isPhoneActive
                ? `${styles.formGroup} ${styles.active}`
                : `${styles.formGroup}`
            }
          >
            <p
              className={
                isPhoneActive
                  ? `${styles.inputDes} ${styles.active} ${font.fs_12}`
                  : `${styles.inputDes} ${font.fs_14}`
              }
            >
              전화번호
            </p>
            <input
              id="phone"
              name="phone"
              value={phone}
              onChange={addHyphen}
              className={
                isPhoneActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
            />
          </label> */}
        </div>

        <button
          type="submit"
          className={`${styles.loginBtn} ${font.fs_16} ${font.fw_7}`}
          onClick={() => emailLogin(emailValue, idValue, pwValue, pwCValue)}
        >
          가입
        </button>
        <div className={styles.intoLogin}>
          <p className={`${styles.loginDes} ${font.fs_12}`}>
            계정이 있으신가요?
          </p>
          <Link
            to="/login"
            className={`${styles.intoLoginLink} ${font.fs_12} ${font.fw_5}`}
          >
            로그인
          </Link>
        </div>
      </div>
      <div className={styles.company}>
        <p className={styles.companyDes}>from</p>
        <i className={`${styles.companyName} ${font.fw_9} ${font.fs_14}`}>
          DW Duo
        </i>
      </div>
    </div>
  );
};

export default Join;
