import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import styles from "./MainSearch.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg"
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const MainSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const [searchUserData, setSearchUserData] = useState([]);
  const [searchTagUserData, setSearchTagUserData] = useState([]);
  const [searchTagQnAData, setSearchTagQnAData] = useState([]);

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
    setSearchUserData([])
    setSearchTagUserData([])
    setSearchTagQnAData([])
    if (searchInput[0] == "@") {
      const filter = query(
        collection(firestore, "Users"),
        where("userSearchID", "==", searchInput),
        orderBy("followerCount", "desc")
      );
      const snapshot = await getDocs(filter);
      const result = snapshot.docs.map((doc) => doc.data());
      setSearchUserData(result);
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
      console.log(userResult, qnaResult);
      setSearchTagUserData(userResult);
      setSearchTagQnAData(qnaResult);
    }
    
    else {

    }
  };

  const profileClick = (
    userID // profileClick 함수 선언, 매개변수로 userID 전달
  ) => {
    sessionStorage.setItem("tempState", userID);
    navigate("/profile", { state: userID, replace: true });
  };

  return (
    <div className={styles.wrapper}>
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
        searchUserData.length !== 0 && (
          <div className={styles.userBox}>
            <p className={`${font.fs_20} ${font.fw_7}`}>
              "{searchInput}"에 대한 사용자 검색 결과 {searchUserData.length}건
            </p>
            <div className={styles.gridBox}>
              {
                searchUserData.map((item, index) => (
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
        )
      }
      {
        searchTagUserData.length !== 0 && (
          <div className={styles.userBox}>
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
        )
      }
      {
        searchTagQnAData.length !== 0 && (
          <div className={styles.userBox}>
            <p className={`${font.fs_20} ${font.fw_7}`}>
              "{searchInput}"에 대한 QnA 태그 검색 결과 {searchTagQnAData.length}건
            </p>
            <div className={styles.gridBox}>
              {
                searchTagQnAData.map((item, index) => (
                  <div key={index} className={styles.profileBox} onClick={() => profileClick(item.userID)}>
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
