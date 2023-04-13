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
import baseImg from "../../assets/svgs/352174_user_icon.svg"
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { convertTimestamp, toastError } from "../../modules/Functions";
import MainCmtsModal from "../MainCmtsModal/MainCmtsModal";

const MainSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();
  const currentTime = Timestamp.fromDate(new Date());

  const [searchUserIDData, setSearchUserIDData] = useState([]);
  const [searchUserNameData, setSearchUserNameData] = useState([]);
  const [searchTagUserData, setSearchTagUserData] = useState([]);
  const [searchTagQnAData, setSearchTagQnAData] = useState([]);
  const [searchWordPostData, setSearchWordPostData] = useState([]);
  const [searchWordQnAData, setSearchWordQnAData] = useState([]);

  const [modalPostState, setModalPostState] = useState(false);
  const [modalPostID, setModalPostID] = useState("");
  const [modalUserID, setModalUserID] = useState("");
  const [modalType, setModalType] = useState("");

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleInputEnter = (e) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  }

  const handleSearch = async () => {
    setIsSearch(true)
    setSearchUserIDData([])
    setSearchUserNameData([])
    setSearchTagUserData([])
    setSearchTagQnAData([])
    setSearchWordPostData([])
    setSearchWordQnAData([])
    if (searchInput[0] == "@") {
      if (searchInput.substring(1) !== "") {
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
      const idSnapshot = await getDocs(idFilter);
      const nameSnapshot = await getDocs(nameFilter);
      const idResult = idSnapshot.docs.map((doc) => doc.data());
      const nameResult = nameSnapshot.docs.map((doc) => doc.data());

      if (idResult.length + nameResult.length === 0) {
        toastError("사용자 검색 결과가 없습니다!")
        setIsSearch(false)
      }

      setSearchUserIDData(idResult.sort((x, y) => y.followerCount - x.followerCount));
      setSearchUserNameData(nameResult.sort((x, y) => y.followerCount - x.followerCount));
      } else {
        toastError("검색어를 입력해주세요!")
      }
    }
    
    else if (searchInput[0] == "#") {
      const temp = searchInput.substring(1);
      const userFilter = query(
        collection(firestore, "Users"),
        where("userTag", "array-contains", temp)
      );
      const qnaFilter = query(
        collection(firestore, "QnAs"),
        where("postTags", "array-contains", temp)
      );
      const userSnapshot = await getDocs(userFilter);
      const qnaSnapshot = await getDocs(qnaFilter);
      const userResult = userSnapshot.docs.map((doc) => doc.data());
      const qnaResult = qnaSnapshot.docs.map((doc) => doc.data());
      
      if (userResult.length + qnaResult.length === 0) {
        toastError("태그 검색 결과가 없습니다!")
        setIsSearch(false)
      }

      setSearchTagUserData(userResult.sort((x, y) => y.followerCount - x.followerCount));
      setSearchTagQnAData(qnaResult.sort((x, y) => y.followerCount - x.followerCount));
    }
    
    else {
      //  검색 필터
      const postFilter = query(
        collection(firestore, "Posts"),
        orderBy("postContent"),
        startAt(searchInput),
        endAt(searchInput + "~"),
        // where("postContent", ">=", searchInput),
        // where("postContent", "<=", searchInput + "\uf8ff")
      );
      const qnaTitleFilter = query(
        collection(firestore, "QnAs"),
        orderBy("postTitle"),
        startAt(searchInput),
        endAt(searchInput + "~"),
        // where("postTitle", ">=", searchInput),
        // where("postTitle", "<=", searchInput + "\uf8ff")
      );
      const qnaContentFilter = query(
        collection(firestore, "QnAs"),
        orderBy("postContent"),
        startAt(searchInput),
        endAt(searchInput + "~"),
        // where("postContent", ">=", searchInput),
        // where("postContent", "<=", searchInput + "\uf8ff")
      );
      // 검색
      const postSnapshot = await getDocs(postFilter);
      const qnaTitleSnapshot = await getDocs(qnaTitleFilter);
      const qnaContentSnapshot = await getDocs(qnaContentFilter);
      // 값 추출
      const postResult = postSnapshot.docs.map((doc) => doc.data());
      const qnaTitleResult = qnaTitleSnapshot.docs.map((doc) => doc.data());
      const qnaContentResult = qnaContentSnapshot.docs.map((doc) => doc.data());

      console.log(postResult, qnaTitleResult, qnaContentResult)

      const qnaFilterArray = [];
      qnaTitleResult.forEach((data) => {
        if (!qnaFilterArray.includes(data)) {
          qnaFilterArray.push(data);
        }
      })
      qnaContentResult.forEach((data) => {
        if (!qnaFilterArray.includes(data)) {
          qnaFilterArray.push(data);
        }
      })

      if (postResult.length + qnaFilterArray.length === 0) {
        toastError("키워드 검색 결과가 없습니다!")
        setIsSearch(false)
      }

      // 데이터 저장
      setSearchWordPostData(postResult.sort((x, y) => y.likeCount - x.likeCount))
      setSearchWordQnAData(qnaFilterArray.sort((x, y) => y.postViews - x.postViews))
    }
  };

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
  };

  const showPostModal = (postID, userID, type) => {
    setModalPostID(postID);
    setModalUserID(userID);
    setModalType(type);
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
          <button onClick={(e) => handleSearch(e)} >
            <ImSearch />
          </button>
        </div>
        
      {
        searchUserNameData.length + searchUserIDData.length !== 0 && (
          <div className={styles.userBox}>
            <div className={styles.userNameBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 닉네임 검색 결과 {searchUserNameData.length}건
              </p>
              <div className={styles.gridBox}>
                {
                  searchUserNameData.map((item, index) => (
                    <div key={index} className={styles.profileBox} onClick={() => profileClick(item.userID)}>
                      <div
                        className={styles.profileImg}
                        style={
                          item.userImg ?
                          {backgroundImage: `url(${item.userImg})`} :
                          {backgroundImage: `url(${baseImg})`}
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
                  ))
                }
              </div>
            </div>

            <div className={styles.userIDBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 ID 검색 결과 {searchUserIDData.length}건
              </p>
              <div className={styles.gridBox}>
                {
                  searchUserIDData.map((item, index) => (
                    <div key={index} className={styles.profileBox} onClick={() => profileClick(item.userID)}>
                      <div
                        className={styles.profileImg}
                        style={
                          item.userImg ?
                          {backgroundImage: `url(${item.userImg})`} :
                          {backgroundImage: `url(${baseImg})`}
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
                  ))
                }
              </div>
            </div>
          </div>
        )
      }
      {
        searchTagUserData.length + searchTagQnAData.length !== 0 && (
          <div className={styles.tagBox}>
            <div className={styles.tagUserBox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 사용자 태그 검색 결과 {searchTagUserData.length}건
              </p>
              <div className={styles.gridBox}>
                {
                  searchTagUserData.map((item, index) => (
                    <div key={index} className={styles.profileBox} onClick={() => profileClick(item.userID)}>
                      <div
                        className={styles.profileImg}
                        style={
                          item.userImg ?
                          {backgroundImage: `url(${item.userImg})`} :
                          {backgroundImage: `url(${baseImg})`}
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
                  ))
                }
              </div>
            </div>

            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 QnA 태그 검색 결과 {searchTagQnAData.length}건
              </p>
              <div className={styles.postBox}>
                {
                  searchTagQnAData.map((item, index) => (
                    <div
                  className={styles.postItem}
                  key={index}
                  onClick={() => showPostModal(item.postID, item.userID, "QnAs")}
                >
                  <p className={`${font.fs_18} ${font.fw_7}`}>
                    {item.postTitle}
                  </p>
                  <p className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}>
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
                  ))
                }
              </div>
            </div>
          </div>
        )
      }

      {
        searchWordPostData.length + searchWordQnAData.length !== 0 && (
          <div className={styles.tagBox}>
            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 게시물 키워드 검색 결과 {searchWordPostData.length}건
              </p>
              <div className={styles.postBox}>
                {
                  searchWordPostData.map((item, index) => (
                    <div
                  className={styles.postItem}
                  key={index}
                  onClick={() => showPostModal(item.postID, item.userID, "Posts")}
                >
                  <p className={`${font.fs_18} ${font.fw_7}`}>
                    {
                      item.postContent.length < 40 ?
                      item.postContent :
                      item.postContent.substring(0, 40) + "..."
                    }
                  </p>
                  <p className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}>
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
                  ))
                }
              </div>
            </div>

            <div className={styles.tagQnABox}>
              <p className={`${font.fs_20} ${font.fw_7}`}>
                "{searchInput}"에 대한 QnA 키워드 검색 결과 {searchWordQnAData.length}건
              </p>
              <div className={styles.postBox}>
                {
                  searchWordQnAData.map((item, index) => (
                    <div
                  className={styles.postItem}
                  key={index}
                  onClick={() => showPostModal(item.postID, item.userID, "QnAs")}
                >
                  <p className={`${font.fs_18} ${font.fw_7}`}>
                    {item.postTitle}
                  </p>
                  <p className={`${font.fs_14} ${font.fc_accent} ${font.fw_5}`}>
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
                  ))
                }
              </div>
            </div>
          </div>
        )
      }
      
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
