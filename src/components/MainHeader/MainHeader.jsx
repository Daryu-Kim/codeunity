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
  const [tabListData, setTabListData] = useState(null);

  useEffect(() => {
    if (location.pathname !== "/") {
      if (path !== location.pathname && !tabList.includes(path)) {
        const pathName = location.pathname;
        const docName = pathName.substring(1);
        const tempTabList = [...tabList];
        const fetchData = async () => {
          const tempDoc = await getDoc(doc(firestore, "Settings", docName));
          
          tempTabList.push({
            pathName: tempDoc.data().pathName,
            displayName: tempDoc.data().displayName,
            icon: tempDoc.data().icon,
          });

          setTabList(tempTabList);
          setPath(location.pathname);
        };
        fetchData();
      }
    } else {
      setPath(location.pathname);
    }
    console.log(location)
  }, [location]);


  useEffect(() => {
    if (tabList !== undefined) {
      setTabListData(
        tabList.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`
              ${path === item.pathName ? styles.active : null}
            `}
            id={styles.tabMenu}
            onClick={(event) => {
              movePath(event, item.pathName);
            }}
          >
            <FontAwesomeIcon
              className={`${font.fs_14} ${font.fc_accent}`}
              icon={item.icon}
            />
            <p className={`${font.fs_14} ${font.fw_7}`}>{item.displayName}</p>
            <button onClick={(event) => removeTab(event, item.pathName, index)}>X</button>
          </SwiperSlide>
        ))
      )
    }
  }, [tabList])

  const removeTab = (event, pathName, index) => {
    event.stopPropagation();
    if (location.pathname == pathName) {
      navigate("/", {replace: true});
      console.log("boom")
    }
    console.log(location.pathname == pathName)
    const tempTabList = [...tabList];
    tempTabList.splice(index, 1);
    setTabList(tempTabList);
  };

  const movePath = (event, pathName, param) => {
    event.stopPropagation();
    if (location.pathname != pathName) {
      navigate(pathName, {replace: true, state: param});
    }
  }
  

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
        {tabListData}
      </Swiper>
    </div>
  );
};

export default MainHeader;
