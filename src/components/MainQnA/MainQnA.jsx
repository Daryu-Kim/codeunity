import { useEffect, useState } from "react";
import styles from "./MainQnA.module.scss";
import font from "../../styles/Font.module.scss";
import MainPQModal from "../MainPQModal/MainPQModal";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { query, collection, orderBy, doc } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import baseImg from "../../assets/svgs/352174_user_icon.svg"
import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";


const MainQnA = () => {
  const uid = localStorage.getItem("uid");

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [myData, myDataLoad, myDataError] = useDocumentData(
    doc(firestore, "Users", uid)
  )
  const [modalState, setModalState] = useState(false);
  const [htmlWidth, setHtmlWidth] = useState(0);
  const [qnaPost, qnaPostLoad, qnaPostError] = useCollectionData(
    query(collection(firestore, "QnAs"), orderBy("createdAt", "desc")) // 생성일 기준으로 내림차순 정렬
  );
  const [qnaData, setQnAData] = useState([]);

  useEffect(() => {
    // 창 크기 조절 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (qnaPost) {
      const tempQnAData = [...qnaData];
      qnaPost.map((item, index) => {
        tempQnAData[index] = item;
      });
      setQnAData(tempQnAData);
    }
  }, [qnaPost])

  const handleResize = () => {
    // 창 크기 조절 이벤트 핸들러
    setHtmlWidth(window.innerWidth); // 현재 창 너비 상태 업데이트
  };

  const showModal = () => setModalState(true);

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
  }; // "/profile" 경로로 이동하며, state에 userID를 전달하고, replace 옵션을 true로 설정하여 브라우저 히스토리를 변경하지 않음


  return (
    qnaPost && myData && qnaData && (
      <div className={styles.wrapper}>
      <div className={styles.box}>
      <div className={`${styles.writePostBtn}`}>
            <div className={styles.writePostTopBox}>
              <div
                className={styles.writePostTopImg}
                onClick={() => profileClick(uid)}
                style={
                  myData.userImg
                    ? { backgroundImage: `url(${myData.userImg})` }
                    : { backgroundImage: `url(${baseImg})` }
                }
              ></div>
              <div className={styles.writePostTopInputBox} onClick={showModal}>
                <p
                  className={`${font.fs_14} ${font.fc_sub_light} ${styles.writePostTopName}`}
                >
                  {htmlWidth > 767
                    ? `수많은 개발자들에게 물어보세요!`
                    : `질문하기..`}
                </p>
              </div>
            </div>
          </div>

        <div className={styles.postBox}>
          <div className={styles.postRecommendBox}>
            <p className={`${font.fs_24} ${font.fw_7}`}>
              추천 질문
            </p>
            <Swiper>
              {
                qnaData.map((item, index) => {
                  <SwiperSlide>
                    {item}
                  </SwiperSlide>
                })
              }
            </Swiper>
          </div>
        </div>
      </div>

      {modalState && <MainPQModal setModalState={setModalState} modalType="QnAs" /> }
    </div>
    )
    
  );
};

export default MainQnA;
