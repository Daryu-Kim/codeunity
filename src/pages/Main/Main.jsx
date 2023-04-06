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

const Main = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  console.log(user);

  if (!user) {
    navigate("/login", {
      replace: true,
    });
  }

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
        </Routes>
      </div>
    </div>
  );
};

export default Main;
