import React, { useState } from "react";
import styles from "./Join.module.scss";
import font from "../../styles/Font.module.scss";
import { checkDarkMode } from "../../modules/Functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./Join.module.scss";

const Join = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");

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
    if (e.target.value.trim().length > 0) {
      setIsEmailActive(true);
    } else {
      setIsEmailActive(false);
    }
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다!");
      setIsEmail(false);
    } else {
      setEmailMessage("사용 가능한 이메일 입니다.");
      setIsEmail(true);
    }
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsIDActive(true);
    } else {
      setIsIDActive(false);
    }

    const currentName = e.target.value;
    setName(currentName);

    if (currentName.length < 2 || currentName.length > 5) {
      setNameMessage("닉네임은 2글자 이상 5글자 이하로 입력해주세요!");
      setIsName(false);
    } else {
      setNameMessage("사용가능한 닉네임 입니다.");
      setIsName(true);
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsPWActive(true);
    } else {
      setIsPWActive(false);
    }
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage("숫자+영문자+특수문자로 8자리 이상 입력해주세요!");
      setIsPassword(false);
    } else {
      setPasswordMessage("안전한 비밀번호 입니다.");
      setIsPassword(true);
    }
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsPWCActive(true);
    } else {
      setIsPWCActive(false);
    }
    const currentPasswordConfirm = e.target.value;
    setPasswordConfirm(currentPasswordConfirm);
    if (password !== currentPasswordConfirm) {
      setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
      setIsPasswordConfirm(false);
    } else {
      setPasswordConfirmMessage("비밀번호가 일치합니다.");
      setIsPasswordConfirm(true);
    }
  };

  const onChangePhone = (getNumber: string) => {
    const currentPhone = getNumber;
    setPhone(currentPhone);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (currentPhone) {
      setIsPhoneActive(true);
    } else {
      setIsPhoneActive(false);
    }

    if (!phoneRegExp.test(currentPhone)) {
      setPhoneMessage("올바른 형식이 아닙니다!");
      setIsPhone(false);
    } else {
      setPhoneMessage("사용 가능한 번호입니다.");
      setIsPhone(true);
    }
  };

  const addHyphen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentNumber = e.target.value;
    setPhone(currentNumber);
    if (currentNumber.length === 3 || currentNumber.length === 8) {
      setPhone(currentNumber + "-");
      onChangePhone(currentNumber + "-");
    } else {
      onChangePhone(currentNumber);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.logoBox}>
          <p
            className={`${styles.logo} ${font.fs_28} ${font.fw_9}`}
            onClick={toggleDark}
          >
            CodeUnity
          </p>
        </div>

        <div className={`${font.fs_20} ${font.fw_7} ${styles.headText}`}>
          개발자들이 머문자리를 보려면 가입하세요.
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
              value={email}
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
              value={name}
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
              value={password}
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
              value={passwordConfirm}
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
          <label
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
          </label>
        </div>

        <button
          type="submit"
          className={`${styles.loginBtn} ${font.fs_16} ${font.fw_7}`}
        >
          가입
        </button>
        <div className={styles.intoLogin}>
          계정이 있으신가요?{" "}
          <span className={`${styles.intoLoginSpan} ${font.fw_7}`}>로그인</span>
        </div>
      </div>
    </div>
  );
};

export default Join;
