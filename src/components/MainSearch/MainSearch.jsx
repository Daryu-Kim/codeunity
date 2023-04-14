import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  startAt,
  endAt,
} from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import styles from "./MainSearch.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { convertTimestamp, toastError } from "../../modules/Functions";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";

const MainSearch = () => {
  const [searchInput, setSearchInput] = useState(""); // 검색어 입력값과 검색어 입력값 변경 함수를 상태로 관리
  const [isSearch, setIsSearch] = useState(false); // 검색 버튼 클릭 여부를 상태로 관리
  const navigate = useNavigate(); // react-router-dom의 useNavigate hook을 사용하여 페이지 이동 함수를 변수에 할당

  const currentTime = Timestamp.fromDate(new Date()); // 현재 시간을 Timestamp 형태로 변수에 할당

  const [searchUserIDData, setSearchUserIDData] = useState([]); // 유저 ID 검색 결과를 상태로 관리
  const [searchUserNameData, setSearchUserNameData] = useState([]); // 유저 이름 검색 결과를 상태로 관리
  const [searchTagUserData, setSearchTagUserData] = useState([]); // 유저 태그 검색 결과를 상태로 관리
  const [searchTagQnAData, setSearchTagQnAData] = useState([]); // QnA 태그 검색 결과를 상태로 관리
  const [searchWordPostData, setSearchWordPostData] = useState([]); // 게시글 내용 검색 결과를 상태로 관리
  const [searchWordQnAData, setSearchWordQnAData] = useState([]); // QnA 내용 검색 결과를 상태로 관리

  const [modalPostState, setModalPostState] = useState(false); // 게시글 모달 창 열림 여부를 상태로 관리
  const [modalPostID, setModalPostID] = useState(""); // 게시글 ID를 상태로 관리
  const [modalUserID, setModalUserID] = useState(""); // 유저 ID를 상태로 관리
  const [modalType, setModalType] = useState(""); // 모달 창 타입을 상태로 관리

  // setSearchInput 함수를 호출하여 검색어를 업데이트합니다.
  const handleInputChange = ({ target: { value } }) => setSearchInput(value);

  // 입력창에서 Enter 키를 누르면 handleSearch 함수를 호출하는 이벤트 핸들러 함수
  const handleInputEnter = (e) => e.key === "Enter" && handleSearch();

  const handleSearch = async () => {
    setIsSearch(true); // 검색 모드를 활성화한다.
    setSearchUserIDData([]); // 유저 아이디 검색 결과를 초기화한다.
    setSearchUserNameData([]); // 유저 이름 검색 결과를 초기화한다.
    setSearchTagUserData([]); // 태그된 유저 검색 결과를 초기화한다.
    setSearchTagQnAData([]); // 태그된 QnA 검색 결과를 초기화한다.
    setSearchWordPostData([]); // 단어가 포함된 게시물 검색 결과를 초기화한다.
    setSearchWordQnAData([]); // 단어가 포함된 QnA 검색 결과를 초기화한다.
    if (searchInput[0] == "@") {
      // 검색어가 "@"로 시작하는 경우
      if (searchInput.substring(1) !== "") {
        // "@" 다음에 검색어가 있는 경우
        const idFilter = query(
          collection(firestore, "Users"),
          where("userSearchID", ">=", searchInput),
          where("userSearchID", "<=", searchInput + "\uf8ff")
        );
        const nameFilter = query(
          collection(firestore, "Users"),
          where("userName", ">=", searchInput.substring(1)),
          where("userName", "<=", searchInput.substring(1) + "\uf8ff")
        );
        const [idSnapshot, nameSnapshot] = await Promise.all([
          getDocs(idFilter),
          getDocs(nameFilter),
        ]);
        const idResult = idSnapshot.docs.map((doc) => doc.data());
        const nameResult = nameSnapshot.docs.map((doc) => doc.data());

        if (!idResult.length && !nameResult.length) {
          // 검색 결과가 없는 경우
          toastError("사용자 검색 결과가 없습니다!");
          setIsSearch(false);
        }

        setSearchUserIDData(
          idResult.sort((x, y) => y.followerCount - x.followerCount) // 팔로워 수를 기준으로 내림차순 정렬
        );
        setSearchUserNameData(
          nameResult.sort((x, y) => y.followerCount - x.followerCount) // 팔로워 수를 기준으로 내림차순 정렬
        );
      } else {
        // "@" 다음에 검색어가 없는 경우
        toastError("검색어를 입력해주세요!");
      }
    } else if (searchInput[0] == "#") {
      // 검색어가 "#"로 시작하는 경우
      const temp = searchInput.substring(1);
      const [userSnapshot, qnaSnapshot] = await Promise.all([
        getDocs(
          query(
            collection(firestore, "Users"),
            where("userTag", "array-contains", temp)
          )
        ),
        getDocs(
          query(
            collection(firestore, "QnAs"),
            where("postTags", "array-contains", temp)
          )
        ),
      ]);
      const userResult = userSnapshot.docs.map((doc) => doc.data());
      const qnaResult = qnaSnapshot.docs.map((doc) => doc.data());

      if (!userResult.length && !qnaResult.length) {
        // 검색 결과가 없는 경우
        toastError("태그 검색 결과가 없습니다!");
        setIsSearch(false);
      }

      setSearchTagUserData(
        userResult.sort((x, y) => y.followerCount - x.followerCount) // 팔로워 수를 기준으로 내림차순 정렬
      );
      setSearchTagQnAData(
        qnaResult.sort((x, y) => y.followerCount - x.followerCount) // 팔로워 수를 기준으로 내림차순 정렬
      );
    } else {
      // 검색어가 "@"나 "#"로 시작하지 않는 경우
      const [postSnapshot, qnaTitleSnapshot, qnaContentSnapshot] =
        await Promise.all([
          getDocs(
            query(
              collection(firestore, "Posts"),
              orderBy("postContent"),
              startAt(searchInput),
              endAt(searchInput + "~")
            )
          ),
          getDocs(
            query(
              collection(firestore, "QnAs"),
              orderBy("postTitle"),
              startAt(searchInput),
              endAt(searchInput + "~")
            )
          ),
          getDocs(
            query(
              collection(firestore, "QnAs"),
              orderBy("postContent"),
              startAt(searchInput),
              endAt(searchInput + "~")
            )
          ),
        ]);
      const postResult = postSnapshot.docs.map((doc) => doc.data());
      const qnaTitleResult = qnaTitleSnapshot.docs.map((doc) => doc.data());
      const qnaContentResult = qnaContentSnapshot.docs.map((doc) => doc.data());

      const qnaFilterArray = [
        ...new Set([...qnaTitleResult, ...qnaContentResult]), // 중복 제거
      ];

      if (!postResult.length && !qnaFilterArray.length) {
        // 검색 결과가 없는 경우
        toastError("키워드 검색 결과가 없습니다!");
        setIsSearch(false);
      }

      setSearchWordPostData(
        postResult.sort((x, y) => y.likeCount - x.likeCount) // 좋아요 수를 기준으로 내림차순 정렬
      );
      setSearchWordQnAData(
        qnaFilterArray.sort((x, y) => y.postViews - x.postViews) // 조회수를 기준으로 내림차순 정렬
      );
    }
  };

  const profileClick = (userID) => {
    // userID를 sessionStorage의 tempState에 저장
    sessionStorage.tempState = userID;
    // /profile 경로로 이동하며, state에 userID를 전달하고, 이전 페이지를 대체
    navigate("/profile", { state: userID, replace: true });
  };

  const showPostModal = (postID, userID, type) => {
    // postID, userID, type을 인자로 받아와서 각각의 state를 업데이트한다.
    setModalPostID(postID);
    setModalUserID(userID);
    setModalType(type);
    // modalPostState를 true로 변경하여 모달을 보여준다.
    setModalPostState(true);
  };

  return (
    <div className={styles.wrapper}>
      {modalPostState && (
        <div className={styles.mainCmtsModal}>
          <MainCmtsModal
            setModalState={setModalPostState}
            modalPostID={modalPostID}
            modalUserID={modalUserID}
            modalType={modalType}
          />
        </div>
      )}
      <div className={styles.box}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchInput}
            placeholder="@: 유저, #: 태그"
            onChange={(e) => handleInputChange(e)}
            onKeyUp={(e) => handleInputEnter(e)}
            className={`${font.fs_16}`}
          />
          <button onClick={(e) => handleSearch(e)}>
            <ImSearch />
          </button>
        </div>

        {searchUserNameData.length + searchUserIDData.length !== 0 && (
          <div className={styles.userBox}>
            <div className={styles.userNameBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 닉네임 검색 결과{" "}
                {searchUserNameData.length}건
              </p>
              <div className={styles.gridBox}>
                {searchUserNameData.map((item, index) => (
                  <div
                    key={index}
                    className={styles.profileBox}
                    onClick={() => profileClick(item.userID)}
                  >
                    <div
                      className={styles.profileImg}
                      style={
                        item.userImg
                          ? { backgroundImage: `url(${item.userImg})` }
                          : { backgroundImage: `url(${baseImg})` }
                      }
                    ></div>
                    <div className={styles.infoBox}>
                      <p className={`${font.fw_7} ${font.fs_14}`}>
                        {item.userName}
                      </p>
                      <p className={`${font.fs_12} ${font.fc_sub_light}`}>
                        {item.userSearchID} | 팔로워 {item.followerCount}명
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.userIDBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 ID 검색 결과{" "}
                {searchUserIDData.length}건
              </p>
              <div className={styles.gridBox}>
                {searchUserIDData.map((item, index) => (
                  <div
                    key={index}
                    className={styles.profileBox}
                    onClick={() => profileClick(item.userID)}
                  >
                    <div
                      className={styles.profileImg}
                      style={
                        item.userImg
                          ? { backgroundImage: `url(${item.userImg})` }
                          : { backgroundImage: `url(${baseImg})` }
                      }
                    ></div>
                    <div className={styles.infoBox}>
                      <p className={`${font.fw_7} ${font.fs_14}`}>
                        {item.userName}
                      </p>
                      <p className={`${font.fs_12} ${font.fc_sub_light}`}>
                        {item.userSearchID} | 팔로워 {item.followerCount}명
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {searchTagUserData.length + searchTagQnAData.length !== 0 && (
          <div className={styles.tagBox}>
            <div className={styles.tagUserBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 태그 검색 결과{" "}
                {searchTagUserData.length}건
              </p>
              <div className={styles.gridBox}>
                {searchTagUserData.map((item, index) => (
                  <div
                    key={index}
                    className={styles.profileBox}
                    onClick={() => profileClick(item.userID)}
                  >
                    <div
                      className={styles.profileImg}
                      style={
                        item.userImg
                          ? { backgroundImage: `url(${item.userImg})` }
                          : { backgroundImage: `url(${baseImg})` }
                      }
                    ></div>
                    <div className={styles.infoBox}>
                      <p className={`${font.fw_7} ${font.fs_14}`}>
                        {item.userName}
                      </p>
                      <p className={`${font.fs_12} ${font.fc_sub_light}`}>
                        {item.userSearchID} | 팔로워 {item.followerCount}명
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 QnA 태그 검색 결과{" "}
                {searchTagQnAData.length}건
              </p>
              <div className={styles.postBox}>
                {searchTagQnAData.map((item, index) => (
                  <div
                    className={styles.postItem}
                    key={index}
                    onClick={() =>
                      showPostModal(item.postID, item.userID, "QnAs")
                    }
                  >
                    <p className={`${font.fs_18} ${font.fw_7}`}>
                      {item.postTitle}
                    </p>
                    <p
                      className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}
                    >
                      자세한 내용을 확인하려면 클릭하세요
                    </p>
                    <div className={styles.qnaTagBox}>
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
        )}

        {searchWordPostData.length + searchWordQnAData.length !== 0 && (
          <div className={styles.tagBox}>
            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 게시물 키워드 검색 결과{" "}
                {searchWordPostData.length}건
              </p>
              <div className={styles.postBox}>
                {searchWordPostData.map((item, index) => (
                  <div
                    className={styles.postItem}
                    key={index}
                    onClick={() =>
                      showPostModal(item.postID, item.userID, "Posts")
                    }
                  >
                    <p className={`${font.fs_18} ${font.fw_7}`}>
                      {item.postContent.length < 40
                        ? item.postContent
                        : item.postContent.substring(0, 40) + "..."}
                    </p>
                    <p
                      className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}
                    >
                      자세한 내용을 확인하려면 클릭하세요
                    </p>
                    <div className={styles.funcBox}>
                      <div className={styles.leftBox}>
                        <p
                          className={`${font.fs_12} ${font.fw_5} ${font.fc_sub_light}`}
                        >
                          좋아요 {item.likeCount}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 QnA 키워드 검색 결과{" "}
                {searchWordQnAData.length}건
              </p>
              <div className={styles.postBox}>
                {searchWordQnAData.map((item, index) => (
                  <div
                    className={styles.postItem}
                    key={index}
                    onClick={() =>
                      showPostModal(item.postID, item.userID, "QnAs")
                    }
                  >
                    <p className={`${font.fs_18} ${font.fw_7}`}>
                      {item.postTitle}
                    </p>
                    <p
                      className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}
                    >
                      자세한 내용을 확인하려면 클릭하세요
                    </p>
                    <div className={styles.qnaTagBox}>
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
        )}

        {!isSearch && (
          <p className={`${font.fs_24} ${font.fw_7} ${font.fc_sub_light}`}>
            검색할 내용을 입력해주세요!
          </p>
        )}
      </div>
    </div>
  );
};
export default MainSearch;
