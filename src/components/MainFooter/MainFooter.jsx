import React, { useRef } from 'react'
import styles from "./MainFooter.module.scss";
import font from "../../styles/Font.module.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const MainFooter = () => {
  return (
    <div className={styles.mainFooter}>
      <Swiper
        slidesPerView={1}
      >
        <SwiperSlide className={styles.mainFooterList}>
          Slide1
        </SwiperSlide>
        <SwiperSlide className={styles.mainFooterList}>
          Slide2
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default MainFooter