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
  const firestore = getFirestore(); // Firestore 인스턴스 생성
  const uid = sessionStorage.getItem("tempState"); // sessionStorage에서 tempState 가져오기
  const myUID = localStorage.getItem("uid"); // localStorage에서 uid 가져오기
  const [modalState, setModalState] = useState(false); // 모달 상태와 모달 상태를 변경하는 함수를 정의하는 useState 훅
  const [modalPostID, setModalPostID] = useState(""); // 모달에서 보여줄 게시물 ID와 게시물 ID를 변경하는 함수를 정의하는 useState 훅
  const [modalType, setModalType] = useState(""); // 모달에서 보여줄 게시물 타입과 게시물 타입을 변경하는 함수를 정의하는 useState 훅
  const [menuTab, setMenuTab] = useState(true); // 현재 선택된 메뉴 탭과 메뉴 탭을 변경하는 함수를 정의하는 useState 훅
  const [userPostData, setUserPostData] = useState(null); // 사용자의 게시물 데이터와 게시물 데이터를 변경하는 함수를 정의하는 useState 훅
  const [userQnAData, setUserQnAData] = useState(null); // 사용자의 QnA 데이터와 QnA 데이터를 변경하는 함수를 정의하는 useState 훅
  const [isModifying, setIsModifying] = useState(false); // 수정 중인지 여부와 수정 중인지 여부를 변경하는 함수를 정의하는 useState 훅
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열려있는지 여부와 모달이 열려있는지 여부를 변경하는 함수를 정의하는 useState 훅
  const [modifyName, setModifyName] = useState(""); // 수정할 게시물의 이름과 이름을 변경하는 함수를 정의하는 useState 훅
  const [modifySearchID, setModifySearchID] = useState(""); // 수정할 게시물의 검색 ID와 검색 ID를 변경하는 함수를 정의하는 useState 훅
  const [modifyDesc, setModifyDesc] = useState(""); // 수정할 게시물의 설명과 설명을 변경하는 함수를 정의하는 useState 훅
  const [modifyTags, setModifyTags] = useState([]); // 수정할 게시물의 태그와 태그를 변경하는 함수를 정의하는 useState 훅
  const [isFollowed, setIsFollowed] = useState(false); // 팔로우 중인지 여부와 팔로우 중인지 여부를 변경하는 함수를 정의하는 useState 훅

  // Firestore에서 "Users" 컬렉션에서 uid와 일치하는 문서를 가져와서 document 변수에 할당
  const [document] = useDocumentData(doc(firestore, "Users", uid));

  // Firestore에서 `Follows/${myUID}/Following` 경로의 컬렉션 데이터를 가져와서 myFollowing 변수에 할당
  const [myFollowing] = useCollectionData(
    collection(firestore, `Follows/${myUID}/Following`)
  );

  // Firestore에서 "Posts" 컬렉션에서 userID가 uid와 일치하고 createdAt을 기준으로 내림차순으로 정렬된 컬렉션 데이터를 가져와서 userPost 변수에 할당
  const [userPost] = useCollectionData(
    query(
      collection(firestore, "Posts"),
      where("userID", "==", uid),
      orderBy("createdAt", "desc")
    )
  );

  // Firestore에서 "QnAs" 컬렉션에서 userID가 uid와 일치하고 createdAt을 기준으로 내림차순으로 정렬된 컬렉션 데이터를 가져와서 userQnA 변수에 할당
  // userQnALoad와 userQnAError는 해당 컬렉션 데이터의 로딩 상태와 에러 상태를 나타내는 변수
  const [userQnA, userQnALoad, userQnAError] = useCollectionData(
    query(
      collection(firestore, "QnAs"),
      where("userID", "==", uid),
      orderBy("createdAt", "desc")
    )
  );

  useEffect(() => {
    // myFollowing이 존재할 경우
    if (myFollowing) {
      // myFollowing에서 현재 사용자의 uid와 일치하는 item들의 개수를 구한다.
      const temp = myFollowing.filter((item) => item.userID === uid).length;
      // temp가 0보다 크면 이미 팔로우한 상태이므로 setIsFollowed를 true로 설정한다.
      setIsFollowed(temp > 0);
    }
  }, [myFollowing]);

  useEffect(() => {
    if (userPost !== undefined) {
      // userPost가 정의되어 있으면 실행
      setUserPostData(
        // setUserPostData 함수를 호출하여 userPostData 상태 업데이트
        userPost.map(
          (
            item,
            index // userPost 배열을 순회하며 JSX 반환
          ) => (
            <div
              key={index} // key 값으로 index 사용
              className={styles.postItem} // CSS 클래스 적용
              onClick={() => showModal(item.postID, "Posts")} // 클릭 이벤트 핸들러 등록
            >
              <MarkdownPreview // Markdown 형식의 텍스트를 미리보기 형태로 렌더링
                className={styles.postItemMd} // CSS 클래스 적용
                key={item.postID} // key 값으로 postID 사용
                source={item.postContent} // Markdown 형식의 텍스트
              />
            </div>
          )
        )
      );
    }
  }, [userPost]); // userPost가 변경될 때마다 useEffect 실행

  useEffect(() => {
    if (userQnA !== undefined) {
      // userQnA가 정의되어 있으면 실행
      setUserQnAData(
        // setUserQnAData 함수를 호출하여 userQnAData 상태 업데이트
        userQnA.map(
          (
            item,
            index // userQnA 배열을 순회하며 JSX 반환
          ) => (
            <div
              key={index} // key 값으로 index 사용
              className={styles.qnaItem} // 스타일링을 위한 클래스명
              onClick={() => showModal(item.postID, "QnAs")} // 클릭 시 showModal 함수 호출
            >
              <p className={`${font.fw_7} ${font.fs_20}`}>{item.postTitle}</p>
              {/* // 글 제목 출력 */}
            </div>
          )
        )
      );
    }
  }, [userQnA]); // userQnA가 업데이트될 때마다 useEffect 실행

  // 모달을 열기 위한 함수
  const handleModalOpen = () => setIsModalOpen(true);
  // 모달을 닫기 위한 함수
  const handleModalClose = () => setIsModalOpen(false);

  // e.target.checked가 true일 경우에만 setMenuTab(true)를 호출하는 함수
  const changePostTab = (e) => e.target.checked && setMenuTab(true);
   // changeQnaTab 함수 선언, e는 이벤트 객체를 받아옴, e.target.checked가 true일 경우 setMenuTab(false) 실행
  const changeQnaTab = (e) => e.target.checked && setMenuTab(false);

  const showModal = (postID, type) => {
    // postID를 모달의 postID로 설정
    setModalPostID(postID);
    // type을 모달의 type으로 설정
    setModalType(type);
    // 모달 상태를 열린 상태로 설정
    setModalState(true);
  };

  const changeProfile = (name, searchID, desc, tags) => {
    // 이름 변경
    setModifyName(name);
    // 검색 ID 변경
    setModifySearchID(searchID);
    // 설명 변경
    setModifyDesc(desc);
    // 태그 변경
    setModifyTags(tags);
    // 수정 중인 상태로 변경
    setIsModifying(true);
  };

  const submitProfile = async () => {
    // 이름이 공백인 경우 에러 메시지 출력
    if (!modifyName) {
      return toastError("이름은 공백으로 둘 수 없습니다!");
    }
    // 검색 ID가 공백인 경우 에러 메시지 출력
    if (!modifySearchID) {
      return toastError("검색 ID는 공백으로 둘 수 없습니다!");
    }
    // 검색 ID가 "@"로 시작하지 않는 경우 "@"를 추가하여 formattedSearchID에 저장
    const formattedSearchID =
      modifySearchID[0] != "@" ? `@${modifySearchID}` : modifySearchID;
    // Firestore의 Users 컬렉션에서 현재 사용자의 UID에 해당하는 문서를 찾아서 프로필 정보 업데이트
    await updateDoc(doc(firestore, "Users", myUID), {
      userName: modifyName, // 이름 업데이트
      userSearchID: formattedSearchID, // 검색 ID 업데이트
      userDesc: modifyDesc, // 자기 소개 업데이트
      userTag: modifyTags, // 태그 업데이트
    })
      .then(() => {
        toastSuccess("프로필이 변경되었습니다!"); // 성공 메시지 출력
        setIsModifying(false); // 프로필 수정 모드 종료
      })
      .catch(() => {
        toastError("프로필 변경에 실패했습니다!"); // 실패 메시지 출력
      });
  };

  const tagInput = (e) => {
    // Enter 키를 눌렀을 때 실행
    if (e.key === "Enter") {
      // addTag 함수 실행
      addTag(e.target.value);
      // 입력창 초기화
      e.target.value = "";
    }
  };

  const addTag = (tagValue) => {
    // modifyTags 배열에 tagValue가 포함되어 있지 않은 경우
    if (!modifyTags.includes(tagValue)) {
      // setModifyTags 함수를 사용하여 modifyTags 배열에 tagValue를 추가한다.
      setModifyTags([...modifyTags, tagValue]);
    } else {
      // 이미 추가된 태그임을 알리는 에러 메시지를 띄운다.
      toastError("이미 추가된 태그입니다!");
    }
  };

  const removeTag = (index) => {
    // index 이전의 modifyTags 배열과 index 이후의 modifyTags 배열을 합쳐서 새로운 배열을 만듭니다.
    setModifyTags([
      ...modifyTags.slice(0, index),
      ...modifyTags.slice(index + 1),
    ]);
  };

  const followClick = async (targetID) => {
    try {
      await followUser(targetID); // targetID를 인자로 followUser 함수를 호출하고, 해당 함수가 끝날 때까지 기다림
      setIsFollowed(true); // setIsFollowed 함수를 호출하여 true 값을 전달하고, 상태를 업데이트함
      toastSuccess("팔로우를 완료하였습니다!"); // 팔로우 완료 메시지를 띄움
    } catch (err) {} // 에러가 발생하면 무시함
  };

  const unfollowClick = async (targetID) => {
    try {
      await unfollowUser(targetID); // targetID를 언팔로우하는 함수 호출
      setIsFollowed(false); // setIsFollowed를 false로 변경하여 팔로우 상태를 업데이트
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
                <button
                  className={`${styles.modifyBtn} ${font.fs_14} ${font.fw_7}`}
                  onClick={() =>
                    isModifying
                      ? submitProfile()
                      : changeProfile(
                          document.userName,
                          document.userSearchID,
                          document.userDesc,
                          document.userTag
                        )
                  }
                >
                  {isModifying ? "완료" : "편집"}
                </button>
              ) : !isFollowed ? (
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
              )}
            </div>
          </div>
          <div className={styles.nameBox}>
            {!isModifying ? (
              <p className={`${font.fs_24} ${font.fw_7}`}>
                {document.userName}
              </p>
            ) : (
              <input
                type="text"
                value={modifyName}
                placeholder="이름을 입력해주세요! (최대 8글자)"
                maxLength={8}
                onChange={(e) => setModifyName(e.target.value)}
                className={`${font.fs_24} ${font.fw_7}`}
              />
            )}
            {!isModifying ? (
              <p className={`${font.fs_14} ${font.fw_7} ${font.fc_accent}`}>
                {document.userSearchID}
              </p>
            ) : (
              <input
                type="text"
                placeholder="검색 ID를 입력해주세요!"
                value={modifySearchID}
                onChange={(e) => setModifySearchID(e.target.value)}
                className={`${font.fs_14} ${font.fw_7} ${font.fc_accent}`}
              />
            )}

            {!isModifying ? (
              <p className={`${font.fs_16} ${font.fc_sub}`}>
                {document.userDesc ? document.userDesc : "자기소개가 없습니다!"}
              </p>
            ) : (
              <input
                type="text"
                value={modifyDesc}
                placeholder="자기소개를 입력해주세요! (최대 50글자)"
                maxLength={50}
                onChange={(e) => setModifyDesc(e.target.value)}
                className={`${font.fs_16} ${font.fc_sub}`}
              />
            )}
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
          {isModifying ? (
            <div className={styles.tagBox}>
              <input
                className={`${font.fs_12} ${font.fw_5}`}
                type="text"
                placeholder="태그를 입력해주세요 (Enter로 구분)"
                onKeyUp={(e) => tagInput(e)}
              />

              <div className={styles.userTagBox}>
                {modifyTags.map((item, index) => (
                  <p
                    className={`${font.fs_12} ${font.fw_7}`}
                    key={index}
                    onClick={() => removeTag(index)}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.userTagBox}>
              {document.userTag.map((item, index) => (
                <p className={`${font.fs_12} ${font.fw_7}`} key={index}>
                  {item}
                </p>
              ))}
            </div>
          )}
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
            userPostData && userPostData.length > 0 ? (
              <div className={styles.postBox}>{userPostData}</div>
            ) : (
              <div className={styles.postNone}>
                <p className={`${font.fs_24} ${font.fw_7}`}>
                  게시물이 없습니다
                </p>
                <p
                  className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}
                >
                  게시물을 등록하고 공유해보세요!
                </p>
              </div>
            )
          ) : userQnAData && userQnAData.length > 0 ? (
            <div className={styles.postBox}>{userQnAData}</div>
          ) : (
            <div className={styles.postNone}>
              <p className={`${font.fs_24} ${font.fw_7}`}>질문이 없습니다</p>
              <p
                className={`
                          ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
                        `}
              >
                질문을 등록하고 답변을 받아보세요!
              </p>
            </div>
          )}
        </div>
        {isModalOpen && (
          <MainFollow
            userID={document.userID}
            closeModal={handleModalClose}
            modalType="Profile"
          />
        )}
      </div>
    );
  }
};

export default MainProfile;
