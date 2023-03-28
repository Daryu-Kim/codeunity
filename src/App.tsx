// import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import LoginTest from "./pages/Login/InstagramLogin";
import Join from "./pages/Join/Join";
import "./styles/reset.scss";

function App() {
  // const body = useRef<HTMLDivElement>(null);
  // const themeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.target.checked ? body.current?.classList.add("dark-theme") : body.current?.classList.remove("dark-theme");
  // };
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element= */}
        <Route path="/login" element={<Login />} />
        <Route path="/logintest" element={<LoginTest />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
