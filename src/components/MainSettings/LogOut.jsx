import React from "react";
import firebase from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

const LogOut = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.setItem("uid", "");
    } catch (error) {
      console.error(error.message);
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogOut;
