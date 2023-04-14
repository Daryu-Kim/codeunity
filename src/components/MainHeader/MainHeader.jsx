import React, { useEffect, useState } from "react";
import styles from "./MainHeader.module.scss";
import font from "../../styles/Font.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import "swiper/css/free-mode";
import 'swiper/css';
import { AiOutlineCloseSquare } from "react-icons/ai";
import { getDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../modules/Firebase";

const MainHeader = () => {
  // path와 setPath를 선언하고 null로 초기화
  const [path, setPath] = useState(null);
  // tabIndexList와 setTabIndexList를 선언하고 빈 배열로 초기화
  const [tabIndexList, setTabIndexList] = useState([]);
  // navigate를 useNavigate로 선언
  const navigate = useNavigate();
  // location을 useLocation으로 선언
  const location = useLocation();
  // tabList와 setTabList를 선언하고 빈 배열로 초기화
  const [tabList, setTabList] = useState([]);
  // tabListData와 setTabListData를 선언하고 null로 초기화
  const [tabListData, setTabListData] = useState(null);

  useEffect(() => {
    // 탭이 존재하는지 확인하는 함수
    const checkExistsTab = () => {
      let count = 0;
      tabList.forEach((element) => {
        if (element.pathName === location.pathname) {
          count++;
        }
      });
      return count > 0;
    };

    // 데이터를 가져오는 함수
    const fetchData = async () => {
      if (location.pathname !== "/") {
        // 탭이 존재하지 않으면
        if (!checkExistsTab()) {
          const tempState = sessionStorage.getItem("tempState");
          const pathName = location.pathname;
          const docName = pathName.substring(1);
          const tempTabList = [...tabList];
          // Firestore에서 문서 가져오기
          const tempDoc = await getDoc(doc(firestore, "Settings", docName));
          // 탭 리스트에 추가
          tempTabList.push({
            pathName: tempDoc.data().pathName,
            displayName: tempDoc.data().displayName,
            icon: tempDoc.data().icon,
            state: tempState,
          });
          setTabList(tempTabList);
        }
      }
    };

    // 현재 경로 설정
    setPath(location.pathname);
    // 데이터 가져오기
    fetchData();
    // 탭 인덱스 리스트 설정
    setTabIndexList(() => tabList.map((element) => element.pathName === path));
  }, [location.pathname]);

  // useEffect hook을 사용하여 tabList와 path가 정의되어 있을 때 실행되는 함수
  useEffect(() => {
    // tabList와 path가 undefined가 아닐 때
    if (tabList !== undefined && path !== undefined) {
      // tabList를 map 함수를 사용하여 SwiperSlide로 변환하여 setTabListData에 저장
      setTabListData(
        tabList.map((item, index) => (
          // SwiperSlide 컴포넌트
          <SwiperSlide
            key={index}
            // 현재 path와 tabList의 pathName이 같으면 active 클래스 추가
            className={`${
              tabList[index].pathName == path ? styles.active : null
            }`}
            id={styles.tabMenu}
            // 클릭 시 movePath 함수 실행
            onClick={(event) => movePath(event, item.pathName, item.state)}
          >            
            <img src={item.icon} alt="" />
            <p className={`${font.fs_14} ${font.fw_7}`}>
              {item.displayName}
            </p>
            <button
              className={styles.xBtn}
              onClick={(event) => removeTab(event, item.pathName, index)}
            >
              <AiOutlineCloseSquare />
            </button>
          </SwiperSlide>
        ))
      );
    }
  }, [tabList, tabIndexList]);

  const removeTab = (event, pathName, index) => {
    event.stopPropagation(); // 이벤트 전파를 막는다.
    if (location.pathname === pathName) {
      // 현재 경로와 삭제할 탭의 경로가 같으면
      navigate("/", { replace: true }); // 루트 경로로 이동한다.
    }
    setTabList(tabList.filter((_, i) => i !== index)); // 탭 리스트에서 해당 인덱스를 제외한 새로운 리스트를 만들어 설정한다.
  };

  const movePath = (e, path, param) => {
    // 이벤트 전파 중지
    e.stopPropagation();
    // path로 이동하고, state에 param 전달
    navigate(path, { replace: true, state: param });
  };

  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={"auto"} // 슬라이드 한 개당 보여질 영역 설정
        freeMode={true} // 슬라이드가 스무스하게 이동하도록 자유 모드 설정
        modules={[FreeMode]} // FreeMode 모듈 사용
        className={`${styles.menu} ${font.fs_12} ${font.fc_primary} ${font.fw_4}`} // 스타일링 클래스 추가
      >
        <SwiperSlide
          className={`${path === "/" ? styles.active : null}`} // 현재 경로가 '/'인 경우 active 클래스 추가
          id={styles.tabMenu} // 스타일링을 위한 id 추가
          onClick={(event) => movePath(event, "/")} // 클릭 시 '/' 경로로 이동하는 함수 호출
        >
          <FontAwesomeIcon
            className={`${font.fs_14} ${font.fc_accent}`} // 아이콘 스타일링 클래스 추가
            icon={faHouse} // 아이콘 설정
          />
          <p className={`${font.fs_14} ${font.fw_7}`}>HOME.jsx</p>
          {/* // 텍스트 스타일링 클래스 추가 */}
        </SwiperSlide>
        {tabListData}
        {/* // 동적으로 생성되는 탭 메뉴 리스트 */}
      </Swiper>
    </div>
  );
};

export default MainHeader;
