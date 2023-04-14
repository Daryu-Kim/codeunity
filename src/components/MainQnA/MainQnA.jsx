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
import { GrNext, GrPrevious } from "react-icons/gr";

const MainQnA = () => {
  const uid = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기
  const currentTime = Timestamp.fromDate(new Date()); // 현재 시간 가져오기

  const navigate = useNavigate(); // react-router-dom의 useNavigate hook 사용
  const [posts, setPosts] = useState([]); // 게시물 상태와 상태 업데이트 함수 정의
  const [modalState, setModalState] = useState(false); // 모달 상태와 상태 업데이트 함수 정의
  const [modalPostState, setModalPostState] = useState(false); // 모달 게시물 상태와 상태 업데이트 함수 정의
  const [modalPostID, setModalPostID] = useState(""); // 모달 게시물 ID 상태와 상태 업데이트 함수 정의
  const [modalUserID, setModalUserID] = useState(""); // 모달 사용자 ID 상태와 상태 업데이트 함수 정의
  const [htmlWidth, setHtmlWidth] = useState(0); // HTML 너비 상태와 상태 업데이트 함수 정의
  const [qnaData, setQnAData] = useState([]); // QnA 데이터 상태와 상태 업데이트 함수 정의
  const [recommendQnAData, setRecommendQnAData] = useState([]); // 추천 QnA 데이터 상태와 상태 업데이트 함수 정의

  const [myData, myDataLoad, myDataError] = useDocumentData(
    // Firestore에서 현재 사용자 데이터 가져오기
    doc(firestore, "Users", uid)
  );
  const [recommendQnA, recommendQnALoad, recommendQnAError] = useCollectionData(
    // Firestore에서 추천 QnA 데이터 가져오기
    query(
      collection(firestore, "QnAs"),
      orderBy("postViews", "desc"), // postViews 필드를 기준으로 내림차순 정렬
      limit(10) // 10개의 데이터만 가져오기
    )
  );
  const [qnaPost, qnaPostLoad, qnaPostError] = useCollectionData(
    // Firestore에서 QnA 게시물 데이터 가져오기
    query(collection(firestore, "QnAs"), orderBy("createdAt", "desc")) // createdAt 필드를 기준으로 내림차순 정렬
  );

  const swiperRef = useRef(null); // Swiper 컴포넌트의 ref 생성

  const handlePrev = useCallback(() => {
    // 이전 슬라이드로 이동하는 함수 생성
    if (!swiperRef.current.swiper.slidePrev()); // Swiper 컴포넌트의 이전 슬라이드로 이동하는 함수 호출
  }, []);

  const handleNext = useCallback(() => {
    // 다음 슬라이드로 이동하는 함수 생성
    if (!swiperRef.current.swiper.slideNext()); // Swiper 컴포넌트의 다음 슬라이드로 이동하는 함수 호출
  }, []);

  // 윈도우 창 크기가 변경될 때마다 handleResize 함수를 실행하는 이벤트 리스너를 추가합니다.
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // 컴포넌트가 언마운트될 때, 이벤트 리스너를 제거합니다.
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // qnaPost가 변경될 때마다 실행되는 useEffect
    if (qnaPost) {
      setQnAData((prevQnAData) =>
        // qnaPost의 각 item을 prevQnAData의 index에 할당하여 새로운 배열을 만듦
        qnaPost.map((item, index) => (prevQnAData[index] = item))
      );
    }
  }, [qnaPost]);

  useEffect(() => {
    // recommendQnA가 변경될 때마다 실행
    if (recommendQnA) {
      // recommendQnA가 존재하면 recommendQnAData를 업데이트
      setRecommendQnAData(recommendQnA);
    }
  }, [recommendQnA]);

  const handleResize = () => setHtmlWidth(window.innerWidth); // handleResize 함수 선언, 윈도우 창의 너비를 htmlWidth 상태값으로 설정

  // 유저 프로필 클릭 시 실행되는 함수
  const profileClick = (userID) => {
    // sessionStorage에 userID를 저장
    sessionStorage.tempState = userID;
    // "/profile" 경로로 이동하며, state에 userID를 전달하고, 이전 페이지를 대체함
    navigate("/profile", { state: userID, replace: true });
  };

  const showModal = (postID, userID) => {
    // postID와 userID를 모달 상태에 저장
    setModalPostID(postID);
    setModalUserID(userID);
    // 모달 상태를 true로 변경하여 모달을 열도록 함
    setModalState(true);
  };

  const showPostModal = (postID, userID) => {
    // postID와 userID를 받아와서 각각의 state를 업데이트한다.
    setModalPostID(postID);
    setModalUserID(userID);
    // modalPostState를 true로 변경하여 모달을 보여준다.
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
