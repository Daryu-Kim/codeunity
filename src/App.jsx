import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import "./styles/reset.scss";
import ReactPWAInstallProvider from "react-pwa-install";

function App() {
  // 로컬 스토리지에서 uid 값을 가져옴
  const uid = localStorage.getItem("uid");
  // 뷰포트 높이의 1% 값을 계산하여 변수에 저장
  const vh = window.innerHeight * 0.01;

  // CSS의 변수(--vh)에 뷰포트 높이의 1% 값을 적용
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // uid 값이 없으면 "undefined" 값을 로컬 스토리지에 저장
  if (!uid) localStorage.setItem("uid", "undefined");

  // 브라우저 창 크기가 변경될 때마다 뷰포트 높이의 1% 값을 다시 계산하여 변수에 저장하고 CSS의 변수(--vh)에 적용
  window.addEventListener("resize", () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  // ReactPWAInstallProvider를 사용하여 PWA 설치를 위한 Provider를 제공하고, BrowserRouter를 사용하여 라우팅을 설정함
  return (
    <ReactPWAInstallProvider>
      <BrowserRouter>
        <Routes>
          {/* 경로가 "/*"인 경우 Main 컴포넌트를 렌더링 */}
          <Route path="/*" element={<Main />} />
          {/* 경로가 "/login"인 경우 Login 컴포넌트를 렌더링 */}
          <Route path="/login" element={<Login />} />
          {/* 경로가 "/join"인 경우 Join 컴포넌트를 렌더링 */}
          <Route path="/join" element={<Join />} />
        </Routes>
      </BrowserRouter>
    </ReactPWAInstallProvider>
  );
}

export default App;
