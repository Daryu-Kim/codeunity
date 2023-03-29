import React, { useState } from "react";
import styles from "./Join.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  checkDarkMode,
  toastError,
  toggleDarkMode,
} from "../../modules/Functions";
import { Link } from "react-router-dom";

import { signInEmail } from "../../modules/Firebase";
import { ToastContainer } from "react-toastify";

import "./Join.module.scss";

const Join = () => {
  const [emailMessage, setEmailMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [isEmail, setIsEmail] = useState(false);
  const [isname, setIsName] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  const [isEmailActive, setIsEmailActive] = useState(false);
  const [isIDActive, setIsIDActive] = useState(false);
  const [isPWActive, setIsPWActive] = useState(false);
  const [isPWCActive, setIsPWCActive] = useState(false);
  const [isPhoneActive, setIsPhoneActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [pwValue, setPwValue] = useState("");
  const [pwCValue, setPwCValue] = useState("");

  const togglePasswordVisiblity = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const togglePasswordConfirmVisiblity = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
  };

  const toggleDark = () => {
    const bodyClass = document.body.classList;
    // bodyClass.toggle(styles.darkTheme);
    bodyClass.contains(styles.darkTheme)
      ? localStorage.setItem("isDarkMode", "light")
      : localStorage.setItem("isDarkMode", "dark");
    checkDarkMode(styles);
    setIsDarkMode(bodyClass.contains(styles.darkTheme));
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsEmailActive(true);
    } else {
      setIsEmailActive(false);
    }
    const currentEmail = e.target.value;

    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    // if (!emailRegExp.test(currentEmail)) {
    //   setEmailMessage("이메일의 형식이 올바르지 않습니다!");
    //   setIsEmail(false);
    // } else {
    //   setEmailMessage("사용 가능한 이메일 입니다.");
    //   setIsEmail(true);
    // }
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsIDActive(true);
    } else {
      setIsIDActive(false);
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsPWActive(true);
    } else {
      setIsPWActive(false);
    }
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwCValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsPWCActive(true);
    } else {
      setIsPWCActive(false);
    }
  };

  const emailLogin = (
    email: string,
    name: string,
    password: string,
    passwordc: string
  ) => {
    if (!emailValue) {
      toastError("이메일을 입력해주세요!");
    } else if (!idValue) {
      toastError("닉네임을 입력해주세요!");
    } else if (!pwValue) {
      toastError("비밀번호를 입력해주세요!");
    } else if (!pwCValue) {
      toastError("비밀번호 확인을 입력해주세요!");
    } else {
      signInEmail(email, password);
    }
  };

  return (
    <div className={styles.wrapper}>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <div className={styles.box}>
        <div className={styles.logoBox}>
          <p
            className={`${styles.logo} ${font.fs_28} ${font.fw_9}`}
            onClick={toggleDark}
          >
            CodeUnity
          </p>
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
          <p className={`${styles.joinDes} ${font.fs_12}`}>
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
