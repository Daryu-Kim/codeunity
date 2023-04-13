import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MainQnA.module.scss";
import font from "../../styles/Font.module.scss";
import MainPQModal from "../MainPQModal/MainPQModal";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  query,
  collection,
  orderBy,
  doc,
  Timestamp,
  limit,
} from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";
import { convertTimestamp } from "../../modules/Functions";
import { GrNext, GrPrevious } from "react-icons/gr"

const MainQnA = () => {
  const uid = localStorage.getItem("uid");
  const currentTime = Timestamp.fromDate(new Date());

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [myData, myDataLoad, myDataError] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  const [modalState, setModalState] = useState(false);
  const [modalPostState, setModalPostState] = useState(false);
  const [modalPostID, setModalPostID] = useState("");
  const [modalUserID, setModalUserID] = useState("");
  const [htmlWidth, setHtmlWidth] = useState(0);
  const [recommendQnA, recommendQnALoad, recommendQnAError] = useCollectionData(
    query(
      collection(firestore, "QnAs"),
      orderBy("postViews", "desc"),
      limit(10)
    ) // 생성일 기준으로 내림차순 정렬
  );
  const [qnaPost, qnaPostLoad, qnaPostError] = useCollectionData(
    query(collection(firestore, "QnAs"), orderBy("createdAt", "desc")) // 생성일 기준으로 내림차순 정렬
  );
  const [qnaData, setQnAData] = useState([]);
  const [recommendQnAData, setRecommendQnAData] = useState([]);

  const swiperRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!swiperRef.current.swiper.slidePrev());
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperRef.current.swiper.slideNext());
  }, []);

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
  }, [qnaPost]);

  useEffect(() => {
    if (recommendQnA) {
      const tempQnAData = [...recommendQnAData];
      recommendQnA.map((item, index) => {
        tempQnAData[index] = item;
      });
      setRecommendQnAData(tempQnAData);
    }
  }, [recommendQnA]);

  const handleResize = () => {
    // 창 크기 조절 이벤트 핸들러
    setHtmlWidth(window.innerWidth); // 현재 창 너비 상태 업데이트
  };

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
  }; // "/profile" 경로로 이동하며, state에 userID를 전달하고, replace 옵션을 true로 설정하여 브라우저 히스토리를 변경하지 않음

  const showModal = (postID, userID) => {
    setModalPostID(postID);
    setModalUserID(userID);
    setModalState(true);
  };

  const showPostModal = (postID, userID) => {
    setModalPostID(postID);
    setModalUserID(userID);
    setModalPostState(true);
  };

  return (
    qnaPost &&
    myData &&
    qnaData &&
    recommendQnAData && (
      <div className={styles.wrapper}>
        {modalPostState && (
          <div className={styles.mainCmtsModal}>
            <MainCmtsModal
              setModalState={setModalPostState}
              modalPostID={modalPostID}
              modalUserID={modalUserID}
              modalType="QnAs"
            />
          </div>
        )}
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
              <div className={styles.titleBox}>
                <p className={`${font.fs_24} ${font.fw_7}`}>추천 질문</p>
                <div className={styles.navBox}>
                  <GrPrevious className={styles.nav} onClick={handlePrev} />
                  <GrNext className={styles.nav} onClick={handleNext} />
                </div>
              </div>
              <Swiper
              ref={swiperRef}
                slidesPerView={1}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                }}
                className={styles.swiper}
                spaceBetween={16}
              >
                {recommendQnAData.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className={styles.slide}
                    onClick={() => showPostModal(item.postID, item.userID)}
                  >
                    <div className={styles.box}>
                      <p className={`${font.fs_16} ${font.fw_7}`}>
                        {item.postTitle}
                      </p>
                    </div>
                    <div className={styles.infoBox}>
                      <div className={styles.leftBox}>
                        <p
                          className={`${font.fs_12} ${font.fw_5} ${font.fc_accent_more_light}`}
                        >
                          UP {item.postUps}
                        </p>
                      </div>
                      <div className={styles.rightBox}>
                        <p
                          className={`${font.fs_12} ${font.fw_5} ${font.fc_accent_more_light}`}
                        >
                          조회 {item.postViews}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className={styles.allPostBox}>
              {qnaData.map((item, index) => (
                <div
                  className={styles.postItem}
                  key={index}
                  onClick={() => showPostModal(item.postID, item.userID)}
                >
                  <p className={`${font.fs_18} ${font.fw_7}`}>
                    {item.postTitle}
                  </p>
                  <p className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}>
                    자세한 내용을 확인하려면 클릭하세요
                  </p>
                  <div className={styles.tagBox}>
                    {item.postTags.map((item, index) => (
                      <p
                        key={index}
                        className={`${font.fs_12} ${font.fw_5} ${styles.tagItem}`}
                      >
                        #{item}
                      </p>
                    ))}
                  </div>
                  <div className={styles.funcBox}>
                    <div className={styles.leftBox}>
                      <p
                        className={`${font.fs_12} ${font.fw_5} ${font.fc_sub_light}`}
                      >
                        UP {item.postUps}
                      </p>
                    </div>
                    <div className={styles.rightBox}>
                      <p
                        className={`${font.fs_12} ${font.fw_5} ${font.fc_sub_light}`}
                      >
                        {convertTimestamp(
                          currentTime.seconds,
                          item.createdAt.seconds
                        )}
                      </p>
                      <p
                        className={`${font.fs_12} ${font.fw_5} ${font.fc_sub_light}`}
                      >
                        조회 {item.postViews}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {modalState && (
          <MainPQModal setModalState={setModalState} modalType="QnAs" />
        )}
      </div>
    )
  );
};

export default MainQnA;
