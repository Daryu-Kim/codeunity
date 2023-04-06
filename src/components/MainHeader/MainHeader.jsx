import React, { useEffect, useState } from "react";
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import "swiper/css/free-mode";
import 'swiper/css';
import { getDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../modules/Firebase";

const MainHeader = () => {
  const [path, setPath] = useState(null);
  const [tabIndexList, setTabIndexList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [tabList, setTabList] = useState([]);
  const [tabListData, setTabListData] = useState(null);

  useEffect(() => {
    const checkExistsTab = () => {
      let count = 0;
      tabList.forEach((element) => {
        console.log(element.pathName);
        if (element.pathName == location.pathname) {
          count++;
        }
      });
      if (count > 0) {
        return true;
      } else {
        return false;
      }
    };

    const fetchData = async () => {
      if (location.pathname !== "/") {
        if (!checkExistsTab()) {
          const pathName = location.pathname;
          const docName = pathName.substring(1);
          const tempTabList = [...tabList];
          const tempDoc = await getDoc(doc(firestore, "Settings", docName));

          await tempTabList.push({
            pathName: tempDoc.data().pathName,
            displayName: tempDoc.data().displayName,
            icon: tempDoc.data().icon,
          });

          await setTabList(tempTabList);
        }
      }
      // }
    };

    const tempTabList = [];

    setPath(location.pathname);
    fetchData();
    setTabIndexList(() => {
      tabList.forEach((element, index) => {
        tempTabList[index] = element.pathName == path;
      });
      return tempTabList;
    });
    console.log(tabIndexList)
  }, [location.pathname]);


  useEffect(() => {
    if (tabList !== undefined && path !== undefined) {
      setTabListData(
        tabList.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`
              ${tabList[index].pathName == path ? styles.active : null}
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
            <p className={`${font.fs_14} ${font.fw_7} ${font.f_code}`}>{item.displayName}</p>
            <button onClick={(event) => removeTab(event, item.pathName, index)}>X</button>
          </SwiperSlide>
        ))
      )
    }
  }, [tabList, tabIndexList])

  const removeTab = (event, pathName, index) => {
    event.stopPropagation();
    if (location.pathname == pathName) {
      navigate("/", {replace: true});
      console.log("boom")
    }
    const tempTabList = [...tabList];
    tempTabList.splice(index, 1);
    setTabList(tempTabList);
  };

  const movePath = (event, pathName, param) => {
    event.stopPropagation();
    navigate(pathName, {replace: true, state: param});
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
          onClick={(event) => {
            movePath(event, "/");
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
