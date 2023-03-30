import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, useNavigate, Route } from "react-router";
import { auth } from "../../modules/Firebase";
import styles from "./Main.module.scss";
import font from "../../styles/Font.module.scss";
import MainHeader from "../../components/MainHeader/MainHeader";
import MainHome from "../../components/MainHome/MainHome";
import { signOut } from "@firebase/auth";
import MainFooter from "../../components/MainFooter/MainFooter";
import MainProfile from "../../components/MainProfile/MainProfile";
import MainChat from "../../components/MainChat/MainChat";
import MainQnA from "../../components/MainQnA/MainQnA";

const Main = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login", {
      replace: true,
    });
  }
  
  return (
    <div>
      <MainHeader />
      <Routes>
        <Route path="" element={<MainHome />}></Route>
        <Route path="chat" element={<MainChat />}></Route>
        <Route path="profile" element={<MainProfile />}></Route>
        <Route path="qna" element={<MainQnA />}></Route>
      </Routes>
      <MainFooter />
    </div>
  );
};

export default Main;
