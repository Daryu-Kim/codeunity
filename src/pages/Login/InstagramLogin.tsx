import React, { useState } from "react";
import styles from "./Login.module.scss";
import font from "../../Font.module.scss";

const footerArr: string[] = [
  "Meta",
  "소개",
  " 블로그",
  "채용 정보",
  "도움말",
  "AII",
  "개인정보처리방침",
  "약관",
  "인기 계정",
  "위치",
  " CodeUnity Lite",
  "DarkMode",
];

function InstagramLogin() {
  const [isActive, setIsActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const togglePasswordVisiblity = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleDarkModeToggle = () => {
    document.body.classList.toggle("dark");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.logoBox}>
          <div className={styles.logoLight}></div>
          <div className={styles.logoDark}></div>
        </div>
        
        <div className={styles.formParent}>
          <label htmlFor="idInput" className={styles.formGroup}>
            <p className={isActive ? `${styles.inputDes} ${styles.active} ${font.fs_12}` : `${styles.inputDes} ${font.fs_14}`}>
              전화번호, 사용자 이름 또는 이메일
            </p>
            <input id="idInput" type="text" onChange={handleInputChange} className={isActive ? `${styles.input} ${styles.active} ${font.fs_12}` : `${styles.input} ${font.fs_14}`}/>
          </label>
        </div>
      </div>
      {/* <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.logoBox}>
            <div className={styles.logoLight}></div>
            <div className={styles.logoDark}></div>
          </div>

          <div className="signin-form" id="signin-form">
            <label htmlFor="id" className={styles.formGroup}>
              <span className={isActive ? `${styles.inputDes} ${styles.active}` : `${styles.inputDes}`}>
                전화번호, 사용자 이름 또는 이메일
              </span>
              <input
                id="id"
                type="text"
                onChange={handleInputChange}
                className={isActive ? `${styles.input}` : `${styles.input} ${styles.none}`}
              />
            </label>
            <div className="form-group">
              <div className="animate-input">
                <span>비밀번호</span>
                <input
                  className={styles.input}
                  type={isPasswordVisible ? "text" : "password"}
                  onChange={handleInputChange}
                />
                <button onClick={togglePasswordVisiblity}>
                  {isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 표시"}
                </button>
              </div>
            </div>
            <div className="btn-group">
              <button className="btn-login" id="btn-login" disabled={!isActive}>
                로그인
              </button>
            </div>
            <div className="or-box">
              <div></div>
              <div>또는</div>
              <div></div>
            </div>
            <div className="btn-group">
              <button className="btn-fb">
                <img src="./images/facebook-icon.png" alt="facebook-icon" />
                <span>페이스북으로 로그인</span>
              </button>
            </div>
            <a href="" className="forgot-pw">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        <div className="join-box box">
          <p>
            아이디가 없으신가요? <a href="">가입하기</a>
          </p>
        </div>

        <div className="app-download">
          <p>앱을 다운로드하세요.</p>
          <div className="store-link">
            <a href="">
              <img src="./images/app-store.png" alt="app-store" />
            </a>
            <a href="">
              <img src="./images/gg-play.png" alt="play-store" />
            </a>
          </div>
        </div>

        <div className={styles.footer}>
          <ul className="links">
            {footerArr.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
            <li>
              <a href="" id="darkmode-toggle" onClick={handleDarkModeToggle}>
                Darkmode
              </a>
            </li>
          </ul>
          <div className="copy-right">© 2023 CodeUnity</div>
        </div>
      </div> */}
    </div>
  );
}

export default InstagramLogin;
