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
  // |이 코드는 React 함수형 컴포넌트에서 useState와 useNavigate, useLocation 훅을 사용하여 상태와 라우팅을 관리하는 예시입니다.
  // |
  // |좋은 점:
  // |- useState를 사용하여 컴포넌트 내부에서 상태를 관리하고 있습니다. 이를 통해 컴포넌트가 렌더링될 때마다 상태를 초기화하지 않고도 이전 상태를 유지할 수 있습니다.
  // |- useNavigate와 useLocation을 사용하여 라우팅을 관리하고 있습니다. 이를 통해 라우팅 로직을 컴포넌트 내부에서 구현할 수 있으며, 코드의 가독성과 유지보수성을 높일 수 있습니다.
  // |
  // |나쁜 점:
  // |- 코드의 의도를 파악하기 어려운 변수명(path, tabIndexList, tabList 등)이 사용되고 있습니다. 변수명을 더 명확하게 지정하면 코드의 가독성을 높일 수 있습니다.
  // |- 코드의 일관성이 부족합니다. 변수 초기화에 null과 빈 배열이 혼용되어 사용되고 있습니다. 변수 초기화에 일관성을 부여하면 코드의 가독성을 높일 수 있습니다.

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

  // |이 코드는 React의 useEffect hook을 사용하여 컴포넌트가 렌더링될 때마다 실행되는 함수를 정의하고 있습니다. 이 함수는 현재 경로를 설정하고, 탭이 존재하는지 확인하고, 데이터를 가져와서 탭 리스트에 추가하는 역할을 합니다.
  // |
  // |좋은 점:
  // |- 코드가 간결하고 가독성이 좋습니다.
  // |- useEffect hook을 사용하여 컴포넌트 라이프사이클 메서드를 대체하고 있어서 코드의 복잡도를 낮추고, 성능을 향상시킬 수 있습니다.
  // |- 비동기 함수를 사용하여 Firestore에서 데이터를 가져오고 있어서, 애플리케이션의 성능을 향상시킬 수 있습니다.
  // |
  // |나쁜 점:
  // |- 함수가 너무 많이 중첩되어 있어서, 코드의 가독성이 떨어질 수 있습니다.
  // |- 함수의 이름이 충분히 설명적이지 않아서, 코드를 이해하는 데 어려움을 겪을 수 있습니다.
  // |- 코드에서 사용되는 변수들의 타입이 명시되어 있지 않아서, 코드의 안정성이 떨어질 수 있습니다.

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

  // |이 코드는 React의 useEffect hook을 사용하여 tabList와 path가 정의되어 있을 때 실행되는 함수입니다. 이 함수는 tabList를 map 함수를 사용하여 SwiperSlide로 변환하고, 변환된 데이터를 setTabListData에 저장합니다. 이때, 현재 path와 tabList의 pathName이 같으면 active 클래스를 추가하고, 클릭 시 movePath 함수를 실행합니다. 또한, 각 SwiperSlide에는 X 버튼이 있어서 클릭 시 removeTab 함수를 실행합니다.
  // |
  // |이 코드의 장점은 useEffect hook을 사용하여 컴포넌트가 렌더링될 때마다 실행되는 것을 방지하고, tabList와 path가 정의되어 있을 때만 실행되도록 제한하여 성능을 최적화한 것입니다. 또한, map 함수를 사용하여 반복되는 코드를 간결하게 작성하고, SwiperSlide 컴포넌트를 사용하여 탭 메뉴를 구현한 것도 좋은 점입니다.
  // |
  // |하지만, 이 코드의 단점은 SwiperSlide 컴포넌트 내부에 있는 X 버튼이 클릭될 때마다 removeTab 함수가 실행되는데, 이 함수가 어디에서 정의되어 있는지 알 수 없기 때문에 코드의 가독성이 떨어진다는 것입니다. 또한, 코드의 일부가 한글로 작성되어 있어서 영어를 사용하는 다른 개발자들이 이해하기 어려울 수 있다는 점도 단점으로 꼽을 수 있습니다.

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
            <FontAwesomeIcon
              // 아이콘 스타일 설정
              className={`${font.fs_14} ${font.fc_accent}`}
              icon={item.icon}
            />
            <p className={`${font.fs_14} ${font.fw_7}`}>
              {item.displayName}
            </p>
            <button onClick={(event) => removeTab(event, item.pathName, index)}>
              X
            </button>
          </SwiperSlide>
        ))
      );
    }
  }, [tabList, tabIndexList]);

  // |이 코드는 탭을 삭제하는 함수입니다.
  // |
  // |좋은 점:
  // |- `event.stopPropagation()`을 사용하여 이벤트 전파를 막아서 의도하지 않은 동작을 방지합니다.
  // |- `location.pathname`을 사용하여 현재 경로와 삭제할 탭의 경로를 비교하여 같으면 루트 경로로 이동합니다.
  // |- `setTabList`를 사용하여 탭 리스트에서 해당 인덱스를 제외한 새로운 리스트를 만들어 설정합니다.
  // |
  // |나쁜 점:
  // |- 함수명이 `removeTab`인데, `index`만 제거하는 것이 아니라 `pathName`도 사용하고 있어서 함수명과 일치하지 않는 부분이 있습니다. 함수명을 변경하거나 `pathName`을 사용하지 않도록 수정하는 것이 좋습니다.

  const removeTab = (event, pathName, index) => {
    event.stopPropagation(); // 이벤트 전파를 막는다.
    if (location.pathname === pathName) {
      // 현재 경로와 삭제할 탭의 경로가 같으면
      navigate("/", { replace: true }); // 루트 경로로 이동한다.
    }
    setTabList(tabList.filter((_, i) => i !== index)); // 탭 리스트에서 해당 인덱스를 제외한 새로운 리스트를 만들어 설정한다.
  };

  // |이 코드는 이벤트 핸들러 함수로, 클릭 이벤트가 발생했을 때 `navigate` 함수를 호출하여 경로를 이동하고 상태를 전달합니다.
  // |
  // |좋은 점:
  // |- 이벤트 전파를 중지하여 부모 요소로의 이벤트 전파를 막습니다.
  // |- `navigate` 함수를 호출하여 경로를 이동하고 상태를 전달합니다.
  // |
  // |나쁜 점:
  // |- 함수명이 `movePath`로 되어 있지만, 실제로는 경로를 이동하는 함수입니다. 함수명을 더 명확하게 지으면 좋을 것입니다.
  // |- `navigate` 함수가 어디서 정의되었는지 알 수 없습니다. 함수가 정의된 파일을 찾아봐야 합니다.

  const movePath = (e, path, param) => {
    // 이벤트 전파 중지
    e.stopPropagation();
    // path로 이동하고, state에 param 전달
    navigate(path, { replace: true, state: param });
  };


  // |위 코드는 Swiper 라이브러리를 사용하여 메뉴 탭을 구현한 코드입니다.
  // |
  // |좋은 점:
  // |- Swiper 라이브러리를 사용하여 슬라이드 기능을 구현하였기 때문에 사용자 경험이 좋습니다.
  // |- slidesPerView, freeMode 등 Swiper 라이브러리의 다양한 옵션을 사용하여 원하는 대로 슬라이드를 구성할 수 있습니다.
  // |- 동적으로 생성되는 탭 메뉴 리스트를 구현하기 위해 컴포넌트를 분리하여 코드의 가독성을 높였습니다.
  // |
  // |나쁜 점:
  // |- className에 여러 개의 스타일링 클래스를 추가하였는데, 이는 가독성을 떨어뜨릴 수 있습니다. 클래스명을 의미 있는 단어로 작성하고, 필요한 경우 CSS의 선택자를 사용하여 스타일링을 구현하는 것이 좋습니다.
  // |- onClick 이벤트 핸들러 함수의 이름이 movePath로 작성되어 있는데, 이 함수가 어떤 역할을 하는지 명확하지 않습니다. 함수명을 의미 있는 단어로 작성하고, 함수의 역할을 주석으로 설명하는 것이 좋습니다.
  // Swiper 라이브러리를 사용한 메뉴 탭 구현

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
