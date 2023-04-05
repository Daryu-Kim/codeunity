import React, { useEffect, useState } from "react";
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
import { getDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../modules/Firebase";

const MainHeader = () => {
  const [index, setIndex] = useState(0);
  const [path, setPath] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tabList, setTabList] = useState([]);
  const tempTabList = [];

  useEffect(() => {
    if (location.pathname !== "/") {
      const pathName = location.pathname;
      const docName = pathName.substring(1);
      const fetchData = async () => {
        const tempDoc = await getDoc(doc(firestore, "Settings", docName));
        
        tempTabList.push({
          pathName: tempDoc.data().pathName,
        });

        setPath(location.pathname);
      };
      fetchData();
    } else {
      setPath(location.pathname);
    }
    
    // console.log(docName)
    // if (tabItem === location.pathname) {
    //   setPath()
    // } else {
      
    // }
    
    // setPath(location.pathname);
    
  }, [location.pathname])
  

  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={'auto'}
        freeMode={true}
        modules={[FreeMode]}
        className={`${styles.menu} ${font.fs_12} ${font.fc_primary} ${font.fw_4}`}
      >
        <SwiperSlide
          className={`
            ${path === "/" ? styles.active : null}
          `}
          id={styles.tabMenu}
          onClick={() => {
            navigate("/", {
              replace: true
            });
          }}
        >
          <FontAwesomeIcon
            className={`${font.fs_14} ${font.fc_accent}`}
            icon={faHouse}
          />
          <p className={`${font.fs_14} ${font.fw_7}`}>HOME.jsx</p>
        </SwiperSlide>
        {/* {menuArr.map((item) => {
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
              <p className={`${font.fs_14} ${font.fw_7}`}>{item.name}</p>
            </SwiperSlide>
          );
        })} */}
      </Swiper>
    </div>
  );
};

export default MainHeader;
