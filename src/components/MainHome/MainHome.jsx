import React, { useEffect, useState } from "react";
import styles from "./MainHome.module.scss";
import font from "../../styles/Font.module.scss";
import baseImg from "../../assets/svgs/352174_user_icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faFont,
  faImage,
  faLink,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "@firebase/auth";
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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css";
import MainPQModal from "../MainPQModal/MainPQModal";
import MarkdownPreview from "@uiw/react-markdown-preview";

const blockBoxData = [
  { icon: faFont, title: "텍스트" },
  { icon: faImage, title: "이미지" },
  { icon: faVideo, title: "비디오" },
  { icon: faLink, title: "링크" },
  { icon: faCode, title: "코드" },
];

const MainHome = () => {
  const auth = getAuth();
  const firestore = getFirestore();
  const uid = localStorage.getItem("uid");
  const [document, loading, error, snapshot] = useDocumentData(
    doc(firestore, "Users", uid)
  );
  const handleResize = () => {
    setHtmlWidth(window.innerWidth);
  };
  console.log(document);
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

  const [allPost, allPostLoad, allPostError] = useCollectionData(
    query(
      collection(firestore, "Posts"),
      orderBy("createdAt", "desc")
      // where("userID", "!=", uid)
    )
  );

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

  const [postUser, setPostUser] = useState(null);
  useEffect(() => {
    if (allPost != undefined) {
      setPostData(
        allPost.map((item, index) => {
          getDoc(doc(collection(firestore, "Users"), item.userID))
          .then((document) => {
            setPostUser(document.data());
          });
          
          if (postUser && postData) {
            return (
            <div className={styles.postItem} key={index}>
              <div className={styles.topBox}>
                <div className={styles.topLeftBox}>
                  <div
                    className={styles.profileImg}
                    style={
                      postUser.userImg != ""
                        ? { backgroundImage: `url(${postUser.userImg})` }
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
                    {postUser.userName}
                  </p>
                </div>
                <div className={styles.topRightBox}>
                  <button className={styles.followBtn}>팔로우</button>
                </div>
              </div>
              <p>{item.postTitle}</p>
              <MarkdownPreview source={item.postContent} />
            </div>
          );
          }
          
        })
      );
    }
  }, [allPost]);

  const profileClick = (userID) => {
    navigate("/profile", {
      state: userID,
      replace: true,
    });
  };

  const showModal = () => {
    setModalState(true);
  };

  const renderBlockData = () => {
    const mapBlockData = blockBoxData.map((item, index) => {
      return (
        <div className={styles.writePostBlockItem} key={index}>
          <FontAwesomeIcon
            className={`${font.fc_accent} ${font.fs_20}`}
            icon={item.icon}
          />
          <p
            className={`${font.fs_14} ${font.fw_5} ${font.fc_sub_semi_light} ${styles.postBlockTitle}`}
          >
            {item.title}
          </p>
        </div>
      );
    });
    return mapBlockData;
  };

  const renderPostData = () => {};

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
            <hr className={styles.hr} />
            <div className={styles.writePostBlockBox}>{renderBlockData()}</div>
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
