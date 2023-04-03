import { useEffect, useState } from "react";
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { getAuth } from "@firebase/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";
import MainPQModal from "../MainPQModal/MainPQModal";
import MarkdownPreview from "@uiw/react-markdown-preview";

const MainHome = () => {
  const firestore = getFirestore();
  const uid = localStorage.getItem("uid");
  const [document, loading, error, snapshot] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  const handleResize = () => {
    setHtmlWidth(window.innerWidth);
  };
  // console.log(document);
  const [userName, setUserName] = useState(null);
  const [htmlWidth, setHtmlWidth] = useState(0);
  const [postData, setPostData] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [modalState, setModalState] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (document) {
      setUserName(document.userName);
    }
  }, [document]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [popularUser, popularUserLoad, popularUserError] = useCollectionData(
    query(
      collection(firestore, "Users"),
      orderBy("followerCount", "desc"),
      limit(10)
    )
  );

  if (popularUserLoad) console.log("Popular User Loading...");
  if (popularUserError) console.log("Popular User Error: ", popularUserError);
  if (popularUser) console.log("Popular User Get!: ", popularUser);


  const [allPost, allPostLoad, allPostError] = useCollectionData(
    query(
      collection(firestore, "Posts"),
      orderBy("createdAt", "desc")
    )
  );

  if (allPostLoad) console.log("All Posts Loading...");
  if (allPostError) console.log("All Posts Error: ", allPostError);
  if (allPost) console.log("All Posts Get!: ", allPost);

  const [postUserName, setPostUserName] = useState([]);
  const [postUserImg, setPostUserImg] = useState([]);
  const [postUserFollower, setPostUserFollower] = useState([]);
  const [existsUserData, setExistsUserData] = useState(false);
  const [existsUserFollowerData, setExistsUserFollowerData] = useState(false);

  useEffect(() => {
    console.log(popularUser);
    if (popularUser != undefined) {
      setPopularData(
        popularUser.map((item, index) => {
          console.log(index);
          return (
            <SwiperSlide
              id={styles.popularItem}
              key={index}
              onClick={() => profileClick(item.userID)}
            >
              <div
                className={styles.profileImg}
                style={
                  item.userImg != ""
                    ? { backgroundImage: `url(${item.userImg})` }
                    : { backgroundImage: `url(${baseImg})` }
                }
              ></div>
              <p
                className={`
                  ${styles.profileName}
                  ${font.fs_16}
                  ${font.fw_5}
                `}
              >
                {item.userName}
              </p>
              <p
                className={`
                  ${styles.profileDesc}
                  ${font.fs_12}
                  ${font.fw_4}
                  ${font.fc_sub}
                `}
              >
                {item.userDesc ? item.userDesc : `자기소개가 없습니다!`}
              </p>
              <button
                className={`
                  ${styles.followBtn}
                  ${font.fs_14}
                  ${font.fw_7}
                `}
              >
                팔로우
              </button>
            </SwiperSlide>
          );
        })
      );
    }
  }, [popularUser]);

  useEffect(() => {
    if (allPost) {
      const arrPostUserName = [...postUserName];
      const arrPostUserImg = [...postUserImg];
      const arrPostUserFollower = [...postUserFollower];
      function fetchData() {
        allPost.map(async (item, index) => {
          await getDoc(doc(firestore, "Users", item.userID))
            .then((result) => {
              arrPostUserName[index] = result.data().userName;
              arrPostUserImg[index] = result.data().userImg;
              setExistsUserData(true);
            })
            .catch(() => {
              setExistsUserData(false);
            });

          await getDoc(doc(firestore, `Follows/${item.userID}/Followers`, uid))
            .then((result) => {
              console.log(result.data())
              if (result.data() != undefined) {
                arrPostUserFollower[index] = true;
              } else {
                arrPostUserFollower[index] = false;
              }
              setExistsUserFollowerData(true)
            })
            .catch(() => {
              setExistsUserFollowerData(false)
            });
        })
        setPostUserName(arrPostUserName);
        setPostUserImg(arrPostUserImg);
        setPostUserFollower(arrPostUserFollower);
      }
      fetchData();
    }
  }, [allPost]);

  useEffect(() => {
    if (allPost && existsUserData && existsUserFollowerData) {
      setPostData(
        allPost.map((item, index) => {
        return (
          <div className={styles.postItem} key={index}>
            <div className={styles.topBox}>
              <div className={styles.topLeftBox}>
                <div
                  className={styles.profileImg}
                  style={
                    postUserImg[index] != ""
                      ? { backgroundImage: `url(${postUserImg[index]})` }
                      : { backgroundImage: `url(${baseImg})` }
                  }
                ></div>
                <p
                  className={`
                    ${styles.profileName}
                    ${font.fs_16}
                    ${font.fw_5}
                  `}
                >
                  {postUserName[index] ? postUserName[index] : "undefined"}
                </p>
              </div>
              {
                item.userID == uid
                  ? postUserFollower[index]
                    ? null
                    : null
                  : (
                      <div className={styles.topRightBox}>
                        <button className={styles.followBtn}>팔로우</button>
                      </div>
                    )
              }
            </div>
            <div className={styles.postBox}>
              
            </div>
            <MarkdownPreview
              className={styles.postContent}
              source={item.postContent}
              style={
                {
                  padding: 8,
                  aspectRatio: 4 / 3,
                }
              }
            />
          </div>
        );
      })
      )
      
    }
  }, [allPost, existsUserData, existsUserFollowerData]);

  const profileClick = (userID) => {
    navigate("/profile", {
      state: userID,
      replace: true,
    });
  };

  const showModal = () => {
    setModalState(true);
  };

  if (document) {
    return (
      <div className={styles.wrapper}>
        {modalState && <MainPQModal setModalState={setModalState} />}
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
            <p
              className={`
                ${font.fs_18}
                ${font.fw_7}
              `}
            >
              인기 프로필을 팔로우해보세요!
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
      </div>
    );
  }
};

export default MainHome;
