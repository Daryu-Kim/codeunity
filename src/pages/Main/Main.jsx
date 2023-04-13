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
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  console.log(user);

  if (!user) {
    navigate("/login", {
      replace: true,
    });
  }

  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
         event.preventDefault(); 
       } 
   }, false);

  var lastTouchEnd = 0; 

  document.documentElement.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); 
      } lastTouchEnd = now; 
  }, false);

  return (
    <div className={styles.mainBox}>
      <MainSideBar />
      <div className={styles.subBox}>
        <MainHeader />
        <Routes>
          <Route path="" element={<MainHome />}></Route>
          <Route path="chat" element={<MainChat />}></Route>
          <Route path="profile" element={<MainProfile />}></Route>
          <Route path="qna" element={<MainQnA />}></Route>
          <Route path="settings" element={<MainSettings />}></Route>
          <Route path="inquiry" element={<MainInquiry />}></Route>
          <Route path="search" element={<MainSearch />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Main;
