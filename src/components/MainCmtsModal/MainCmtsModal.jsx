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
  const firestore = getFirestore();
  const [mdValue, setMDValue] = useState({});
  const [user, setUser] = useState({});
  const [cmts, setCmts] = useState([]);
  const [postLike, setPostLike] = useState(false);
  const [cmtsState, setCmtsState] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);
  const [cmtUser, setCmtUser] = useState([]);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [modalData, modalDataLoad, modalDataError] = useDocumentData(
    doc(firestore, modalType, modalPostID)
  );
  const [userData, userDataLoad, userDataError] = useDocumentData(
    doc(firestore, "Users", modalUserID)
  );
  const [cmtData, cmtDataLoad, cmtDataError] = useCollectionData(
    query(
      collection(firestore, `${modalType}/${modalPostID}/Cmts`),
      orderBy("createdAt", "desc")
    )
  );
  const [postComment, setPostComment] = useState("");

  const uid = localStorage.getItem("uid");
  const currentTime = Timestamp.fromDate(new Date());

  const handlePrev = useCallback(() => {
    if (!modalRef.current.swiper.slidePrev());
  }, []);

  const handleNext = useCallback(() => {
    if (!modalRef.current.swiper.slideNext());
  }, []);

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
    if (cmtData) {
      const tempCmtUser = [...cmtData];
      cmtData.map(async (item, index) => {
        const tempUser = await getDoc(doc(firestore, "Users", item.userID));
        tempCmtUser[index] = tempUser.data();
      });
      setCmtUser(tempCmtUser);
      console.log(cmtUser);
    }
  }, [cmtData, cmts]);

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

  useEffect(() => {
    if (modalType == "QnAs") {
      updatePostViews();
    }
  }, []);

  const updatePostViews = async () => {
    const post = await getDoc(doc(firestore, modalType, modalPostID));
    await updateDoc(doc(firestore, modalType, modalPostID), {
      postViews: post.data().postViews + 1,
    });
  };

  const uploadClick = async () => {
    if (postComment.length > 0) {
      toastLoading();
      await addDoc(collection(firestore, `${modalType}/${modalPostID}/Cmts`), {
        userID: uid,
        createdAt: Timestamp.fromDate(new Date()),
        cmtContent: postComment,
      })
        .then(async (result) => {
          await updateDoc(
            doc(firestore, `${modalType}/${modalPostID}/Cmts`, result.id),
            {
              cmtID: result.id,
            }
          )
            .then(() => {
              toastClear();
              toastSuccess("업로드에 성공했습니다!");
              setPostComment("");
            })
            .catch(async () => {
              await deleteDoc(
                doc(firestore, `${modalType}/${modalPostID}/Cmts`, result.id)
              );
              toastError("업로드에 실패했습니다!");
            });
        })
        .catch((err) => {
          toastError("업로드에 실패했습니다!");
        });
    } else {
      toastError("내용을 입력해주세요!");
    }
  };

  useEffect(() => {
    if (cmtData) {
      let tempArr = [...cmtData];
      cmtData.map((item, index) => {
        tempArr[index] = item;
      });
      setCmts(tempArr);
      console.log("object!");
    }
  }, [cmtData]);

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
    toastLoading("게시물을 삭제하는 중입니다!");
    await getDocs(collection(firestore, `${modalType}/${mdValue.postID}/Likes`))
      .then(async (result) => {
        result.forEach(async (document) => {
          await deleteDoc(
            doc(firestore, `${modalType}/${mdValue.postID}/Likes`, document.id)
          );
        });
        await getDocs(
          collection(firestore, `${modalType}/${mdValue.postID}/Cmts`)
        )
          .then(async (result) => {
            result.forEach(async (document) => {
              await deleteDoc(
                doc(
                  firestore,
                  `${modalType}/${mdValue.postID}/Cmts`,
                  document.id
                )
              );
            });
            await deleteDoc(doc(firestore, modalType, mdValue.postID))
              .then((result) => {
                toastClear();
                toastSuccess("게시물을 삭제했습니다!");
                setModalState(false);
              })
              .catch((err) => {
                toastClear();
                toastError("게시물을 삭제하지 못했습니다!");
              });
          })
          .catch((err) => {
            toastClear();
            toastError("게시물을 삭제하지 못했습니다!");
          });
      })
      .catch((err) => {
        toastClear();
        toastError("게시물을 삭제하지 못했습니다!");
      });
  };

  const upClick = async (createdAt) => {
    if (currentTime.seconds - createdAt.seconds > 3600) {
      toastLoading("게시물을 UP하는 중입니다!");
      const tempUps = modalData.postUps;
      await updateDoc(doc(firestore, modalType, mdValue.postID), {
        createdAt: Timestamp.fromDate(new Date()),
        postUps: tempUps + 1,
      })
        .then((result) => {
          toastClear();
          toastSuccess("게시물을 UP했습니다!");
        })
        .catch((err) => {
          toastClear();
          toastError("게시물을 UP하지 못했습니다!");
        });
    } else {
      toastError("게시 시간으로부터 1시간 뒤에 UP이 가능합니다!");
    }
  };

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
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
