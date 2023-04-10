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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            toastSuccess("비밀번호가 업데이트되었습니다.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrorMessage("");
          })
          .catch((error) => {
            console.log(error.message);
            setErrorMessage(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
        toastError("현재 비밀번호가 일치하지 않습니다.");
      });
  };

  const isSubmitDisabled =
    currentPassword === "" ||
    newPassword === "" ||
    confirmPassword === "" ||
    newPassword !== confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer position="top-right" autoClose={2000} bodyClassName={styles.toast} />

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
