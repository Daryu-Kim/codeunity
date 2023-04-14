import { useCallback, useEffect, useRef, useState } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./MainCmtsModal.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  convertTimestamp,
  toastClear,
  toastError,
  toastLoading,
  toastSuccess,
  zipImage,
} from "../../modules/Functions";
import {
  collection,
  doc,
  addDoc,
  Timestamp,
  updateDoc,
  getFirestore,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  AiFillLike,
  AiOutlineClose,
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { RiRestartLine } from "react-icons/ri";
import {
  BsFillTrashFill,
  BsFillCloudUploadFill,
  BsImageAlt,
  BsSendFill,
} from "react-icons/bs";
import MainPQModal from "../MainPQModal/MainPQModal";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Swiper, SwiperSlide } from "swiper/react";
import { storage, uploadImage } from "../../modules/Firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { GrNext, GrPrevious } from "react-icons/gr";

const MainCmtsModal = ({
  setModalState,
  modalPostID,
  modalUserID,
  modalType,
}) => {
  // 로컬 스토리지에서 uid 가져오기
  const uid = localStorage.getItem("uid");
  // 현재 시간 가져오기
  const currentTime = Timestamp.fromDate(new Date());
  // 파이어스토어 가져오기
  const firestore = getFirestore();

  // 마크다운 값과 상태 설정
  const [mdValue, setMDValue] = useState({});
  // 유저 정보와 상태 설정
  const [user, setUser] = useState({});
  // 댓글 정보와 상태 설정
  const [cmts, setCmts] = useState([]);
  // 포스트 좋아요와 상태 설정
  const [postLike, setPostLike] = useState(false);
  // 댓글 상태와 상태 설정
  const [cmtsState, setCmtsState] = useState(false);
  // 포스트 좋아요 수와 상태 설정
  const [postLikeCount, setPostLikeCount] = useState(0);
  // 댓글 유저와 상태 설정
  const [cmtUser, setCmtUser] = useState([]);
  // 포스트 댓글과 상태 설정
  const [postComment, setPostComment] = useState("");
  // 모달 레퍼런스 설정
  const modalRef = useRef(null);
  // 네비게이션 설정
  const navigate = useNavigate();

  // modalType, modalPostID, modalUserID는 이전 코드에서 정의된 변수로 가정합니다.

  // modalData는 modalType과 modalPostID에 해당하는 문서 데이터를 가져오는 hook입니다.
  const [modalData] = useDocumentData(doc(firestore, modalType, modalPostID));

  // userData는 modalUserID에 해당하는 사용자 데이터를 가져오는 hook입니다.
  const [userData] = useDocumentData(doc(firestore, "Users", modalUserID));

  // cmtData는 modalType과 modalPostID에 해당하는 댓글 데이터를 최신순으로 가져오는 hook입니다.
  const [cmtData] = useCollectionData(
    query(
      collection(firestore, `${modalType}/${modalPostID}/Cmts`),
      orderBy("createdAt", "desc")
    )
  );

  useEffect(() => {
    // 마우스 다운 이벤트 핸들러 함수 정의
    const handler = (e) => {
      // 모달 창이 열려있고, 클릭한 요소가 모달 창 안에 없으면 모달 창 닫기
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalState(false);
      }
    };

    // 마우스 다운 이벤트 리스너 등록
    document.addEventListener("mousedown", handler);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => document.removeEventListener("mousedown", handler);
  });

  useEffect(() => {
    if (cmtData) {
      // cmtData가 존재하는 경우
      const tempCmtUser = [...cmtData]; // cmtData를 복사하여 tempCmtUser에 할당
      cmtData.forEach(async (item, index) => {
        // cmtData를 순회하며 각각의 item과 index에 대해 비동기적으로 처리
        const tempUser = await getDoc(doc(firestore, "Users", item.userID)); // firestore에서 해당 item의 userID를 가진 문서를 가져와 tempUser에 할당
        tempCmtUser[index] = tempUser.data(); // tempUser에서 가져온 데이터를 tempCmtUser에 할당
      });
      setCmtUser(tempCmtUser); // tempCmtUser를 setCmtUser를 통해 업데이트
      console.log(cmtUser); // cmtUser를 출력
    }
  }, [cmtData, cmts]); // cmtData와 cmts가 변경될 때마다 useEffect 실행

  // modalUserID가 존재하면 userData를 setUser로 설정
  useEffect(() => {
    modalUserID && setUser(userData);
  }, [userData, modalUserID]);

  // modalPostID가 존재하면 modalData를 setMDValue로 설정
  useEffect(() => {
    modalPostID && setMDValue(modalData);
  }, [modalData, modalPostID]);

  // modalType이 "QnAs"이면 updatePostViews() 실행
  useEffect(() => {
    modalType === "QnAs" && updatePostViews();
  }, [modalType]);

  useEffect(() => {
    if (cmtData) {
      // 만약 cmtData가 존재한다면
      setCmts([...cmtData]); // cmtData를 복사하여 setCmts로 설정한다.
    }
  }, [cmtData]); // cmtData가 변경될 때마다 useEffect가 실행된다.

  const handlePrev = useCallback(
    () => !modalRef.current.swiper.slidePrev(), // modalRef의 swiper를 이용하여 이전 슬라이드로 이동하는 함수를 useCallback으로 선언
    []
  );
  const handleNext = useCallback(
    () => !modalRef.current.swiper.slideNext(), // modalRef의 swiper를 이용하여 다음 슬라이드로 이동하는 함수를 useCallback으로 선언
    []
  );

  // closeModal 함수 정의
  const closeModal = () => setModalState(false); // modalState를 false로 설정하여 모달을 닫음

  const updatePostViews = async () => {
    // modalType과 modalPostID를 이용하여 해당 게시물의 정보를 가져온다.
    const post = await getDoc(doc(firestore, modalType, modalPostID));
    // 가져온 게시물 정보의 postViews 값을 1 증가시킨다.
    await updateDoc(doc(firestore, modalType, modalPostID), {
      postViews: post.data().postViews + 1,
    });
  };

  const uploadClick = async () => {
    if (postComment.length > 0) {
      // 만약 postComment가 비어있지 않다면
      toastLoading(); // 로딩 토스트 메시지 출력
      try {
        const result = await addDoc(
          // Firestore에 데이터 추가
          collection(firestore, `${modalType}/${modalPostID}/Cmts`), // 해당 컬렉션에
          {
            userID: uid, // 유저 아이디
            createdAt: Timestamp.fromDate(new Date()), // 생성 시간
            cmtContent: postComment, // 댓글 내용
          }
        );
        await updateDoc(
          // Firestore에 데이터 업데이트
          doc(firestore, `${modalType}/${modalPostID}/Cmts`, result.id), // 해당 문서에
          {
            cmtID: result.id, // 댓글 아이디 추가
          }
        );
        toastClear(); // 토스트 메시지 제거
        toastSuccess("업로드에 성공했습니다!"); // 성공 토스트 메시지 출력
        setPostComment(""); // postComment 초기화
      } catch (err) {
        toastError("업로드에 실패했습니다!"); // 실패 토스트 메시지 출력
      }
    } else {
      toastError("내용을 입력해주세요!"); // 실패 토스트 메시지 출력
    }
  };

  const likeClick = async (postID, count) => {
    try {
      // 좋아요를 누른 사용자의 정보를 Posts/{postID}/Likes/{uid} 경로에 저장
      await setDoc(doc(firestore, `${modalType}/${postID}/Likes`, uid), {
        userID: uid,
      });
      // Posts/{postID} 경로의 likeCount 필드를 1 증가시킴
      await updateDoc(doc(firestore, modalType, postID), {
        likeCount: ++count,
      });
      // postLike와 postLikeCount 배열을 복사하여 해당 index의 값을 변경하고 state를 업데이트함
      setPostLike(true);
      setPostLikeCount(count);
      // 성공적으로 좋아요를 눌렀다는 메시지를 띄움
      toastSuccess("좋아요를 눌렀습니다!");
    } catch (err) {
      // 좋아요를 누르는데 실패했다는 메시지를 띄움
      toastError("좋아요에 실패하였습니다!");
    }
  };

  const dislikeClick = async (postID, count) => {
    try {
      // 좋아요 삭제
      await deleteDoc(doc(firestore, `${modalType}/${postID}/Likes`, uid));
      // 좋아요 수 업데이트
      await updateDoc(doc(firestore, modalType, postID), {
        likeCount: --count,
      });
      // 좋아요 상태 업데이트
      setPostLike(false);
      setPostLikeCount(count);
      // 성공 메시지 출력
      toastSuccess("좋아요를 취소했습니다!");
    } catch (err) {
      // 실패 메시지 출력
      console.error(err);
      toastError("좋아요를 취소하지 못했습니다!");
    }
  };

  const rePostClick = async (content) => {
    toastLoading("게시물을 리포스트 중입니다!"); // 게시물 리포스트 중임을 알리는 로딩 토스트 메시지 출력
    try {
      const result = await addDoc(collection(firestore, modalType), {
        // firestore의 Posts collection에 새로운 document 추가
        userID: uid, // 현재 사용자의 uid를 userID 필드에 저장
        createdAt: Timestamp.fromDate(new Date()), // 현재 시간을 createdAt 필드에 저장
        postContent: content, // content를 postContent 필드에 저장
        likeCount: 0, // likeCount 필드를 0으로 초기화
      });
      await updateDoc(doc(firestore, modalType, result.id), {
        // 방금 추가한 document의 postID 필드를 해당 document의 id로 업데이트
        postID: result.id,
      });
      toastClear(); // 로딩 토스트 메시지 제거
      toastSuccess("성공적으로 리포스트 했습니다!"); // 성공적으로 리포스트 했음을 알리는 토스트 메시지 출력
    } catch (err) {
      console.error(err);
      toastClear(); // 로딩 토스트 메시지 제거
      toastError("리포스트 하지 못했습니다!"); // 리포스트 실패를 알리는 토스트 메시지 출력
    }
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
      console.error(err);
      toastError("공유하지 못했습니다!");
    }
  };

  const removeClick = async () => {
    toastLoading("게시물을 삭제하는 중입니다!"); // 게시물 삭제 중임을 알리는 로딩 토스트 메시지 출력
    try {
      const likes = await getDocs(
        collection(firestore, `${modalType}/${mdValue.postID}/Likes`)
      );
      likes.forEach(async (document) => {
        await deleteDoc(
          doc(firestore, `${modalType}/${mdValue.postID}/Likes`, document.id)
        ); // 게시물에 달린 좋아요들을 모두 삭제
      });
      const comments = await getDocs(
        collection(firestore, `${modalType}/${mdValue.postID}/Cmts`)
      );
      comments.forEach(async (document) => {
        await deleteDoc(
          doc(firestore, `${modalType}/${mdValue.postID}/Cmts`, document.id)
        ); // 게시물에 달린 댓글들을 모두 삭제
      });
      await deleteDoc(doc(firestore, modalType, mdValue.postID)); // 게시물 삭제
      toastClear(); // 로딩 토스트 메시지 제거
      toastSuccess("게시물을 삭제했습니다!"); // 게시물 삭제 성공 메시지 출력
      setModalState(false); // 모달 닫기
    } catch (err) {
      toastClear(); // 로딩 토스트 메시지 제거
      toastError("게시물을 삭제하지 못했습니다!"); // 게시물 삭제 실패 메시지 출력
    }
  };

  const upClick = async (createdAt) => {
    // 현재 시간과 게시물 생성 시간의 차이가 1시간 이상인 경우
    if (currentTime.seconds - createdAt.seconds > 3600) {
      // 로딩 중임을 알리는 토스트 메시지 출력
      toastLoading("게시물을 UP하는 중입니다!");
      // 게시물 UP 수를 임시 저장
      const tempUps = modalData.postUps;
      try {
        // 게시물의 생성 시간과 UP 수를 업데이트
        await updateDoc(doc(firestore, modalType, mdValue.postID), {
          createdAt: Timestamp.fromDate(new Date()),
          postUps: tempUps + 1,
        });
        // 토스트 메시지 제거 후 UP 성공 메시지 출력
        toastClear();
        toastSuccess("게시물을 UP했습니다!");
      } catch (err) {
        // 토스트 메시지 제거 후 UP 실패 메시지 출력
        toastClear();
        toastError("게시물을 UP하지 못했습니다!");
      }
    } else {
      // 게시 시간으로부터 1시간 뒤에 UP이 가능하다는 메시지 출력
      toastError("게시 시간으로부터 1시간 뒤에 UP이 가능합니다!");
    }
  };

  const profileClick = (userID) => {
    // userID를 sessionStorage에 저장
    sessionStorage.setItem("tempState", userID);
    // "/profile" 경로로 이동하면서 state에 userID를 전달하고, 이전 페이지를 대체
    navigate("/profile", { state: userID, replace: true });
    // 모달 상태를 닫음
    setModalState(false);
  };

  return (
    mdValue &&
    user &&
    cmts &&
    cmtUser && (
      <div className={styles.modalWrapper}>
        {cmtsState && <MainPQModal setModalState={setCmtsState} />}
        <AiOutlineClose
          className={`${styles.closeBtn} ${font.fs_16} `}
          onClick={closeModal}
        />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          bodyClassName={styles.toast}
        />
        <Swiper
          slidesPerView={1}
          ref={modalRef}
          className={styles.modal}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
        >
          <SwiperSlide className={styles.postBox}>
            {modalType == "QnAs" ? (
              <div className={styles.titleBox}>
                <p className={`${font.fs_24} ${font.fw_7}`}>
                  {mdValue.postTitle}
                </p>
                <GrNext className={styles.nav} onClick={handleNext} />
              </div>
            ) : null}
            <div className={styles.postContBox}>
              <MarkdownPreview
                className={styles.postContent}
                source={mdValue.postContent}
              />
            </div>
            {modalType == "QnAs" ? (
              <div className={styles.postTagBox}>
                {mdValue.postTags &&
                  mdValue.postTags.map((item, index) => (
                    <p
                      key={index}
                      className={`${styles.postTagItem} ${font.fs_14}`}
                    >
                      {item}
                    </p>
                  ))}
              </div>
            ) : null}
          </SwiperSlide>

          <SwiperSlide className={styles.cmtsBox}>
            <div className={styles.cmtsProfileBox}>
              <div className={styles.leftBox}>
                <GrPrevious className={styles.nav} onClick={handlePrev} />
                <div className={styles.userBox}>
                  <div
                    className={styles.cmtsImg}
                    style={
                      user.userImg != ""
                        ? { backgroundImage: `url(${user.userImg})` }
                        : { backgroundImage: `url(${baseImg})` }
                    }
                    onClick={() => profileClick(user.userID)}
                  ></div>
                  <div className={styles.nameBox}>
                    <p className={`${font.fs_16} ${font.fw_7}`}>
                      {user.userName}
                    </p>
                    <p
                      className={`${font.fs_10} ${font.fw_5} ${font.fc_sub_light}`}
                    >
                      {mdValue.createdAt && (
                        <p
                          className={`${font.fs_12} ${font.fw_7} ${font.fc_sub_light}`}
                        >
                          {convertTimestamp(
                            currentTime.seconds,
                            mdValue.createdAt.seconds
                          )}
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {uid === mdValue.userID && (
                <div className={styles.funcBox}>
                  {modalType == "QnAs" && (
                    <BsFillCloudUploadFill
                      className={styles.upBtn}
                      onClick={() => upClick(mdValue.createdAt)}
                    />
                  )}
                  <BsFillTrashFill
                    className={styles.removeBtn}
                    onClick={removeClick}
                  />
                </div>
              )}
            </div>
            <div
              className={styles.cmtsCommentBox}
              style={
                modalType === "Posts"
                  ? { height: "calc(90vh - 21.1rem)" }
                  : { height: "calc(90vh - 17.1rem)" }
              }
            >
              {cmts.length === 0 ? (
                <div className={styles.noExistsBox}>
                  {modalType == "Posts" && (
                    <div>
                      <p className={`${font.fs_24} ${font.fw_7}`}>
                        댓글이 없습니다
                      </p>
                      <p
                        className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}
                      >
                        이 게시물의 첫 댓글을 달아주세요!
                      </p>
                    </div>
                  )}
                  {modalType == "QnAs" && (
                    <div>
                      <p className={`${font.fs_24} ${font.fw_7}`}>
                        답변이 없습니다
                      </p>
                      <p
                        className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}
                      >
                        이 질문의 첫 답변을 달아주세요!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.existsBox}>
                  {cmts.map((item, index) => (
                    <div className={styles.commentBox}>
                      <div className={styles.titleBox}>
                        <div className={styles.profileBox}>
                          <div
                            className={styles.profileImg}
                            style={
                              cmtUser[index].userImg
                                ? {
                                    backgroundImage: `url(${cmtUser[index].userImg})`,
                                  }
                                : { backgroundImage: `url(${baseImg})` }
                            }
                          ></div>
                          <p className={`${font.fw_7} ${font.fs_16}`}>
                            {cmtUser[index].userName}
                          </p>
                        </div>
                        <p
                          className={`${font.fw_7} ${font.fs_12} ${font.fc_sub_light}`}
                        >
                          {convertTimestamp(currentTime, item.createdAt)}
                        </p>
                      </div>
                      <MarkdownPreview
                        className={styles.comment}
                        key={index}
                        source={item.cmtContent}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.cmtsFunctionBox}>
              {modalType == "Posts" && (
                <div className={styles.cmtsFunctionBtnBox}>
                  {!postLike ? ( // 게시물 좋아요를 누르지 않은 경우
                    <AiOutlineLike
                      onClick={() =>
                        likeClick(mdValue.postID, mdValue.likeCount)
                      } // 좋아요 버튼 클릭 시 좋아요 추가
                    />
                  ) : (
                    // 게시물 좋아요를 누른 경우
                    <AiFillLike
                      onClick={() =>
                        dislikeClick(mdValue.postID, mdValue.likeCount)
                      } // 좋아요 버튼 클릭 시 좋아요 취소
                    />
                  )}
                  <RiRestartLine
                    onClick={() => rePostClick(mdValue.postContent)}
                  />
                  {/* 리포스트 버튼 클릭 시 게시물 내용을 복사하여 새 게시물 작성 페이지로 이동 */}
                  <AiOutlineShareAlt onClick={() => shareClick(mdValue)} />
                  {/* 공유 버튼 클릭 시 게시물 공유 */}
                </div>
              )}

              <div className={styles.cmtsFunctionWriteBox}>
                <MarkdownEditor
                  value={postComment}
                  onChange={(e) => setPostComment(e)}
                  className={styles.inputComment}
                  previewWidth={"100%"}
                  style={{
                    fontSize: 16,
                  }}
                  toolbars={[
                    "bold",
                    "italic",
                    "quote",
                    "link",
                    "image",
                    "code",
                    "codeBlock",
                  ]}
                  toolbarsMode={["preview"]}
                />
                <div className="">
                  <button
                    className={`${font.fs_14} ${font.fw_7}`}
                    onClick={uploadClick}
                  >
                    <BsSendFill />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    )
  );
};
export default MainCmtsModal;
