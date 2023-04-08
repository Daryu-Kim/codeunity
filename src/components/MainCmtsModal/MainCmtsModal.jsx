import { useEffect, useRef, useState } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./MainCmtsModal.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { toastClear, toastError, toastLoading, toastSuccess } from "../../modules/Functions";
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
} from "firebase/firestore";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { AiFillLike, AiOutlineComment, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { RiRestartLine } from "react-icons/ri";

const MainCmtsModal = ({
  setModalState,
  modalPostID,
  modalUserID,
  modalType,
}) => {
  const firestore = getFirestore();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [mdValue, setMDValue] = useState({});
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);
  const [postLike, setPostLike] = useState(false);
  const modalRef = useRef(null);
  const [postLikeCount, setPostLikeCount] = useState(0);
  const [modalData, modalDataLoad, modalDataError] = useDocumentData(
    doc(firestore, "Posts", modalPostID)
  );
  const [userData, userDataLoad, userDataError] = useDocumentData(
    doc(firestore, "Users", modalUserID)
  );

  const uid = localStorage.getItem("uid");

  const closeModal = () => {
    setModalState(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalState(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    if (modalUserID) {
      setUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (modalPostID) {
      setMDValue(modalData);
    }
  }, [modalData]);

  const likeClick = async (postID, count) => {
    try {
      // 좋아요를 누른 사용자의 정보를 Posts/{postID}/Likes/{uid} 경로에 저장
      await setDoc(doc(firestore, `Posts/${postID}/Likes`, uid), {
        userID: uid,
      });
      // Posts/{postID} 경로의 likeCount 필드를 1 증가시킴
      await updateDoc(doc(firestore, "Posts", postID), { likeCount: ++count });
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
      await deleteDoc(doc(firestore, `Posts/${postID}/Likes`, uid));
      // 좋아요 수 업데이트
      await updateDoc(doc(firestore, "Posts", postID), {
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

  return (
    mdValue && user && (
      <div className={styles.modalWrapper}>
        <button
          className={`${styles.closeBtn} ${font.fs_16} `}
          type="button"
          onClick={closeModal}
        >
          X
        </button>
        <ToastContainer position="top-right" autoClose={2000} />
        <div ref={modalRef} className={styles.modal}>
          <div className={styles.postBox}>
            {modalType == "qna" ? (
              <p className={`${font.fs_24} ${font.fw_7}`}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
            ) : null}
            <div className={styles.postContBox}>
              <MarkdownPreview
                className={styles.postContent}
                source={mdValue.postContent}
              />
            </div>
            {modalType == "qna" ? (
              <div className={styles.postTagBox}>
                <p className={`${styles.postTagItem} ${font.fs_14}`}>lorem</p>
                <p className={`${styles.postTagItem} ${font.fs_14}`}>lorem</p>
                <p className={`${styles.postTagItem} ${font.fs_14}`}>lorem</p>
                <p className={`${styles.postTagItem} ${font.fs_14}`}>lorem</p>
                <p className={`${styles.postTagItem} ${font.fs_14}`}>lorem</p>
              </div>
            ) : null}
          </div>

          <div className={styles.cmtsBox}>
            <div className={styles.cmtsProfileBox}>
              {console.log(user)}
              <div
                className={styles.cmtsImg}
                style={
                  user.userImg != ""
                  ? {backgroundImage: `url(${user.userImg})`}
                  : {backgroundImage: `url(${baseImg})`}
                }
              ></div>
              <p className={`${font.fs_16} ${font.fw_7}`}>
                {user.userName}
              </p>
            </div>
            <div className={styles.cmtsCommentBox}>zxcv</div>
            <div className={styles.cmtsFunctionBox}>
              <div className={styles.cmtsFunctionBtnBox}>
                {!postLike ? ( // 게시물 좋아요를 누르지 않은 경우
                  <AiOutlineLike
                    onClick={() => likeClick(mdValue.postID, mdValue.likeCount)} // 좋아요 버튼 클릭 시 좋아요 추가
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
              <div className={styles.cmtsFunctionWriteBox}>
                {
                  modalType == "post" &&
                  <div className={styles.postCmtBox}>
                    <input type="text" className={`${font.fs_16}`} placeholder="댓글 작성하기..." />
                    <button className={`${font.fs_16} ${font.fw_7}`}>
                      게시
                    </button>
                  </div>
                }
                {
                  modalType == "qna" &&
                  <button className={`${font.fs_16} ${font.fw_7}`}>
                    답변 작성하기...
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default MainCmtsModal;
