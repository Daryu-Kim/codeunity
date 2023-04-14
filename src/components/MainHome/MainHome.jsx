import { useEffect, useRef, useState } from "react";
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiFillLike,
} from "react-icons/ai";
import { RiRestartLine } from "react-icons/ri";
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
import { ToastContainer } from "react-toastify";
import {
  convertTimestamp,
  toastClear,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../modules/Functions";
import { followUser, unfollowUser } from "../../modules/Firebase";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";
import { BsFillTrashFill } from "react-icons/bs";

// const MainHome = () => {
function MainHome() {
  const currentTime = Timestamp.fromDate(new Date()); // 현재 시간을 Timestamp 형태로 저장
  const firestore = getFirestore(); // Firestore 인스턴스 생성
  const uid = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기

  const [userName, setUserName] = useState(null); // userName 상태 변수와 setter 함수 생성
  const [htmlWidth, setHtmlWidth] = useState(0); // htmlWidth 상태 변수와 setter 함수 생성
  const [postData, setPostData] = useState(null); // postData 상태 변수와 setter 함수 생성
  const [popularData, setPopularData] = useState(null); // popularData 상태 변수와 setter 함수 생성
  const [modalState, setModalState] = useState(false); // modalState 상태 변수와 setter 함수 생성, 초기값은 false
  const navigate = useNavigate(); // useNavigate hook을 이용해 navigate 함수 생성
  const [cmtModalState, setCmtModalState] = useState(false); // cmtModalState 상태 변수와 setter 함수 생성, 초기값은 false
  const [cmtModalPostID, setCmtModalPostID] = useState(""); // cmtModalPostID 상태 변수와 setter 함수 생성, 초기값은 빈 문자열
  const [cmtModalUserID, setCmtModalUserID] = useState(""); // cmtModalUserID 상태 변수와 setter 함수 생성, 초기값은 빈 문자열

  const [postUserName, setPostUserName] = useState([]); // postUserName 상태 변수와 setter 함수 생성, 초기값은 빈 배열
  const [postUserImg, setPostUserImg] = useState([]); // postUserImg 상태 변수와 setter 함수 생성, 초기값은 빈 배열
  const [postUserFollower, setPostUserFollower] = useState([]); // postUserFollower 상태 변수와 setter 함수 생성, 초기값은 빈 배열
  const [postLike, setPostLike] = useState([]); // postLike 상태 변수와 setter 함수 생성, 초기값은 빈 배열
  const [postLikeCount, setPostLikeCount] = useState([]); // postLikeCount 상태 변수와 setter 함수 생성, 초기값은 빈 배열
  const [existsUserData, setExistsUserData] = useState(false); // existsUserData 상태 변수와 setter 함수 생성, 초기값은 false
  const [existsUserFollowerData, setExistsUserFollowerData] = useState(false); // existsUserFollowerData 상태 변수와 setter 함수 생성, 초기값은 false
  const [existsPostLikeData, setExistsPostLikeData] = useState(false); // existsPostLikeData 상태 변수와 setter 함수 생성, 초기값은 false
  const [scrollTop, setScrollTop] = useState(0); // scrollTop 상태 변수와 setter 함수 생성, 초기값은 0
  const scrollContainerRef = useRef(null); // scrollContainerRef 변수 생성, 초기값은 null

  // Firestore에서 현재 사용자의 문서를 가져옴
  const [document, loading, error, snapshot] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  // followerCount가 높은 상위 10명의 사용자를 가져옴
  const [popularUser, popularUserLoad, popularUserError] = useCollectionData(
    query(
      collection(firestore, "Users"), // 'Users' 컬렉션에서
      orderBy("followerCount", "desc"), // 'followerCount' 필드를 기준으로 내림차순 정렬
      limit(10) // 상위 10개의 문서만 가져옴
    )
  );
  // 현재 사용자가 팔로우하는 사용자 목록을 가져옴
  const [myFollowing, myFollowingLoad, myFollowingError] = useCollectionData(
    collection(firestore, `Follows/${uid}/Following`) // 'Follows/{uid}/Following' 경로에서 문서들을 가져옴
  );
  // 모든 게시물을 최신순으로 가져옴
  const [allPost, allPostLoad, allPostError] = useCollectionData(
    query(collection(firestore, "Posts"), orderBy("createdAt", "desc")) // 'Posts' 컬렉션에서 'createdAt' 필드를 기준으로 내림차순 정렬하여 모든 문서들을 가져옴
  );

  useEffect(() => {
    // useEffect Hook을 사용하여 컴포넌트가 렌더링된 후 실행되는 함수를 정의합니다.
    if (document) setUserName(document.userName); // document 객체가 존재하면, document.userName 값을 setUserName 함수를 사용하여 업데이트합니다.
  }, [document]); // document 객체가 업데이트될 때마다 useEffect Hook이 실행됩니다.

  // 윈도우 창 크기가 변경될 때마다 handleResize 함수를 실행하는 이벤트 리스너를 추가합니다.
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // 컴포넌트가 언마운트될 때, 이벤트 리스너를 제거합니다.
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (popularUser !== undefined) {
      // popularUser가 정의되어 있으면 실행
      setPopularData(
        // setPopularData로 popularData를 업데이트
        popularUser.map(
          (
            item,
            index // popularUser를 순회하며 SwiperSlide 컴포넌트를 생성
          ) => (
            <SwiperSlide id={styles.popularItem} key={index}>
              <div
                className={styles.profileImg}
                style={{
                  backgroundImage: `url(${
                    item.userImg !== "" ? item.userImg : baseImg
                  })`,
                }}
              ></div>
              <p className={`${styles.profileName} ${font.fs_16} ${font.fw_5}`}>
                {item.userName}
              </p>
              <p
                className={`${styles.profileDesc} ${font.fs_12} ${font.fw_4} ${font.fc_sub}`}
              >
                {item.userDesc ? item.userDesc : `자기소개가 없습니다!`}
              </p>
              <button
                className={`${styles.followBtn} ${font.fs_14} ${font.fw_7}`}
                onClick={() => profileClick(item.userID)}
              >
                프로필 보기
              </button>
            </SwiperSlide>
          )
        )
      );
    }
  }, [popularUser]); // popularUser가 업데이트될 때마다 useEffect 실행

  useEffect(() => {
    if (allPost) {
      const fetchData = async () => {
        const promises = allPost.map(async (item, index) => {
          const [result, followerResult, likeResult] = await Promise.all([
            getDoc(doc(firestore, "Users", item.userID)), // item.userID에 해당하는 사용자 정보 가져오기
            getDoc(doc(firestore, `Follows/${item.userID}/Followers`, uid)), // 현재 사용자(uid)가 item.userID를 팔로우하고 있는지 확인
            getDoc(doc(firestore, `Posts/${item.postID}/Likes`, uid)), // 현재 사용자(uid)가 item.postID에 좋아요를 눌렀는지 확인
          ]);
          return {
            userName: result.data().userName, // 사용자 이름
            userImg: result.data().userImg, // 사용자 프로필 이미지
            userFollower: !!followerResult.data(), // 현재 사용자(uid)가 item.userID를 팔로우하고 있는지 여부
            postLike: !!likeResult.data(), // 현재 사용자(uid)가 item.postID에 좋아요를 눌렀는지 여부
          };
        });
        const results = await Promise.all(promises);
        const { postUserName, postUserImg, postUserFollower, postLike } =
          results.reduce(
            (acc, curr, index) => {
              acc.postUserName[index] = curr.userName; // 각 포스트의 작성자 이름
              acc.postUserImg[index] = curr.userImg; // 각 포스트의 작성자 프로필 이미지
              acc.postUserFollower[index] = curr.userFollower; // 각 포스트의 작성자를 현재 사용자(uid)가 팔로우하고 있는지 여부
              acc.postLike[index] = curr.postLike; // 각 포스트에 현재 사용자(uid)가 좋아요를 눌렀는지 여부
              return acc;
            },
            {
              postUserName: Array(allPost.length).fill(), // 모든 포스트의 작성자 이름 배열
              postUserImg: Array(allPost.length).fill(), // 모든 포스트의 작성자 프로필 이미지 배열
              postUserFollower: Array(allPost.length).fill(), // 모든 포스트의 작성자를 현재 사용자(uid)가 팔로우하고 있는지 여부 배열
              postLike: Array(allPost.length).fill(), // 모든 포스트에 현재 사용자(uid)가 좋아요를 눌렀는지 여부 배열
            }
          );
        setPostUserName(postUserName); // 모든 포스트의 작성자 이름 배열을 상태로 저장
        setPostUserImg(postUserImg); // 모든 포스트의 작성자 프로필 이미지 배열을 상태로 저장
        setPostUserFollower(postUserFollower); // 모든 포스트의 작성자를 현재 사용자(uid)가 팔로우하고 있는지 여부 배열을 상태로 저장
        setPostLike(postLike); // 모든 포스트에 현재 사용자(uid)가 좋아요를 눌렀는지 여부 배열을 상태로 저장
        setExistsUserData(true); // 사용자 정보가 존재함을 나타내는 상태를 true로 변경
        setExistsUserFollowerData(true); // 사용자 팔로워 정보가 존재함을 나타내는 상태를 true로 변경
        setExistsPostLikeData(true); // 포스트 좋아요 정보가 존재함을 나타내는 상태를 true로 변경
      };
      fetchData(); // 데이터 가져오기 함수 실행
    }
  }, [allPost]); // allPost 상태가 변경될 때마다 실행

  useEffect(() => {
    if (
      allPost && // 모든 게시물 데이터가 존재하는 경우
      existsUserData && // 현재 사용자 데이터가 존재하는 경우
      existsUserFollowerData && // 현재 사용자의 팔로워 데이터가 존재하는 경우
      existsPostLikeData // 게시물 좋아요 데이터가 존재하는 경우
    ) {
      setPostData(
        // 게시물 데이터를 설정
        allPost.map(
          (
            item,
            index // 모든 게시물 데이터를 순회하며 게시물 아이템을 생성
          ) => (
            <div className={styles.postItem} key={index}>
              {/* 게시물 아이템 */}
              <div className={styles.topBox}>
                {/* 게시물 상단 영역 */}
                <div
                  className={styles.topLeftBox}
                  onClick={() => profileClick(item.userID)} // 프로필 클릭 시 프로필 페이지로 이동
                >
                  <div
                    className={styles.profileImg}
                    style={{
                      backgroundImage:
                        postUserImg[index] !== "" // 게시물 작성자 이미지가 존재하는 경우
                          ? `url(${postUserImg[index]})`
                          : `url(${baseImg})`, // 기본 이미지로 설정
                    }}
                  ></div>
                  <div className={styles.nameBox}>
                    <p
                      className={`${styles.profileName} ${font.fs_16} ${font.fw_5}`}
                    >
                      {postUserName[index] && postUserName[index]}
                      {/* 게시물 작성자 이름 */}
                    </p>
                    <p
                      className={`${font.fs_10} ${font.fw_5} ${font.fc_sub_light}`}
                    >
                      {convertTimestamp(
                        currentTime.seconds,
                        item.createdAt.seconds
                      )}
                    </p>
                  </div>
                </div>
                {item.userID === uid ? (
                  <BsFillTrashFill
                    className={styles.removeBtn}
                    onClick={() => removeClick("Posts", item.postID)}
                  />
                ) : (
                  // 게시물 작성자가 현재 사용자인 경우 팔로우 버튼을 표시하지 않음
                  <div className={styles.topRightBox}>
                    {myFollowing.find((temp) => temp.userID == item.userID) ==
                    undefined ? (
                      <button
                        className={`${styles.followBtn} ${font.fs_12} ${font.fw_5}`}
                        onClick={() => followClick(item.userID, index)}
                      >
                        팔로우
                      </button>
                    ) : (
                      <button
                        className={`${styles.unfollowBtn} ${font.fs_12} ${font.fw_5}`}
                        onClick={() => unfollowClick(item.userID, index)}
                      >
                        언팔로우
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.postBox}>
                {/* 게시물 내용 영역 */}
                <MarkdownPreview
                  className={styles.postContent}
                  source={item.postContent} // 게시물 내용
                  style={{ padding: 12 }}
                />
              </div>
              <p className={`${font.fs_12} ${font.fw_7} ${font.fc_accent}`}>
                {item.likeCount}명이 좋아합니다!
                {/* 게시물 좋아요 수 */}
              </p>
              <div className={styles.postFuncBox}>
                {/* 게시물 기능 영역 */}
                {!postLike[index] ? ( // 게시물 좋아요를 누르지 않은 경우
                  <AiOutlineLike
                    onClick={() =>
                      likeClick(item.postID, index, item.likeCount)
                    } // 좋아요 버튼 클릭 시 좋아요 추가
                  />
                ) : (
                  // 게시물 좋아요를 누른 경우
                  <AiFillLike
                    onClick={() =>
                      dislikeClick(item.postID, index, item.likeCount)
                    } // 좋아요 버튼 클릭 시 좋아요 취소
                  />
                )}
                <RiRestartLine onClick={() => rePostClick(item.postContent)} />
                {/* 리포스트 버튼 클릭 시 게시물 내용을 복사하여 새 게시물 작성 페이지로 이동 */}
                <AiOutlineComment
                  onClick={() => commentClick(item.postID, item.userID)}
                />
                {/* 댓글 버튼 클릭 시 댓글 작성 페이지로 이동 */}
                <AiOutlineShareAlt onClick={() => shareClick(item)} />
                {/* 공유 버튼 클릭 시 게시물 공유 */}
              </div>
            </div>
          )
        )
      );
    }
  }, [
    allPost, // 모든 게시물 데이터
    postUserName, // 게시물 작성자 이름 데이터
    existsUserData, // 현재 사용자 데이터
    existsUserFollowerData, // 현재 사용자의 팔로워 데이터
    existsPostLikeData, // 게시물 좋아요 데이터
    postLike, // 게시물 좋아요 여부 데이터
    postUserFollower,
  ]);

  // showModal 함수 정의
  const showModal = () => setModalState(true);

  // handleResize 함수 정의
  const handleResize = () => setHtmlWidth(window.innerWidth);

  const likeClick = async (postID, index, count) => {
    try {
      // Posts 컬렉션에서 해당 게시물의 Likes 서브컬렉션에 현재 사용자의 좋아요를 추가합니다.
      await setDoc(doc(firestore, `Posts/${postID}/Likes`, uid), {
        userID: uid,
      });
      // Posts 컬렉션에서 해당 게시물의 likeCount 필드를 1 증가시킵니다.
      await updateDoc(doc(firestore, "Posts", postID), { likeCount: ++count });
      // postLike 배열에서 해당 인덱스의 값을 true로 변경합니다.
      setPostLike([
        ...postLike.slice(0, index),
        true,
        ...postLike.slice(index + 1),
      ]);
      // postLikeCount 배열에서 해당 인덱스의 값을 count로 변경합니다.
      setPostLikeCount([
        ...postLikeCount.slice(0, index),
        count,
        ...postLikeCount.slice(index + 1),
      ]);
      // 성공적으로 좋아요를 눌렀다는 알림을 띄웁니다.
      toastSuccess("좋아요를 눌렀습니다!");
    } catch (err) {
      // 좋아요를 누르는데 실패했다는 알림을 띄웁니다.
      toastError("좋아요에 실패하였습니다!");
    }
  };

  const followClick = async (targetID, index) => {
    try {
      await followUser(targetID); // targetID를 팔로우하는 함수 호출
      setPostUserFollower((prevArr) => [
        // postUserFollower 배열을 업데이트
        ...prevArr.slice(0, index), // 이전 index까지의 요소들을 그대로 유지
        true, // index에 해당하는 요소를 true로 변경
        ...prevArr.slice(index + 1), // index 이후의 요소들을 그대로 유지
      ]);
      toastSuccess("팔로우를 완료하였습니다!"); // 팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  const unfollowClick = async (targetID, index) => {
    try {
      await unfollowUser(targetID); // targetID를 언팔로우하는 함수 호출
      setPostUserFollower((prevArr) => {
        // postUserFollower 배열을 업데이트
        const tempArr = [...prevArr]; // 이전 배열을 복사하여 새로운 배열 생성
        tempArr[index] = false; // 해당 인덱스의 값을 false로 변경
        return tempArr; // 새로운 배열 반환
      });
      toastSuccess("언팔로우를 완료하였습니다!"); // 언팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  const dislikeClick = async (postID, index, count) => {
    try {
      // 좋아요 취소
      await deleteDoc(doc(firestore, `Posts/${postID}/Likes`, uid));
      // 좋아요 수 업데이트
      await updateDoc(doc(firestore, "Posts", postID), { likeCount: --count });
      // 좋아요 상태 업데이트
      const tempLike = [...postLike];
      const tempLikeCount = [...postLikeCount];
      tempLike[index] = false;
      tempLikeCount[index] = count;
      setPostLike(tempLike);
      setPostLikeCount(tempLikeCount);
      // 성공 메시지 출력
      toastSuccess("좋아요를 취소했습니다!");
    } catch {
      // 실패 메시지 출력
      toastError("좋아요를 취소하지 못했습니다!");
    }
  };

  const rePostClick = async (content) => {
    toastLoading("게시물을 리포스트 중입니다!"); // 게시물 리포스트 중임을 알리는 로딩 토스트 메시지 출력
    try {
      const result = await addDoc(collection(firestore, "Posts"), {
        // firestore의 Posts collection에 새로운 document 추가
        userID: uid, // 현재 사용자의 uid를 userID 필드에 저장
        createdAt: Timestamp.fromDate(new Date()), // 현재 시간을 createdAt 필드에 저장
        postContent: content, // content를 postContent 필드에 저장
        likeCount: 0, // likeCount 필드를 0으로 초기화
      });
      await updateDoc(doc(firestore, "Posts", result.id), {
        // 방금 추가한 document의 postID 필드를 업데이트
        postID: result.id,
      });
      toastClear(); // 로딩 토스트 메시지 제거
      toastSuccess("성공적으로 리포스트 했습니다!"); // 성공적으로 리포스트 했음을 알리는 토스트 메시지 출력
    } catch (error) {
      toastClear(); // 로딩 토스트 메시지 제거
      toastError("리포스트 하지 못했습니다!"); // 리포스트 실패를 알리는 토스트 메시지 출력
    }
  };

  const commentClick = (postID, userID) => {
    // postID와 userID를 받아와서 각각의 state를 업데이트합니다.
    setCmtModalPostID(postID);
    setCmtModalUserID(userID);
    // 댓글 모달 상태를 true로 변경합니다.
    setCmtModalState(true);
  };

  const shareClick = async (item) => {
    try {
      // 공유 API 호출
      await navigator.share({
        title: item.title, // 제목 설정
        text: item.postContent, // 내용 설정
        url: "", // URL 설정
        files: [], // 파일 설정
      });
      // 공유 성공 토스트 메시지 출력
      toastSuccess("성공적으로 공유했습니다!");
    } catch (err) {
      // 공유 실패 토스트 메시지 출력
      toastError("공유하지 못했습니다!");
    }
  };

  const profileClick = (userID) => {
    // userID를 sessionStorage의 tempState에 저장
    sessionStorage.tempState = userID;
    // /profile 경로로 이동하며, state에 userID를 전달하고, 이전 페이지를 대체
    navigate("/profile", { state: userID, replace: true });
  };

  const handleScroll = () => setScrollTop(scrollContainerRef.current.scrollTop);

  const handleButtonClick = () => {
    // 버튼 클릭 이벤트 핸들러 함수
    const scrollToTop = () => {
      // 스크롤을 위로 올리는 함수
      const currentPosition = scrollContainerRef.current.scrollTop;
      // 현재 스크롤 위치를 저장
      if (currentPosition > 0) {
        // 현재 스크롤 위치가 0보다 크면
        requestAnimationFrame(() => {
          // 애니메이션 프레임 요청
          scrollContainerRef.current.scrollTop -= 120;
          // 스크롤을 120만큼 위로 이동
          scrollToTop();
          // 다시 scrollToTop 함수 호출
        });
      }
    };
    scrollToTop();
    // scrollToTop 함수 호출
    setScrollTop(0);
    // 스크롤 위치를 0으로 설정
  };

  const removeClick = async (modalType, postID) => {
    try {
      // 게시물 삭제 중임을 알리는 로딩 토스트 메시지 출력
      toastLoading("게시물을 삭제하는 중입니다!");
      // 해당 게시물 문서를 삭제
      await deleteDoc(doc(firestore, modalType, postID));
      // 로딩 토스트 메시지 제거
      toastClear();
      // 게시물 삭제 성공 메시지 출력
      toastSuccess("게시물을 삭제했습니다!");
      // 모달 상태를 닫음
      setModalState(false);
    } catch (err) {
      // 로딩 토스트 메시지 제거
      toastClear();
      // 게시물 삭제 실패 메시지 출력
      toastError("게시물을 삭제하지 못했습니다!");
    }
  };

  if (document) {
    return (
      <div
        className={styles.wrapper}
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {cmtModalState && (
          <div className={styles.mainCmtsModal}>
            <MainCmtsModal
              setModalState={setCmtModalState}
              modalPostID={cmtModalPostID}
              modalUserID={cmtModalUserID}
              modalType="Posts"
            />
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          bodyClassName={styles.toast}
        />
        {modalState && (
          <MainPQModal setModalState={setModalState} modalType="Posts" />
        )}
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
            </p>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={8}
              freeMode={true}
              modules={[FreeMode]}
              id={styles.popularSwiper}
            >
              {popularData}
            </Swiper>
          </div>
          <div className={styles.postBox}>{postData}</div>
        </div>
        {scrollTop > 300 && (
          <div
            className={`${styles.toTopBtn} ${font.fs_14}`}
            onClick={handleButtonClick}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
        )}
      </div>
    );
  }
}

export default MainHome;
