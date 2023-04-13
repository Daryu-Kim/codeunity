import { useEffect, useState } from "react";
import styles from "./MainProfile.module.scss";
import font from "../../styles/Font.module.scss";
import {
  doc,
  getFirestore,
  query,
  where,
  collection,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import MarkdownPreview from "@uiw/react-markdown-preview";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";
import MainFollow from "../MainFollowFollowing/MainFollow";
import { toastError, toastSuccess } from "../../modules/Functions";
import { followUser, unfollowUser } from "../../modules/Firebase";

const MainProfile = () => {
  const firestore = getFirestore();
  const uid = sessionStorage.getItem("tempState");
  const myUID = localStorage.getItem("uid");
  const [document] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  const [myFollowing] = useCollectionData(
    collection(firestore, `Follows/${myUID}/Following`)
  );
  const [modalState, setModalState] = useState(false);
  const [modalPostID, setModalPostID] = useState("");
  const [modalType, setModalType] = useState("");
  const [menuTab, setMenuTab] = useState(true);
  const [userPost] = useCollectionData(
    query(
      collection(firestore, "Posts"),
      where("userID", "==", uid),
      orderBy("createdAt", "desc")
    ) // 생성일 기준으로 내림차순 정렬
  );
  console.log(userPost);
  const [userQnA, userQnALoad, userQnAError] = useCollectionData(
    query(
      collection(firestore, "QnAs"),
      where("userID", "==", uid),
      orderBy("createdAt", "desc")
    ) // 생성일 기준으로 내림차순 정렬
  );
  const [userPostData, setUserPostData] = useState(null);
  const [userQnAData, setUserQnAData] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const [modifyName, setModifyName] = useState("");
  const [modifySearchID, setModifySearchID] = useState("");
  const [modifyDesc, setModifyDesc] = useState("");
  const [modifyTags, setModifyTags] = useState([]);

  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (myFollowing) {
      let temp = 0;
      myFollowing.map((item) => {
        item.userID == uid && temp++;
      })
      temp > 0 ? setIsFollowed(true) : setIsFollowed(false)
    }
  }, [myFollowing])

  useEffect(() => {
    if (userPost != undefined) {
      setUserPostData(
        userPost.map((item, index) => {
          return (
            <div
              key={index}
              className={styles.postItem}
              onClick={() => showModal(item.postID, "Posts")}
            >
              <MarkdownPreview
                className={`
                  ${styles.postItemMd}
                `}
                key={item.postID}
                source={item.postContent}
              />
            </div>
          );
        })
      );
    }
  }, [userPost]);

  useEffect(() => {
    if (userQnA != undefined) {
      setUserQnAData(
        userQnA.map((item, index) => {
          return (
            <div
              key={index}
              className={styles.qnaItem}
              onClick={() => showModal(item.postID, "QnAs")}
            >
              <p
                className={`
                  ${font.fw_7}
                  ${font.fs_20}
                `}
              >
                {item.postTitle}
              </p>
            </div>
          );
        })
      );
    }
  }, [userQnA]);

  const changePostTab = (e) => {
    if (e.target.checked) {
      setMenuTab(true);
    }
  };

  const changeQnaTab = (e) => {
    if (e.target.checked) {
      setMenuTab(false);
    }
  };

  const showModal = (postID, type) => {
    setModalPostID(postID);
    setModalType(type);
    setModalState(true);
  };

  const changeProfile = (
    userName,
    userSearchID,
    userDesc,
    userTags
  ) => {
    setModifyName(userName)
    setModifySearchID(userSearchID)
    setModifyDesc(userDesc)
    setModifyTags(userTags)
    setIsModifying(true)
  }

  const submitProfile = async () => {
    if (modifyName) {
      if (modifySearchID) {
        await updateDoc(doc(firestore, "Users", myUID), {
          userName: modifyName,
          userSearchID: modifySearchID[0] != "@" ? `@${modifySearchID}` : modifySearchID,
          userDesc: modifyDesc,
          userTag: modifyTags
        }).then(() => {
          toastSuccess("프로필이 변경되었습니다!");
          setIsModifying(false)
        }).catch(() => {
          toastError("프로필 변경에 실패했습니다!");
        });
      } else {
        toastError("검색 ID는 공백으로 둘 수 없습니다!");
      }
    } else {
      toastError("이름은 공백으로 둘 수 없습니다!");
    }
  }

  const tagInput = (e) => {
    if (e.key === "Enter") {
      addTag(e.target.value);
      e.target.value = "";
    }
  };

  const addTag = (tagValue) => {
    console.log(modifyTags)
    if (modifyTags.indexOf(tagValue) == -1) {
      // 중복 없을때
      const tempTags = [...modifyTags];
      tempTags.push(tagValue);
      setModifyTags(tempTags);
    } else {
      toastError("이미 추가된 태그입니다!")
    }
  }

  const removeTag = (index) => {
    const tempTags = [...modifyTags];
    tempTags.splice(index, 1);
    setModifyTags(tempTags)
  }

  const followClick = async (targetID) => {
    try {
      await followUser(targetID); // targetID를 팔로우하는 함수 호출
      setIsFollowed(true);
      toastSuccess("팔로우를 완료하였습니다!"); // 팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  const unfollowClick = async (targetID) => {
    try {
      await unfollowUser(targetID); // targetID를 언팔로우하는 함수 호출
      setIsFollowed(false);
      toastSuccess("언팔로우를 완료하였습니다!"); // 언팔로우 완료 메시지 출력
    } catch (err) {} // 에러 발생 시 무시
  };

  if (document) {
    return (
      <div className={styles.wrapper}>
        {modalState && (
          <div className={styles.mainCmtsModal}>
            <MainCmtsModal
              setModalState={setModalState}
              modalPostID={modalPostID}
              modalUserID={uid}
              modalType={modalType}
            />
          </div>
        )}
        <div className={styles.profileBox}>
          <div className={styles.imgBox}>
            <div
              className={styles.img}
              style={
                document.userImg
                  ? { backgroundImage: `url(${document.userImg})` }
                  : { backgroundImage: `url(${baseImg})` }
              }
            ></div>
            <div className={styles.btnBox}>
              {document.userID == myUID ? (
                (
                  <button
                      className={`${styles.modifyBtn} ${font.fs_14} ${font.fw_7}`}
                      onClick={() => 
                        isModifying ?
                        submitProfile() :
                        changeProfile(
                          document.userName,
                          document.userSearchID,
                          document.userDesc,
                          document.userTag
                        )
                      }
                    >
                      {
                        isModifying ? "완료" : "편집"
                      }
                    </button>
                ) 
              ) : (
                !isFollowed ? (
                  <button
                    className={`${styles.followBtn} ${font.fs_12} ${font.fw_5}`}
                    onClick={() => followClick(uid)}
                  >
                    팔로우
                  </button>
                ) : (
                  <button
                    className={`${styles.unfollowBtn} ${font.fs_12} ${font.fw_5}`}
                    onClick={() => unfollowClick(uid)}
                  >
                    언팔로우
                  </button>
                ))
            }
            </div>
          </div>
          <div className={styles.nameBox}>
            {
            !isModifying ?
            <p className={`${font.fs_24} ${font.fw_7}`}>{document.userName}</p> :
            <input
              type="text"
              value={modifyName}
              placeholder="이름을 입력해주세요! (최대 8글자)"
              maxLength={8}
              onChange={(e) => setModifyName(e.target.value)}
              className={`${font.fs_24} ${font.fw_7}`}
            />
            }
            {
              !isModifying ?
              (
                <p className={`${font.fs_14} ${font.fw_7} ${font.fc_accent}`}>
                  {document.userSearchID}
                </p>
              ) :
              (
                <input
                  type="text"
                  placeholder="검색 ID를 입력해주세요!"
                  value={modifySearchID}
                  onChange={(e) => setModifySearchID(e.target.value)}
                  className={`${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
                />
              )
            }

            {
              !isModifying ?
              (
                <p className={`${font.fs_16} ${font.fc_sub}`}>
                  {document.userDesc ? document.userDesc : "자기소개가 없습니다!"}
                </p>
              ) :
              (
                <input
                  type="text"
                  value={modifyDesc}
                  placeholder="자기소개를 입력해주세요! (최대 50글자)"
                  maxLength={50}
                  onChange={(e) => setModifyDesc(e.target.value)}
                  className={`${font.fs_16} ${font.fc_sub}`}
                />
              )
            }
          </div>
          <div className={styles.followBox} onClick={handleModalOpen}>
            <div className={styles.followerBox}>
              <p className={`${styles.followTitle} ${font.fs_14} ${font.fw_7}`}>
                팔로우
              </p>
              <p
                className={`${styles.followTitle} ${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
              >
                {document.followerCount}
              </p>
            </div>
            <div className={styles.followingBox}>
              <p className={`${styles.followTitle} ${font.fs_14} ${font.fw_7}`}>
                팔로잉
              </p>
              <p
                className={`${styles.followTitle} ${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
              >
                {document.followingCount}
              </p>
            </div>
          </div>
          {
            isModifying ? (
              <div className={styles.tagBox}>
                <input
                  className={`${font.fs_12} ${font.fw_5}`}
                  type="text"
                  placeholder="태그를 입력해주세요 (Enter로 구분)"
                  onKeyUp={(e) => tagInput(e)}
                />
                
          <div className={styles.userTagBox}>
            {
              modifyTags.map((item, index) => (
                <p className={`${font.fs_12} ${font.fw_7}`} key={index} onClick={() => removeTag(index)}>
                  {item}
                </p>
              ))
            }
          </div>
              </div>
            ) : (
              <div className={styles.userTagBox}>
            {
              document.userTag.map((item, index) => (
                <p className={`${font.fs_12} ${font.fw_7}`} key={index}>
                  {item}
                </p>
              ))
            }
          </div>
            )
          }
        </div>
        <div className={styles.contBox}>
          <div className={styles.menuTab}>
            <input
              type="radio"
              name="tab"
              checked={menuTab == true}
              id="post"
              onChange={(e) => changePostTab(e)}
              className={styles.none}
            />
            <label
              htmlFor="post"
              className={`${font.fs_16} ${font.fw_7} ${styles.menuTabPost}`}
            >
              게시물
            </label>
            <input
              type="radio"
              name="tab"
              checked={menuTab == false}
              id="qna"
              onChange={(e) => changeQnaTab(e)}
              className={styles.none}
            />
            <label
              htmlFor="qna"
              className={`${font.fs_16} ${font.fw_7} ${styles.menuTabQnA}`}
            >
              QnA
            </label>
          </div>
          {menuTab ? (
            userPostData &&
              userPostData.length > 0 ?
                (<div className={styles.postBox}>
                  {userPostData}
                  </div>) :
                  <div className={styles.postNone}>
                    <p className={`${font.fs_24} ${font.fw_7}`}>
                      게시물이 없습니다
                    </p>
                    <p className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}>
                      게시물을 등록하고 공유해보세요!
                    </p>
                  </div>
          ) : (
            userQnAData &&
            userQnAData.length > 0 ?
                (<div className={styles.postBox}>
                  {userQnAData}
                  </div>) :
                  <div className={styles.postNone}>
                    <p className={`${font.fs_24} ${font.fw_7}`}>
                      질문이 없습니다
                    </p>
                    <p className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}>
                      질문을 등록하고 답변을 받아보세요!
                    </p>
                  </div>
          )}
        </div>
        {isModalOpen && (
          <MainFollow userID={document.userID} closeModal={handleModalClose} modalType="Profile" />
        )}
      </div>
    );
  }
};

export default MainProfile;
