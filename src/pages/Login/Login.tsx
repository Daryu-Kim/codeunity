import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./Login.module.scss";
import font from "../../styles/Font.module.scss";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { checkDarkMode, toastError, toggleDarkMode } from "../../modules/Functions";
import { Link } from "react-router-dom";
import { signInEmail } from "../../modules/Firebase";
import { ToastContainer } from "react-toastify";
import { validate, res } from 'react-email-validator';

function Login() {
  const [isIDActive, setIsIDActive] = useState(false);
  const [isPWActive, setIsPWActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [idValue, setIdValue] = useState("");
  const [pwValue, setPwValue] = useState("");

  checkDarkMode(styles);

  const handleIDInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdValue(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setIsIDActive(true);
    } else {
      setIsIDActive(false);
    }
  };

  const handlePWInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const emailLogin = (email: string, password: string) => {
    if (!idValue) {
      toastError("이메일을 입력해주세요!");
    } else {
      console.log(Validator.isEmail(idValue));
      if (!pwValue) {
        toastError("비밀번호를 입력해주세요!");
      } else {
        signInEmail(email, password);
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />
      <div className={styles.box}>
        <div className={styles.logoBox}>
          {/* <div
            className={
              isDarkMode ?
              styles.logoDark :
              styles.logoLight
            }
          ></div> */}
          <p className={`${font.fs_28} ${font.fw_9}`}>
            CodeUnity
          </p>
        </div>
        
        <div className={styles.formParent}>
          <label
            htmlFor="idInput"
            className={
              isIDActive ?
              `${styles.formGroup} ${styles.active}` :
              `${styles.formGroup}`
            }
          >
            <p
              className={
                isIDActive ?
                `${styles.inputDes} ${styles.active} ${font.fs_12}` :
                `${styles.inputDes} ${font.fs_14}`
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
                isIDActive ?
                `${styles.input} ${styles.active} ${font.fs_14}` :
                `${styles.input} ${font.fs_14}`
              }
            />
          </label>
          <label htmlFor="pwInput" className={isPWActive ? `${styles.formGroup} ${styles.active}` : `${styles.formGroup}`}>
            <p className={isPWActive ? `${styles.inputDes} ${styles.active} ${font.fs_12}` : `${styles.inputDes} ${font.fs_14}`}>
              비밀번호
            </p>
            <input
              id="pwInput"
              type={isPasswordVisible ? "text" : "password"}
              onChange={handlePWInputChange}
              className={isPWActive ? `${styles.input} ${styles.active} ${font.fs_14}` : `${styles.input} ${font.fs_14}`}
              value={pwValue}
            />
            <FontAwesomeIcon
              icon={!isPasswordVisible ? faEye : faEyeSlash}
              className={styles.inputToggle}
              onClick={togglePasswordVisiblity}
            />
          </label>
          <Link to="" className={`${styles.searchPW} ${font.fs_12} ${font.fw_5}`}>
            비밀번호를 잊으셨나요?
          </Link>
        </div>
        <button
          className={`${styles.loginBtn} ${font.fs_16} ${font.fw_7}`}
          onClick={() => emailLogin(idValue, pwValue)}
        >
          로그인
        </button>
        <div className={styles.hrBox}>
          <hr />
          <p className={font.fs_12}>또는</p>
          <hr />
        </div>
        <button className={styles.githubBtn}>
          <FontAwesomeIcon icon={faGithub} className={styles.github} />
          <p className={`${font.fs_16} ${font.fw_7}`}>GitHub로 로그인</p>
        </button>
        <div className={styles.joinBox}>
          <p className={`${styles.joinDes} ${font.fs_12}`}>계정이 없으신가요?</p>
          <Link to="/join" className={`${styles.joinBtn} ${font.fs_12} ${font.fw_5}`}>
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
