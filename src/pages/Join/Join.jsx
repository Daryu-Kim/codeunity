import React, { useState } from "react";
import styles from "./Join.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { isDarkMode, toastClear, toastError, toastLoading } from "../../modules/Functions";
import { Link, useNavigate } from "react-router-dom";
import logoImgLight from "../../assets/svgs/Symbol+type_Columns_Light.svg"
import logoImgDark from "../../assets/svgs/Symbol+type_Columns_Dark.svg"

import { ToastContainer } from "react-toastify";

import "./Join.module.scss";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const Join = () => {
  const [emailMessage, setEmailMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [isEmailActive, setIsEmailActive] = useState(false);
  const [isIDActive, setIsIDActive] = useState(false);
  const [isPWActive, setIsPWActive] = useState(false);
  const [isPWCActive, setIsPWCActive] = useState(false);
  const [isPhoneActive, setIsPhoneActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [pwValue, setPwValue] = useState("");
  const [pwCValue, setPwCValue] = useState("");

  const auth = getAuth();
  const firestore = getFirestore();

  const navigate = useNavigate();

  const togglePasswordVisiblity = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const togglePasswordConfirmVisiblity = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
  };

  const onChangeEmail = (e) => {
    setEmailValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsEmailActive(true);
    } else {
      setIsEmailActive(false);
    }
  };

  const onChangeName = (e) => {
    setIdValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsIDActive(true);
    } else {
      setIsIDActive(false);
    }
  };

  const onChangePassword = (e) => {
    setPwValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsPWActive(true);
    } else {
      setIsPWActive(false);
    }
  };

  const onChangePasswordConfirm = (e) => {
    setPwCValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsPWCActive(true);
    } else {
      setIsPWCActive(false);
    }
  };

  const emailLogin = (email, password) => {
    if (!emailValue) {
      toastError("이메일을 입력해주세요!");
    } else if (!idValue) {
      toastError("닉네임을 입력해주세요!");
    } else if (!pwValue) {
      toastError("비밀번호를 입력해주세요!");
    } else if (!pwCValue) {
      toastError("비밀번호 확인을 입력해주세요!");
    } else if (pwValue.length < 6) {
      toastError("비밀번호는 최소 6자리 이상이어야 합니다!");
    } else if (pwValue !== pwCValue) {
      toastError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
    } else {
      createUserWithEmailAndPassword(emailValue, pwValue);
    }
  };

  const [
    createUserWithEmailAndPassword,
    createUser,
    createLoading,
    createError,
  ] = useCreateUserWithEmailAndPassword(auth);

  if (createError) {
    toastClear();
    console.log(createError.code);
    if (createError.code == "auth/email-already-in-use") {
      toastError("이미 사용 중인 이메일입니다.");
    }
    if (createError.code == "auth/invalid-email") {
      toastError("유효하지 않은 이메일입니다. 다시 확인해주세요.");
    }
    if (createError.code == "auth/weak-password") {
      toastError("비밀번호는 최소  6자리 이상이어야 합니다!");
    }
    if (createError.code == "auth/too-many-requests") {
      toastError("잠시 후 다시 시도해주세요!");
    }
  }
  if (createLoading) {
    console.log("Creating..");
    toastLoading("회원가입 중입니다...");
  }
  if (createUser) {
    console.log(createUser);
    const user = createUser.user;
    setDoc(doc(firestore, "Users", user.uid), {
      followerCount: 0,
      followingCount: 0,
      userDesc: "",
      userID: user.uid,
      userImg: "",
      userName: idValue,
      verifiedEmail: user.emailVerified,
      userTag: [],
      userSearchID: `@${user.uid}`
    })
    .then(() => {
      localStorage.setItem("uid", user.uid);
      toastClear();
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    });
  }

  // Renderer
  return (
    <div className={styles.wrapper}>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <div className={styles.box}>
        <div className={styles.logoBox}>
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
        </div>

        {/* <div className={`${font.fs_20} ${font.fw_7} ${styles.headText}`}>
          개발자들이 머문자리를 보려면 가입하세요.
        </div> */}
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
            <p className={styles.message}>{emailMessage}</p>
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
            <p className={styles.message}>{nameMessage}</p>
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
            <p className={styles.message}>{passwordMessage}</p>
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
            <p className={styles.message}>{passwordConfirmMessage}</p>
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

            <p className={styles.message}>{phoneMessage}</p>
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
