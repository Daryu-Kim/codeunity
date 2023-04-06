// import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import "./styles/reset.scss";
import ReactPWAInstallProvider from "react-pwa-install";

function App() {
  const uid = localStorage.getItem("uid");
  const vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty("--vh", `${vh}px`);

  if (!uid) {
    localStorage.setItem("uid", "undefined");
  }

  window.addEventListener("resize", () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  return (
    <ReactPWAInstallProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </BrowserRouter>
    </ReactPWAInstallProvider>
  );
}

export default App;
