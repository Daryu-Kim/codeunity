// import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import Callback from "./components/GithubCallback/GithubCallback";
import "./styles/reset.scss";

function App() {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    localStorage.setItem("uid", "undefined");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
