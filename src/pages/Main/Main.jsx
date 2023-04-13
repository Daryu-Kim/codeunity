import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, useNavigate, Route } from "react-router";
import { auth } from "../../modules/Firebase";
import styles from "./Main.module.scss";
import MainSideBar from "../../components/MainSideBar/MainSideBar";
import MainHeader from "../../components/MainHeader/MainHeader";
import MainHome from "../../components/MainHome/MainHome";
import MainProfile from "../../components/MainProfile/MainProfile";
import MainChat from "../../components/MainChat/MainChat";
import MainQnA from "../../components/MainQnA/MainQnA";
import MainSettings from "../../components/MainSettings/MainSettings";
import MainInquiry from "../../components/MainInquiry/MainInquiry";
import MainSearch from "../../components/MainSearch/MainSearch";

const Main = () => {
  // useAuthState hook을 사용하여 현재 인증된 사용자를 가져온다.
  const [user] = useAuthState(auth);
  // useNavigate hook을 사용하여 페이지 이동 함수를 가져온다.
  const navigate = useNavigate();
  let lastTouchEnd = 0; // 마지막 터치 이벤트 시간을 저장하는 변수 초기화

  if (!user) {
    navigate("/login", {
      // 로그인 페이지로 이동
      replace: true, // 이전 페이지를 스택에서 제거
    });
  }

  // 문서의 루트 요소에 이벤트 리스너를 추가합니다.
  document.documentElement.addEventListener(
    // "touchstart" 이벤트가 발생하면,
    "touchstart",
    (event) => {
      // 만약 터치가 1개 이상이라면,
      if (event.touches.length > 1) {
        // 이벤트를 취소합니다.
        event.preventDefault();
      }
    },
    false
  );

  // 문서 객체의 루트 요소에 이벤트 리스너를 추가한다.
  document.documentElement.addEventListener(
    // 터치 이벤트의 종류 중 하나인 touchend 이벤트를 대상으로 한다.
    "touchend",
    // 이벤트 핸들러 함수를 작성한다.
    (event) => {
      // 현재 시간을 구한다.
      const now = new Date().getTime();
      // 이전 터치 이벤트와의 시간 간격이 300밀리초 이내라면
      if (now - lastTouchEnd <= 300) {
        // 이벤트의 기본 동작을 막는다.
        event.preventDefault();
      }
      // 이전 터치 이벤트의 시간을 현재 시간으로 갱신한다.
      lastTouchEnd = now;
    },
    // 이벤트 캡처링을 사용하지 않는다.
    false
  );

  return (
    <div className={styles.mainBox}>
      <MainSideBar /> {/* 메인 사이드바 */}
      <div className={styles.subBox}>
        <MainHeader /> {/* 메인 헤더 */}
        <Routes>
          <Route path="" element={<MainHome />}></Route> {/* 메인 홈 */}
          <Route path="chat" element={<MainChat />}></Route> {/* 메인 채팅 */}
          <Route path="profile" element={<MainProfile />}></Route> {/* 메인 프로필 */}
          <Route path="qna" element={<MainQnA />}></Route> {/* 메인 QnA */}
          <Route path="settings" element={<MainSettings />}></Route> {/* 메인 설정 */}
          <Route path="inquiry" element={<MainInquiry />}></Route> {/* 메인 문의 */}
          <Route path="search" element={<MainSearch />}></Route> {/* 메인 검색 */}
        </Routes>
      </div>
    </div>
  );
};

export default Main;
