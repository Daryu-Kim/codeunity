import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Login.module.scss";
import font from "../../styles/Font.module.scss";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  isDarkMode,
  toastClear,
  toastError,
  toastLoading,
} from "../../modules/Functions";
import { Link, useNavigate } from "react-router-dom";
import logoImgLight from "../../assets/svgs/Symbol+type_Columns_Light.svg";
import logoImgDark from "../../assets/svgs/Symbol+type_Columns_Dark.svg";
import { signInEmail, signInGitHub } from "../../modules/Firebase";
import { ToastContainer } from "react-toastify";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGithub,
} from "react-firebase-hooks/auth";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import LoginSearchPW from "../../components/LoginSearchPW/LoginSearchPW";

function Login() {
  const [isIDActive, setIsIDActive] = useState(false); // ID input이 활성화되었는지 여부를 저장하는 state
  const [isPWActive, setIsPWActive] = useState(false); // PW input이 활성화되었는지 여부를 저장하는 state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // PW input의 가리기/보이기 여부를 저장하는 state
  const [modalState, setModalState] = useState(false); // modal의 상태를 저장하는 state

  const [idValue, setIdValue] = useState(""); // ID input의 value를 저장하는 state
  const [pwValue, setPwValue] = useState(""); // PW input의 value를 저장하는 state

  const auth = getAuth(); // Firebase auth 객체
  const navigate = useNavigate(); // react-router-dom의 navigate 함수

  const handleIDInputChange = (e) => {
    // ID input의 value가 변경될 때 실행되는 함수
    setIdValue(e.target.value.trim()); // ID input의 value를 trim하여 state에 저장
    setIsIDActive(e.target.value.trim().length > 0); // ID input이 활성화되었는지 여부를 state에 저장
  };

  const handlePWInputChange = (e) => {
    // PW input의 value가 변경될 때 실행되는 함수
    setPwValue(e.target.value.trim()); // PW input의 value를 trim하여 state에 저장
    setIsPWActive(e.target.value.trim().length > 0); // PW input이 활성화되었는지 여부를 state에 저장
  };

  const togglePasswordVisiblity = () => {
    // PW input의 가리기/보이기 여부를 변경하는 함수
    setIsPasswordVisible(!isPasswordVisible); // isPasswordVisible state를 반전시켜 저장
  };

  const activeEnter = (e) => {
    // Enter key가 눌렸을 때 실행되는 함수
    if (e.key === "Enter") {
      // Enter key가 눌렸을 때
      formCheck(idValue, pwValue); // formCheck 함수 실행
    }
  };

  const formCheck = (email, password) => {
    // form이 유효한지 체크하는 함수
    if (!idValue) {
      // ID input이 비어있을 때
      toastError("이메일을 입력해주세요!"); // 에러 메시지 출력
    } else if (!pwValue) {
      // PW input이 비어있을 때
      toastError("비밀번호를 입력해주세요!"); // 에러 메시지 출력
    } else {
      // ID와 PW input이 모두 유효할 때
      signInWithEmailAndPassword(email, password); // Firebase의 signInWithEmailAndPassword 함수 실행
    }
  };

  /* Email Login */
  const [signInWithEmailAndPassword, emailUser, emailLoading, emailError] =
    useSignInWithEmailAndPassword(auth); // Firebase의 useSignInWithEmailAndPassword hook

  if (emailError) {
    // 로그인 에러가 발생했을 때
    switch (
      emailError.code // Firebase error code에 따라 분기 처리
    ) {
      case "auth/wrong-password": // 비밀번호가 틀렸을 때
        toastError("비밀번호가 맞지 않습니다!"); // 에러 메시지 출력
        break;
      case "auth/internal-error": // 내부 오류가 발생했을 때
        toastError("알 수 없는 오류입니다!"); // 에러 메시지 출력
        break;
      case "auth/invalid-email": // 이메일 형식이 맞지 않을 때
        toastError("이메일 형식이 맞지 않습니다!"); // 에러 메시지 출력
        break;
      case "auth/user-not-found": // 유저를 찾을 수 없을 때
        toastError("이메일 또는 비밀번호가 잘못되었습니다!"); // 에러 메시지 출력
        break;
      case "auth/too-many-requests": // 로그인 시도가 너무 많을 때
        toastError("잠시 후 다시 시도해주세요!"); // 에러 메시지 출력
        break;
      default:
        break;
    }
  }
  if (emailLoading) {
    // 로그인 중일 때
    toastLoading("로그인 중입니다..."); // 로딩 메시지 출력
  }
  if (emailUser) {
    // 로그인이 완료되었을 때
    toastClear(); // 모든 toast 메시지 제거
    localStorage.setItem("uid", emailUser.user.uid); // 로그인한 유저의 uid를 localStorage에 저장
    setTimeout(() => {
      // 0.5초 후에
      navigate("/", { replace: true }); // 메인 페이지로 이동
    }, 500);
  }

  /* GitHub Login */
  // const [signInWithGithub, gitUser, gitLoading, gitError] = useSignInWithGithub(auth);

  // if (gitError) {
  //   // if Login Error
  //   console.error(gitError);
  // }
  // if (gitLoading) {
  //   // if Logging..
  //   console.log("logging..");
  // }
  // if (gitUser) {
  //   // if Login Completed!
  //   console.log(gitUser);
  //   localStorage.setItem("uid", gitUser.user.uid);
  //   navigate("/", { replace: true });
  // }

  const signInWithGithub = () => {
    // GitHub 로그인 버튼 클릭 시 실행되는 함수
    window.open(
      "https://github.com/login/oauth/authorize?client_id=4972759927ee7d81c2b5&redirect_uri=http://localhost:3000/callback" // 새 창을 열어 GitHub OAuth 인증 페이지로 이동
    );
  };

  return (
    <div className={styles.wrapper}>
      {modalState && <LoginSearchPW setModalState={setModalState} />}
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

        <div className={styles.formParent}>
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
              전화번호, 사용자 이름 또는 이메일
            </p>
            <input
              id="idInput"
              type="text"
              onChange={handleIDInputChange}
              value={idValue}
              className={
                isIDActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              autocomplete="off"
            />
          </label>
          <label
            htmlFor="pwInput"
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
              id="pwInput"
              type={isPasswordVisible ? "text" : "password"}
              onChange={handlePWInputChange}
              className={
                isPWActive
                  ? `${styles.input} ${styles.active} ${font.fs_14}`
                  : `${styles.input} ${font.fs_14}`
              }
              value={pwValue}
              autocomplete="off"
              onKeyDown={(e) => activeEnter(e)}
            />
            <FontAwesomeIcon
              icon={!isPasswordVisible ? faEye : faEyeSlash}
              className={styles.inputToggle}
              onClick={togglePasswordVisiblity}
            />
          </label>
          <button
            className={`${styles.searchPW} ${font.fs_12} ${font.fw_5}`}
            onClick={() => setModalState(true)}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <button
          className={`${styles.loginBtn} ${font.fs_16} ${font.fw_7}`}
          onClick={() => formCheck(idValue, pwValue)}
        >
          로그인
        </button>
        <div className={styles.hrBox}>
          <hr />
          <p className={font.fs_12}>또는</p>
          <hr />
        </div>
        <div className={styles.githubBtn} onClick={signInWithGithub}>
          <FontAwesomeIcon icon={faGithub} className={styles.github} />
          <p className={`${font.fs_16} ${font.fw_7}`}>GitHub로 로그인</p>
        </div>
        <div className={styles.joinBox}>
          <p className={`${styles.joinDes} ${font.fs_12}`}>
            계정이 없으신가요?
          </p>
          <Link
            to="/join"
            className={`${styles.joinBtn} ${font.fs_12} ${font.fw_5}`}
          >
            가입하기
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
}

export default Login;
