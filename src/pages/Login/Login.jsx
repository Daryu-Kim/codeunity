import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Login.module.scss";
import font from "../../styles/Font.module.scss";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { isDarkMode, toastClear, toastError, toastLoading } from "../../modules/Functions";
import { Link, useNavigate } from "react-router-dom";
import logoImgLight from "../../assets/svgs/Symbol+type_Columns_Light.svg"
import logoImgDark from "../../assets/svgs/Symbol+type_Columns_Dark.svg"
import { signInEmail, signInGitHub } from "../../modules/Firebase";
import { ToastContainer } from "react-toastify";
import { useAuthState, useSignInWithEmailAndPassword, useSignInWithGithub } from "react-firebase-hooks/auth";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

function Login() {
  const [isIDActive, setIsIDActive] = useState(false);
  const [isPWActive, setIsPWActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [idValue, setIdValue] = useState("");
  const [pwValue, setPwValue] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  const handleIDInputChange = (e) => {
    setIdValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsIDActive(true);
    } else {
      setIsIDActive(false);
    }
  };

  const handlePWInputChange = (e) => {
    setPwValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsPWActive(true);
    } else {
      setIsPWActive(false);
    }
  };

  const togglePasswordVisiblity = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      formCheck(idValue, pwValue);
    }
  }

  const formCheck = (email, password) => {
    if (!idValue) {
      toastError("이메일을 입력해주세요!");
    } else {
      if (!pwValue) {
        toastError("비밀번호를 입력해주세요!");
      } else {
        signInWithEmailAndPassword(email, password);
      }
    }
  };

  /* Email Login */
  const [signInWithEmailAndPassword, emailUser, emailLoading, emailError] = useSignInWithEmailAndPassword(auth);
  if (emailError) {
    // if Login Error
    if (emailError.code == "auth/wrong-password") {
      toastError("비밀번호가 맞지 않습니다!");
    }
    if (emailError.code == "auth/internal-error") {
      toastError("알 수 없는 오류입니다!");
    }
    if (emailError.code == "auth/invalid-email") {
      toastError("이메일 형식이 맞지 않습니다!");
    }
    if (emailError.code == "auth/user-not-found") {
      toastError("이메일 또는 비밀번호가 잘못되었습니다!");
    }
    if (emailError.code == "auth/too-many-requests") {
      toastError("잠시 후 다시 시도해주세요!");
    }
  }
  if (emailLoading) {
    // if Logging..
    console.log("logging..");
    toastLoading("로그인 중입니다...");
  }
  if (emailUser) {
    // if Login Completed!
    console.log(emailUser);
    toastClear();
    localStorage.setItem("uid", emailUser.user.uid);
    setTimeout(() => {
      navigate("/", { replace: true });
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
    window.open("https://github.com/login/oauth/authorize?client_id=4972759927ee7d81c2b5&redirect_uri=http://localhost:3000/callback");
  }

  

  // Renderer
  return (
    <div className={styles.wrapper}>
      <ToastContainer position="top-right" autoClose={2000} bodyClassName={styles.toast} />
      <div className={styles.box}>
        <div className={styles.logoBox}>
          {/* <div
            className={
              isDarkMode ?
              styles.logoDark :
              styles.logoLight
            }
          ></div> */}
          <img
            src=
              {
                isDarkMode() ?
                logoImgDark :
                logoImgLight
              }
            alt="logoImg"
            className={styles.logoImg}
          />
          {/* <p className={`${font.fs_28} ${font.fw_9}`}>CodeUnity</p> */}
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
          <Link
            to=""
            className={`${styles.searchPW} ${font.fs_12} ${font.fw_5}`}
          >
            비밀번호를 잊으셨나요?
          </Link>
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
        <div
          className={styles.githubBtn} onClick={signInWithGithub}
        >
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
