import React, { useState } from "react";
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import logo from "./임시로고.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faComments,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import "swiper/css/free-mode";
import 'swiper/css';

const menuArr = [
  { id: 0, name: "HOME.jsx", content: faHouse },
  { id: 1, name: "개발자 QnA.jsx", content: faCircleQuestion },
  { id: 2, name: "문의하기.jsx", content: faEnvelope },
];

const MainHeader = () => {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  const profileImgClick = (userID) => {
    navigate("/profile", {
      state: userID,
      replace: true,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoBox}>
        <img src={logo} className={styles.logo} />
      </div>
      <Swiper
        slidesPerView={'auto'}
        freeMode={true}
        modules={[FreeMode]}
        className={`${styles.leftMenu} ${font.fs_12} ${font.fc_primary} ${font.fw_4}`}
      >
        {menuArr.map((item) => {
          return (
            <SwiperSlide
              key={item.id}
              className={styles.tabMenu}
              // className={`${styles.tabMenu} ${
              //   index === item.id ? styles.active : null
              // }`}
              onClick={() => {
                setIndex(item.id);
              }}
            >
              <FontAwesomeIcon
                className={`${font.fs_14} ${font.fc_accent}`}
                icon={item.content}
              />
              {item.name}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className={styles.rightMenu}>
        <FontAwesomeIcon
          icon={faComments}
          className={`${styles.navIcon} ${font.fs_28} ${font.fc_accent}`}
        />
        <div className={styles.myProfile} onClick={profileImgClick}></div>
      </div>
    </div>
  );
};

export default MainHeader;
