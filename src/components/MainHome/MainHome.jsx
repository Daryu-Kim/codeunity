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
  const [cmtModalState, setCmtModalState] = useState(false);
  const [cmtModalPostID, setCmtModalPostID] = useState("");
  const [cmtModalUserID, setCmtModalUserID] = useState("");

  const currentTime = Timestamp.fromDate(new Date());

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

  const [myFollowing, myFollowingLoad, myFollowingError] = useCollectionData(
    collection(firestore, `Follows/${uid}/Following`)
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
            item,
            index // popularUser를 순회하며 SwiperSlide를 생성
          ) => (
            <SwiperSlide id={styles.popularItem} key={index}>
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
                onClick={() => profileClick(item.userID)} // 클릭 시 profileClick 함수 실행
              >
                프로필 보기
                {/* '프로필 보기' 버튼 출력 */}
              </button>
            </SwiperSlide>
          )
        )
      );
    }
  }, [popularUser]); // popularUser가 변경될 때마다 실행

  // |이 코드는 React의 useEffect hook을 사용하여, allPost 배열의 각 요소에 대한 정보를 가져와 state를 업데이트하는 기능을 구현한 것입니다.
  // |
  // |좋은 점:
  // |- 비동기 처리를 위해 async/await를 사용하여 가독성이 좋습니다.
  // |- Promise.all을 사용하여 모든 비동기 작업이 완료될 때까지 대기하고, 결과값을 배열로 변환하여 한 번에 state를 업데이트합니다.
  // |- 코드가 간결하고, 중복되는 부분을 함수로 분리하여 재사용성을 높였습니다.
  // |
  // |나쁜 점:
  // |- allPost 배열이 변경될 때마다 fetchData 함수가 호출되므로, 불필요한 API 요청이 발생할 수 있습니다. 이를 방지하기 위해 useCallback hook을 사용하여 함수를 캐싱하고, 의존성 배열을 설정해주는 것이 좋습니다.
  // |- 결과값을 배열로 변환하는 과정에서, 배열의 길이를 allPost.length로 고정시켜놓았기 때문에, allPost 배열의 길이가 변경될 경우 에러가 발생할 수 있습니다. 이를 방지하기 위해, 결과값을 객체로 반환하고, state를 업데이트할 때도 객체의 속성을 참조하는 것이 좋습니다.

  useEffect(() => {
    if (allPost) {
      const fetchData = async () => {
        const promises = allPost.map(async (item, index) => {
          // 해당 게시물의 작성자 정보 가져오기
          const result = await getDoc(doc(firestore, "Users", item.userID));
          // 해당 게시물 작성자의 팔로워 정보 가져오기
          const followerResult = await getDoc(
            doc(firestore, `Follows/${item.userID}/Followers`, uid)
          );
          // 해당 게시물의 좋아요 정보 가져오기
          const likeResult = await getDoc(
            doc(firestore, `Posts/${item.postID}/Likes`, uid)
          );
          // 가져온 정보를 객체로 반환
          return {
            userName: result.data().userName,
            userImg: result.data().userImg,
            userFollower: !!followerResult.data(),
            postLike: !!likeResult.data(),
          };
        });
        // 모든 promises가 resolve될 때까지 대기
        const results = await Promise.all(promises);
        // 결과값을 배열로 변환
        const { postUserName, postUserImg, postUserFollower, postLike } =
          results.reduce(
            (acc, curr, index) => {
              // 배열에 결과값 할당
              acc.postUserName[index] = curr.userName;
              acc.postUserImg[index] = curr.userImg;
              acc.postUserFollower[index] = curr.userFollower;
              acc.postLike[index] = curr.postLike;
              return acc;
            },
            {
              // 배열 초기화
              postUserName: [...Array(allPost.length)],
              postUserImg: [...Array(allPost.length)],
              postUserFollower: [...Array(allPost.length)],
              postLike: [...Array(allPost.length)],
            }
          );
        // state 업데이트
        setPostUserName(postUserName);
        setPostUserImg(postUserImg);
        setPostUserFollower(postUserFollower);
        setPostLike(postLike);
        setExistsUserData(true);
        setExistsUserFollowerData(true);
        setExistsPostLikeData(true);
      };
      fetchData();
    }
  }, [allPost]);

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
                    <p className={`${font.fs_10} ${font.fw_5} ${font.fc_sub_light}`}>
                      {convertTimestamp(currentTime.seconds, item.createdAt.seconds)}
                    </p>
                  </div>
                  
                </div>
                {item.userID === uid
                ? (
                  <BsFillTrashFill
                    className={styles.removeBtn}
                    onClick={() => removeClick("Posts", item.postID)}
                  />
                  )
                : ( // 게시물 작성자가 현재 사용자인 경우 팔로우 버튼을 표시하지 않음
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
                <AiOutlineComment onClick={() => commentClick(item.postID, item.userID)} />
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

  // |이 코드는 게시물에 좋아요를 누르는 기능을 구현한 함수입니다.
  // |
  // |좋은 점:
  // |- `async/await`를 사용하여 비동기 처리를 깔끔하게 구현하였습니다.
  // |- `setDoc`와 `updateDoc` 함수를 사용하여 Firestore 데이터베이스에 데이터를 저장하고 업데이트하였습니다.
  // |- `tempLike`와 `tempLikeCount` 배열을 사용하여 불필요한 렌더링을 방지하고 성능을 개선하였습니다.
  // |- `toastSuccess`와 `toastError` 함수를 사용하여 사용자에게 알림 메시지를 띄워주어 UX를 개선하였습니다.
  // |
  // |아쉬운 점:
  // |- `++count`와 같은 전위 연산자를 사용하여 코드의 가독성을 떨어뜨릴 수 있습니다. 후위 연산자를 사용하거나 `count + 1`과 같이 명시적으로 표현하는 것이 좋습니다.
  // |- `catch` 블록에서 에러 메시지를 출력하는 것 외에 추가적인 처리를 하지 않았습니다. 에러 발생 시 사용자에게 더 자세한 정보를 제공하거나 로그를 남기는 등의 처리를 추가하는 것이 좋습니다.

  const likeClick = async (postID, index, count) => {
    try {
      // 좋아요를 누른 사용자의 정보를 Posts/{postID}/Likes/{uid} 경로에 저장
      await setDoc(doc(firestore, `Posts/${postID}/Likes`, uid), {
        userID: uid,
      });
      // Posts/{postID} 경로의 likeCount 필드를 1 증가시킴
      await updateDoc(doc(firestore, "Posts", postID), { likeCount: ++count });
      // postLike와 postLikeCount 배열을 복사하여 해당 index의 값을 변경하고 state를 업데이트함
      const tempLike = [...postLike];
      const tempLikeCount = [...postLikeCount];
      tempLike[index] = true;
      tempLikeCount[index] = count;
      setPostLike(tempLike);
      setPostLikeCount(tempLikeCount);
      // 성공적으로 좋아요를 눌렀다는 메시지를 띄움
      toastSuccess("좋아요를 눌렀습니다!");
    } catch (err) {
      // 좋아요를 누르는데 실패했다는 메시지를 띄움
      toastError("좋아요에 실패하였습니다!");
    }
  };

  // |이 코드는 targetID를 팔로우하는 함수를 호출하고, postUserFollower 배열의 index번째 요소를 true로 변경하는 함수입니다.
  // |
  // |좋은 점:
  // |- 비동기 함수인 followClick 함수가 try-catch 구문으로 에러 처리를 하고 있어 안정적입니다.
  // |- 배열을 복사하여 변경하는 것으로 인해, React의 불변성 원칙을 지키고 있습니다.
  // |- 팔로우 완료 메시지를 출력하여 사용자에게 적절한 피드백을 제공합니다.
  // |
  // |나쁜 점:
  // |- catch 구문에서 에러를 무시하고 있어, 어떤 에러가 발생했는지 파악하기 어렵습니다. 적절한 에러 처리를 추가하는 것이 좋습니다.

  const followClick = async (targetID, index) => {
    try {
      await followUser(targetID); // targetID를 팔로우하는 함수 호출
      const tempArr = [...postUserFollower]; // postUserFollower 배열을 복사하여 tempArr에 할당
      tempArr[index] = true; // tempArr의 index번째 요소를 true로 변경
      setPostUserFollower(tempArr); // 변경된 tempArr를 postUserFollower에 할당
      toastSuccess("팔로우를 완료하였습니다!"); // 팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  // |이 코드는 targetID를 언팔로우하는 함수를 호출하고, postUserFollower 배열에서 해당 targetID의 값을 false로 변경한 후, 변경된 배열로 업데이트하는 함수입니다. 또한, 언팔로우 완료 메시지를 출력합니다.
  // |
  // |좋은 점:
  // |- 비동기 함수인 unfollowClick 함수가 async/await를 사용하여 비동기 처리를 하고 있습니다.
  // |- 에러 처리를 try-catch문으로 감싸 에러 발생 시 무시하고 넘어가도록 구현하였습니다.
  // |- 변경된 postUserFollower 배열을 업데이트할 때, 기존 배열을 직접 수정하지 않고, 배열을 복사하여 수정한 후, setState 함수를 사용하여 업데이트하였습니다.
  // |
  // |나쁜 점:
  // |- 에러 발생 시 아무런 처리를 하지 않고 무시하고 있습니다. 에러 처리를 더욱 세밀하게 구현하여 예외 상황에 대처할 수 있도록 개선할 필요가 있습니다.

  const unfollowClick = async (targetID, index) => {
    try {
      await unfollowUser(targetID); // targetID를 언팔로우하는 함수 호출
      const tempArr = [...postUserFollower]; // postUserFollower 배열을 복사하여 tempArr에 할당
      tempArr[index] = false; // tempArr의 index번째 요소를 false로 변경
      setPostUserFollower(tempArr); // 변경된 tempArr로 postUserFollower 배열을 업데이트
      toastSuccess("언팔로우를 완료하였습니다!"); // 언팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  // |이 코드는 게시물에서 좋아요를 취소하는 함수입니다.
  // |
  // |좋은 점:
  // |- `async/await`를 사용하여 비동기 처리를 하고 있습니다.
  // |- `try/catch`를 사용하여 예외 처리를 하고 있습니다.
  // |- 좋아요를 삭제하고, 좋아요 수를 업데이트하고, 좋아요 상태를 업데이트하는 등 여러 작업을 하나의 함수에서 처리하고 있습니다.
  // |- `setPostLike`와 `setPostLikeCount`를 사용하여 상태를 업데이트하고 있습니다.
  // |
  // |나쁜 점:
  // |- `--count`를 사용하여 좋아요 수를 감소시키고 있습니다. 이는 코드의 가독성을 떨어뜨리고, 버그를 발생시킬 가능성이 있습니다. 대신 `count - 1`과 같이 변수를 새로 만들어 사용하는 것이 좋습니다.

  const dislikeClick = async (postID, index, count) => {
    try {
      // 좋아요 삭제
      await deleteDoc(doc(firestore, `Posts/${postID}/Likes`, uid));
      // 좋아요 수 업데이트
      await updateDoc(doc(firestore, "Posts", postID), {
        likeCount: --count,
      });
      // 좋아요 상태 업데이트
      const tempLike = [...postLike];
      const tempLikeCount = [...postLikeCount];
      tempLike[index] = false;
      tempLikeCount[index] = count;
      setPostLike(tempLike);
      setPostLikeCount(tempLikeCount);
      // 성공 메시지 출력
      toastSuccess("좋아요를 취소했습니다!");
    } catch (err) {
      // 실패 메시지 출력
      toastError("좋아요를 취소하지 못했습니다!");
    }
  };

  // |이 코드는 게시물을 리포스트하는 함수입니다.
  // |
  // |좋은 점:
  // |- `async/await`를 사용하여 비동기적인 작업을 처리하고 있습니다.
  // |- `try/catch`를 사용하여 예외 처리를 하고 있습니다.
  // |- `firestore`를 사용하여 데이터를 저장하고 있습니다.
  // |- `toast`를 사용하여 사용자에게 메시지를 보여주고 있습니다.
  // |
  // |나쁜 점:
  // |- 함수명이 `rePostClick`으로 되어 있는데, 클릭 이벤트와는 관련이 없습니다. 함수명을 변경하는 것이 좋을 것입니다.
  // |- `content` 매개변수가 어떤 형식인지 주석으로 설명이 없습니다. `content`가 어떤 데이터를 담고 있는지 명확하게 알 수 있도록 주석을 추가하는 것이 좋습니다.

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
        // 방금 추가한 document의 postID 필드를 해당 document의 id로 업데이트
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
    setCmtModalPostID(postID);
    setCmtModalUserID(userID)
    setCmtModalState(true);
  };

  // |이 코드는 `navigator.share()`를 사용하여 제목, 내용, URL 및 파일을 설정하여 공유 API를 호출하는 함수입니다.
  // |
  // |좋은 점:
  // |- `navigator.share()`를 사용하여 브라우저에서 제공하는 공유 기능을 쉽게 사용할 수 있습니다.
  // |- `async/await`를 사용하여 비동기 처리를 하고, `try/catch`를 사용하여 예외 처리를 하여 코드의 안정성을 높였습니다.
  // |- 공유 성공 및 실패 시 각각 다른 토스트 메시지를 출력하여 사용자에게 적절한 피드백을 제공합니다.
  // |
  // |나쁜 점:
  // |- `url`과 `files`가 빈 값으로 설정되어 있어, 이 부분을 적절한 값으로 설정해야 합니다.
  // |- `item` 객체의 속성들이 어떤 형식으로 정의되어 있는지에 대한 정보가 없으므로, 이 함수를 사용하는 곳에서 `item` 객체의 속성들을 적절하게 정의해야 합니다.

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
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
  }; // "/profile" 경로로 이동하며, state에 userID를 전달하고, replace 옵션을 true로 설정하여 브라우저 히스토리를 변경하지 않음

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

  //스클롤 이벤트
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const newScrollTop = scrollContainerRef.current.scrollTop;
    setScrollTop(newScrollTop);
  };

  const handleButtonClick = () => {
    const scrollToTop = () => {
      const currentPosition = scrollContainerRef.current.scrollTop;
      if (currentPosition > 0) {
        requestAnimationFrame(() => {
          scrollContainerRef.current.scrollTop = currentPosition - 120;
          scrollToTop();
        });
      }
    };
    scrollToTop();
    setScrollTop(0);
  };

  const removeClick = async (modalType, postID) => {
    toastLoading("게시물을 삭제하는 중입니다!");
    await deleteDoc(doc(firestore, modalType, postID))
    .then((result) => {
      toastClear();
      toastSuccess("게시물을 삭제했습니다!");
      setModalState(false);
    }).catch((err) => {
      toastClear();
      toastError("게시물을 삭제하지 못했습니다!");
    });
  }

  

  if (document) {
    return (
      <div
        className={styles.wrapper}
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >{cmtModalState && (
        <div className={styles.mainCmtsModal}>
          <MainCmtsModal
            setModalState={setCmtModalState}
            modalPostID={cmtModalPostID}
            modalUserID={cmtModalUserID}
            modalType="Posts"
          />
        </div>
      )}
        <ToastContainer position="top-right" autoClose={2000} bodyClassName={styles.toast} />
        {modalState && <MainPQModal setModalState={setModalState} modalType="Posts" />}
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
          <div className={styles.postBox}>{postData}</div>
          {/* 게시글 데이터 출력 */}
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
