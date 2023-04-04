import { useEffect, useState } from "react";
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { getAuth } from "@firebase/auth";
import { AiOutlineLike, AiOutlineComment, AiOutlineShareAlt, AiFillLike } from "react-icons/ai"
import { RiRestartLine } from "react-icons/ri"
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  getDoc,
  addDoc,
  Timestamp,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";
import MainPQModal from "../MainPQModal/MainPQModal";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { toast, ToastContainer } from "react-toastify";
import { toastClear, toastError, toastLoading, toastSuccess } from "../../modules/Functions";

const MainHome = () => {
  const firestore = getFirestore(); // Firestore 인스턴스 생성
  const uid = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기
  const [document, loading, error, snapshot] = useDocumentData(
    // Firestore에서 문서 데이터 가져오기
    doc(firestore, "Users", uid)
  );
  const handleResize = () => {
    // 창 크기 조절 이벤트 핸들러
    setHtmlWidth(window.innerWidth); // 현재 창 너비 상태 업데이트
  };
  const [userName, setUserName] = useState(null); // 유저 이름 상태 변수
  const [htmlWidth, setHtmlWidth] = useState(0); // 창 너비 상태 변수
  const [postData, setPostData] = useState(null); // 포스트 데이터 상태 변수
  const [popularData, setPopularData] = useState(null); // 인기 데이터 상태 변수
  const [modalState, setModalState] = useState(false); // 모달 상태 변수
  const navigate = useNavigate(); // React Router의 navigate 함수

  useEffect(() => {
    // 문서 데이터가 업데이트될 때마다 유저 이름 상태 업데이트
    if (document) {
      setUserName(document.userName);
    }
  }, [document]);

  useEffect(() => {
    // 창 크기 조절 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [popularUser, popularUserLoad, popularUserError] = useCollectionData(
    // 인기 유저 데이터 가져오기
    query(
      collection(firestore, "Users"),
      orderBy("followerCount", "desc"), // 팔로워 수 기준으로 내림차순 정렬
      limit(10) // 상위 10개만 가져오기
    )
  );

  const [allPost, allPostLoad, allPostError] = useCollectionData(
    // 모든 포스트 데이터 가져오기
    query(collection(firestore, "Posts"), orderBy("createdAt", "desc")) // 생성일 기준으로 내림차순 정렬
  );

  const [postUserName, setPostUserName] = useState([]); // 포스트 작성자 이름 상태 변수
  const [postUserImg, setPostUserImg] = useState([]); // 포스트 작성자 이미지 상태 변수
  const [postUserFollower, setPostUserFollower] = useState([]); // 포스트 작성자 팔로워 상태 변수
  const [postLike, setPostLike] = useState([]);
  const [postLikeCount, setPostLikeCount] = useState([]);
  const [existsUserData, setExistsUserData] = useState(false); // 포스트 작성자 데이터 존재 여부 상태 변수
  const [existsUserFollowerData, setExistsUserFollowerData] = useState(false); // 포스트 작성자 팔로워 데이터 존재 여부 상태 변수
  const [existsPostLikeData, setExistsPostLikeData] = useState(false); // 포스트 작성자 팔로워 데이터 존재 여부 상태 변수
  const [existsPostLikeCountData, setExistsPostLikeCountData] = useState(false); // 포스트 작성자 팔로워 데이터 존재 여부 상태 변수

  // |이 코드는 popularUser 배열을 순회하며 SwiperSlide를 생성하는 useEffect 함수입니다.
  // |
  // |좋은 점:
  // |- popularUser가 변경될 때마다 실행되므로 항상 최신 데이터를 보여줍니다.
  // |- popularUser가 undefined일 경우 실행되지 않으므로 오류를 방지합니다.
  // |- SwiperSlide를 생성하는 코드가 간결하고 가독성이 좋습니다.
  // |- userImg와 userDesc가 없는 경우에 대한 처리가 되어 있어 안정적입니다.
  // |
  // |나쁜 점:
  // |- SwiperSlide를 생성하는 코드가 JSX 형태로 작성되어 있어 가독성이 떨어집니다. 이를 함수 형태로 분리하면 가독성을 높일 수 있습니다.

  useEffect(() => {
    if (popularUser !== undefined) {
      // popularUser가 정의되어 있으면 실행
      setPopularData(
        // popularData를 설정
        popularUser.map(
          (
            item // popularUser를 순회하며 SwiperSlide를 생성
          ) => (
            <SwiperSlide
              id={styles.popularItem}
              key={item.userID}
              onClick={() => profileClick(item.userID)} // 클릭 시 profileClick 함수 실행
            >
              <div
                className={styles.profileImg}
                style={{
                  backgroundImage: `url(${
                    item.userImg !== "" ? item.userImg : baseImg // userImg가 있으면 userImg, 없으면 baseImg 사용
                  })`,
                }}
              ></div>
              <p className={`${styles.profileName} ${font.fs_16} ${font.fw_5}`}>
                {item.userName}
                {/* userName 출력 */}
              </p>
              <p
                className={`${styles.profileDesc} ${font.fs_12} ${font.fw_4} ${font.fc_sub}`}
              >
                {item.userDesc ? item.userDesc : `자기소개가 없습니다!`}
                {/* userDesc가 있으면 userDesc, 없으면 '자기소개가 없습니다!' 출력 */}
              </p>
              <button
                className={`${styles.followBtn} ${font.fs_14} ${font.fw_7}`}
              >
                팔로우
                {/* '팔로우' 버튼 출력 */}
              </button>
            </SwiperSlide>
          )
        )
      );
    }
  }, [popularUser]); // popularUser가 변경될 때마다 실행

  // |이 코드는 React의 useEffect 훅을 사용하여 Firebase Firestore에서 데이터를 가져와 상태를 업데이트하는 기능을 구현한 코드입니다.
  // |
  // |좋은 점:
  // |- Promise.all을 사용하여 비동기 처리를 하고 있어서, 모든 데이터를 가져올 때까지 기다리지 않고 한 번에 처리할 수 있습니다.
  // |- 코드의 가독성이 좋습니다. 변수명이 명확하고, 주석이 잘 달려 있어서 코드를 이해하기 쉽습니다.
  // |
  // |나쁜 점:
  // |- fetchData 함수 내에서 setState 함수를 사용하고 있습니다. 이는 비동기 처리가 완료되기 전에 상태를 업데이트할 수 있기 때문에, 예기치 않은 결과를 초래할 수 있습니다. 이를 해결하기 위해서는, fetchData 함수 내에서 상태를 업데이트하는 대신, Promise.all의 결과를 반환하고, useEffect에서 해당 결과를 받아서 상태를 업데이트해야 합니다.
  // |- fetchData 함수 내에서 try-catch 문이 없습니다. 이는 데이터를 가져오는 과정에서 예외가 발생할 경우, 애플리케이션이 크래시될 수 있습니다. 이를 해결하기 위해서는, fetchData 함수 내에서 try-catch 문을 사용하여 예외 처리를 해야 합니다.

  useEffect(() => {
    if (allPost) {
      const arrPostUserName = [...postUserName]; // postUserName 배열 복사
      const arrPostUserImg = [...postUserImg]; // postUserImg 배열 복사
      const arrPostUserFollower = [...postUserFollower]; // postUserFollower 배열 복사
      const arrPostLike = [...postLike];
      const arrPostLikeCount = [...postLikeCount];
      async function fetchData() {
        // 비동기 함수 fetchData 선언
        await Promise.all(
          // Promise.all로 비동기 처리
          allPost.map(async (item, index) => {
            // allPost 배열의 모든 요소에 대해 비동기 처리
            const result = await getDoc(doc(firestore, "Users", item.userID)); // firestore에서 해당 유저 정보 가져오기
            arrPostUserName[index] = result.data().userName; // 해당 유저의 userName을 arrPostUserName 배열에 저장
            arrPostUserImg[index] = result.data().userImg; // 해당 유저의 userImg를 arrPostUserImg 배열에 저장
            setExistsUserData(true); // existsUserData 상태를 true로 변경
            const followerResult = await getDoc(
              doc(firestore, `Follows/${item.userID}/Followers`, uid)
            ); // 해당 유저의 팔로워 정보 가져오기
            arrPostUserFollower[index] = !!followerResult.data(); // 해당 유저를 팔로우하고 있는지 여부를 arrPostUserFollower 배열에 저장
            setExistsUserFollowerData(true); // existsUserFollowerData 상태를 true로 변경
            const likeResult = await getDoc(
              doc(firestore, `Posts/${item.postID}/Likes`, uid)
            );
            arrPostLike[index] = !!likeResult.data();
            setExistsPostLikeData(true);
            const likeCountResult = await getDoc(
              doc(firestore, "Posts", item.postID)
            );
            arrPostLikeCount[index] = likeCountResult.data().likeCount;
            setExistsPostLikeCountData(true);
          })
        );
      }
      fetchData(); // fetchData 함수 실행

      setPostUserName(arrPostUserName); // postUserName 상태를 arrPostUserName으로 변경
      setPostUserImg(arrPostUserImg); // postUserImg 상태를 arrPostUserImg로 변경
      setPostUserFollower(arrPostUserFollower); // postUserFollower 상태를 arrPostUserFollower로 변경
      setPostLike(arrPostLike); // postUserFollower 상태를 arrPostUserFollower로 변경
      setPostLikeCount(arrPostLikeCount);
    }
  }, [allPost]); // allPost가 변경될 때마다 useEffect 실행

  useEffect(() => {
    if (allPost && existsUserData && existsUserFollowerData && existsPostLikeData && existsPostLikeCountData) {
      setPostData(
        allPost.map((item, index) => {
          return (
            <div className={styles.postItem} key={item.postID}>
              <div className={styles.topBox}>
                <div className={styles.topLeftBox} onClick={() => profileClick(item.userID)}>
                  <div
                    className={styles.profileImg}
                    style={
                      postUserImg[index] != ""
                        ? { backgroundImage: `url(${postUserImg[index]})` }
                        : { backgroundImage: `url(${baseImg})` }
                    }
                  ></div>
                  <p
                    className={`
                    ${styles.profileName}
                    ${font.fs_16}
                    ${font.fw_5}
                  `}
                  >
                    {postUserName[index] ? postUserName[index] : "undefined"}
                  </p>
                </div>
                {item.userID == uid ? (
                  postUserFollower[index] ? null : null
                ) : (
                  <div className={styles.topRightBox}>
                    <button className={`
                    ${styles.followBtn}
                    ${font.fs_12}
                    ${font.fw_5}
                    `}>팔로우</button>
                  </div>
                )}
              </div>
              <div className={styles.postBox}>
                <MarkdownPreview
                  className={styles.postContent}
                  source={item.postContent}
                  style={
                    {padding: 12}
                  }
                />
              </div>
              <p className={`${font.fs_12} ${font.fw_7} ${font.fc_accent}`}>
                {postLikeCount[index]}명이 좋아합니다!
              </p>
              <div className={styles.postFuncBox}>
                {
                  !postLike[index]
                  ? <AiOutlineLike onClick={() => likeClick(item.postID, index, item.likeCount)} />
                  : <AiFillLike onClick={() => dislikeClick(item.postID, index, item.likeCount)} />
                }
                <RiRestartLine onClick={() => rePostClick(item.postContent)} />
                <AiOutlineComment onClick={commentClick} />
                <AiOutlineShareAlt onClick={() => shareClick(item)} />
              </div>
            </div>
          );
        })
      );
    }
  }, [allPost, existsUserData, existsUserFollowerData, existsPostLikeData, postLike, existsPostLikeCountData, postLikeCount]);

  
  const likeClick = async (postID, index, count) => {
    await setDoc(
      doc(firestore, `Posts/${postID}/Likes`, uid),
      {
        userID: uid,
      }
    ).then(async (result) => {
      await updateDoc(
        doc(firestore, "Posts", postID),
        {
          likeCount: ++count,
        }
      ).then((result) => {
        const tempLike = [...postLike];
        const tempLikeCount = [...postLikeCount];
        tempLike[index] = true;
        tempLikeCount[index] = count;
        setPostLike(tempLike);
        setPostLikeCount(tempLikeCount);
        toastSuccess("좋아요를 눌렀습니다!");
      }).catch((err) => {
        toastError("좋아요에 실패하였습니다!");
      });
    }).catch((err) => {
      toastError("좋아요에 실패하였습니다!");
    });
  };

  
  const dislikeClick = async (postID, index, count) => {
    await deleteDoc(
      doc(firestore, `Posts/${postID}/Likes`, uid)
    ).then(async (result) => {
      await updateDoc(
        doc(firestore, "Posts", postID),
        {
          likeCount: --count,
        }
      ).then((result) => {
        const tempLike = [...postLike];
        const tempLikeCount = [...postLikeCount];
        tempLike[index] = false;
        tempLikeCount[index] = count;
        setPostLike(tempLike);
        setPostLikeCount(tempLikeCount);
        toastSuccess("좋아요를 취소했습니다!");
      }).catch((err) => {
        toastError("좋아요를 취소하지 못했습니다!");
      });
    }).catch((err) => {
      toastError("좋아요를 취소하지 못했습니다!");
    });
  };

  
  const rePostClick = async (content) => {
    toastLoading("게시물을 리포스트 중입니다!");
    await addDoc(collection(firestore, "Posts"), {
      userID: uid,
      createdAt: Timestamp.fromDate(new Date()),
      postContent: content,
    }).then(async (result) => {
      await updateDoc(doc(firestore, "Posts", result.id), {
        postID: result.id,
      }).then(() => {
        toastClear();
        toastSuccess("성공적으로 리포스트 했습니다!");
      }).catch(() => {
        toastClear();
        toastError("리포스트 하지 못했습니다!");
      });
    });
  };

  
  const commentClick = () => {
    console.log("Comment");
  };

  
  const shareClick = (item) => {
    navigator.share({
      title: item.title,
      text: item.postContent,
      url: "",
      files: [],
    }).then((result) => {
      toastSuccess("성공적으로 공유했습니다!")
    }).catch((err) => {
      toastError("공유하지 못했습니다!")
    });
  };


  // |이 코드는 profileClick 함수를 선언하고, 해당 함수가 실행될 때 "/profile" 경로로 이동하며, state에 userID를 전달하고, replace 옵션을 true로 설정하여 브라우저 히스토리를 변경하지 않는 기능을 수행합니다.
  // |
  // |좋은 점:
  // |- 함수명이 해당 함수의 기능을 명확하게 설명하고 있습니다.
  // |- 매개변수와 옵션 등의 변수명이 명확하게 지정되어 있어 코드의 가독성이 높습니다.
  // |- navigate 함수를 사용하여 브라우저의 히스토리를 변경하지 않는 옵션을 설정하여, 사용자 경험을 개선하고 있습니다.
  // |
  // |나쁜 점:
  // |- 코드의 전체적인 구조나 목적에 대한 설명이 없어, 코드를 이해하는 데 어려움이 있을 수 있습니다.
  // |- navigate 함수의 사용 방법이나 옵션에 대한 설명이 없어, 해당 함수를 처음 사용하는 개발자들은 이해하는 데 어려움이 있을 수 있습니다.

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => navigate("/profile", { state: userID, replace: true }); // "/profile" 경로로 이동하며, state에 userID를 전달하고, replace 옵션을 true로 설정하여 브라우저 히스토리를 변경하지 않음


  // |이 코드는 showModal 함수를 정의하는 코드입니다.
  // |
  // |좋은 점:
  // |- 함수 이름이 명확하게 표현되어 있어, 함수의 역할을 쉽게 이해할 수 있습니다.
  // |- 코드가 간결하고 읽기 쉽습니다.
  // |
  // |나쁜 점:
  // |- 함수 내부에서 setModalState 함수를 호출하는데, 이 함수가 어디서 정의되었는지 알 수 없습니다. 따라서 코드 전체를 보고 setModalState 함수가 어떻게 정의되었는지 파악해야 합니다.

  // showModal 함수 정의
  const showModal = () => setModalState(true); // modalState를 true로 변경하여 모달을 보여줌

  
  // |이 코드는 React 컴포넌트를 반환하는 함수입니다.
  // |
  // |좋은 점:
  // |- React 컴포넌트를 반환하는 함수이므로, 코드의 가독성이 높아집니다.
  // |- JSX를 사용하여 HTML과 JavaScript를 함께 작성할 수 있습니다.
  // |- 조건문을 사용하여 `modalState`가 `true`일 때만 `MainPQModal` 컴포넌트를 렌더링합니다.
  // |- `popularData`와 `postData`를 출력하는 부분이 있어서, 데이터를 동적으로 렌더링할 수 있습니다.
  // |
  // |나쁜 점:
  // |- `document` 객체가 `true`인 경우에만 컴포넌트를 렌더링하므로, `document` 객체가 없는 경우에는 오류가 발생할 수 있습니다.
  // |- `onClick` 핸들러 함수가 중복되어 사용되는 부분이 있습니다. 이를 하나의 함수로 만들어서 중복을 제거할 수 있습니다.
  // |- `styles` 객체를 사용하여 CSS 스타일을 정의하고 있지만, 이를 모듈화하지 않았기 때문에 다른 컴포넌트에서도 사용할 수 있습니다. 이를 방지하기 위해서는 CSS 모듈을 사용하거나, 스타일드 컴포넌트를 사용하는 것이 좋습니다.

  if (document) {
    return (
      <div className={styles.wrapper}>
        <ToastContainer position="top-right" autoClose={2000} />
        {modalState && <MainPQModal setModalState={setModalState} />}
        <div className={styles.box}>
          <div className={`${styles.writePostBtn}`}>
            <div className={styles.writePostTopBox}>
              <div
                className={styles.writePostTopImg}
                onClick={() => profileClick(uid)}
                style={
                  document.userImg
                    ? { backgroundImage: `url(${document.userImg})` }
                    : { backgroundImage: `url(${baseImg})` }
                }
              ></div>
              <div className={styles.writePostTopInputBox} onClick={showModal}>
                <p
                  className={`${font.fs_14} ${font.fc_sub_light} ${styles.writePostTopName}`}
                >
                  {htmlWidth > 767
                    ? `${userName}님, 무슨 생각중인가요?`
                    : `글쓰기..`}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.popularBox}>
            <p className={`${font.fs_18} ${font.fw_7}`}>
              인기 프로필을 팔로우해보세요!{" "}
              {/* 인기 프로필을 팔로우해보세요! 라는 문구 출력 */}
            </p>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={8}
              freeMode={true}
              modules={[FreeMode]}
              id={styles.popularSwiper}
            >
              {popularData} {/* 인기 프로필 데이터 출력 */}
            </Swiper>
          </div>
          <div className={styles.postBox}>{postData}</div>{" "}
          {/* 게시글 데이터 출력 */}
        </div>
      </div>
    );
  }
};

export default MainHome;
