import React, { useState } from "react";
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import "swiper/css/free-mode";
import 'swiper/css';
import { useNavigate } from "react-router-dom";

const menuArr = [
  { id: 0, name: "HOME.jsx", content: faHouse, navigate: "/" },
  { id: 1, name: "개발자 QnA.jsx", content: faCircleQuestion, navigate: "/qna" },
  { id: 2, name: "문의하기.jsx", content: faEnvelope, navigate: "" },
];

const MainHeader = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={'auto'}
        freeMode={true}
        modules={[FreeMode]}
        className={`${styles.menu} ${font.fs_12} ${font.fc_primary} ${font.fw_4}`}
      >
        {menuArr.map((item) => {
          return (
            <SwiperSlide
              key={item.id}
              className={`
                ${index === item.id ? styles.active : null}
              `}
              id={styles.tabMenu}
              onClick={() => {
                setIndex(item.id);
                navigate(item.navigate, {
                  replace: true
                });
              }}
            >
              <FontAwesomeIcon
                className={`${font.fs_14} ${font.fc_accent}`}
                icon={item.content}
              />
              <p className={font.fs_14}>{item.name}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainHeader;
