import React, { useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import styles from "./ChangePassword.module.scss";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../modules/Functions";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
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

    updatePassword(user, newPassword)
      .then(() => {
        toastSuccess("비밀번호가 업데이트되었습니다.");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
      })
      .catch((error) => {
        console.log(error.message);
        setErrorMessage(error.message);
      });
  };

  const isSubmitDisabled =
    newPassword === "" ||
    confirmPassword === "" ||
    newPassword !== confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer position="top-right" autoClose={2000} />

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
