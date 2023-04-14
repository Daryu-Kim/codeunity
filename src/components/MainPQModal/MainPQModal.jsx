import React, { useEffect, useRef, useState } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./MainPQModal.module.scss";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  toastClear,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../modules/Functions";
import {
  collection,
  doc,
  addDoc,
  Timestamp,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";
import { BsSendFill } from "react-icons/bs";

const MainPQModal = ({ setModalState, modalType }) => {
  const uid = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기
  const firestore = getFirestore(); // Firestore 인스턴스 가져오기
  const location = useLocation(); // 현재 URL 경로 가져오기
  const [title, setTitle] = useState(""); // 제목 상태 변수와 상태 설정 함수 생성
  const [mdValue, setMDValue] = useState(""); // 마크다운 값 상태 변수와 상태 설정 함수 생성
  const [tags, setTags] = useState([]); // 태그 상태 변수와 상태 설정 함수 생성
  const [tagsData, setTagsData] = useState(null); // 태그 데이터 상태 변수와 상태 설정 함수 생성
  const modalRef = useRef(null); // 모달 참조 변수 생성

  useEffect(() => {
    // 마우스 다운 이벤트 핸들러 함수 정의
    const handler = (e) => {
      // 모달 창이 열려있고, 클릭한 요소가 모달 창 안에 없으면 모달 창 닫기
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalState(false);
      }
    };

    // 마우스 다운 이벤트 리스너 등록
    document.addEventListener("mousedown", handler);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => document.removeEventListener("mousedown", handler);
  });

  useEffect(() => {
    // tags 데이터가 변경될 때마다 실행되는 useEffect
    setTagsData(
      // tags 배열을 map 함수로 순회하며 JSX 엘리먼트를 생성하여 tagsData에 저장
      tags.map((item, index) => (
        <p
          key={index}
          // 클릭 시 해당 태그를 삭제하는 removeTag 함수 실행
          onClick={() => removeTag(index)}
          // font 클래스의 fs_12와 fw_7 스타일 적용
          className={`${font.fs_12} ${font.fw_7}`}
        >
          {item}
        </p>
      ))
    );
  }, [tags]);

  const titleChange = (e) => setTitle(e.target.value); // title 값 변경 함수
  const mdValueChange = (e) => setMDValue(e); // mdValue 값 변경 함수
  const tagInput = (e) => {
    // tag 입력 함수
    if (e.key === "Enter") {
      // Enter 키 입력 시
      addTag(e.target.value); // 입력한 값을 addTag 함수에 전달하여 태그 추가
      e.target.value = ""; // 입력 필드 초기화
    }
  };

  const addTag = (tagValue) => {
    // 만약 tags 배열에 tagValue가 없다면
    if (!tags.includes(tagValue)) {
      // tags 배열에 tagValue를 추가하고 업데이트한다.
      setTags([...tags, tagValue]);
    } else {
      // 이미 추가된 태그라는 에러 메시지를 띄운다.
      toastError("이미 추가된 태그입니다!");
    }
  };

  // closeModal 함수 정의
  const closeModal = () => setModalState(false); // modalState를 false로 변경하여 모달을 닫음

  const removeTag = (
    index // removeTag 함수 선언, index 매개변수 전달
  ) => setTags([...tags.slice(0, index), ...tags.slice(index + 1)]); // tags 배열에서 index를 제외한 나머지 요소들을 새로운 배열로 만들어 setTags 함수를 통해 업데이트

  const submitPQ = async () => {
    if (modalType === "QnAs") {
      // modalType이 QnAs인 경우
      if (!title) return toastError("제목을 입력해주세요!"); // 제목이 없으면 에러 메시지 출력
      if (!mdValue) return toastError("내용을 입력해주세요!"); // 내용이 없으면 에러 메시지 출력
      if (tags.length === 0) return toastError("태그를 입력해주세요!"); // 태그가 없으면 에러 메시지 출력
      toastLoading("다른 개발자에게 질문하는 중입니다!"); // 로딩 메시지 출력
      const result = await addDoc(collection(firestore, modalType), {
        // firestore에 데이터 추가
        userID: uid,
        createdAt: Timestamp.fromDate(new Date()),
        postTitle: title,
        postContent: mdValue,
        postTags: tags,
        postViews: 0,
        postUps: 0,
        postCmts: 0,
      });
      await updateDoc(doc(firestore, modalType, result.id), {
        // firestore에 데이터 업데이트
        postID: result.id,
      });
      toastClear(); // 로딩 메시지 제거
      closeModal(); // 모달 닫기
      toastSuccess("질문을 완료했습니다!"); // 성공 메시지 출력
    }

    if (modalType === "Posts") {
      // modalType이 Posts인 경우
      if (!mdValue) return toastError("내용을 입력해주세요!"); // 내용이 없으면 에러 메시지 출력
      toastLoading("게시물을 업로드 중입니다!"); // 로딩 메시지 출력
      const result = await addDoc(collection(firestore, modalType), {
        // firestore에 데이터 추가
        userID: uid,
        createdAt: Timestamp.fromDate(new Date()),
        postContent: mdValue,
        likeCount: 0,
      });
      await updateDoc(doc(firestore, modalType, result.id), {
        // firestore에 데이터 업데이트
        postID: result.id,
      });
      toastClear(); // 로딩 메시지 제거
      closeModal(); // 모달 닫기
      toastSuccess("업로드를 완료했습니다!"); // 성공 메시지 출력
    }
  };

  return (
    <div className={styles.modalWrapper}>
      <AiOutlineClose className={`${styles.closeBtn}`} onClick={closeModal} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        bodyClassName={styles.toast}
      />
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.buttonsWrapper}>
          <i />
          <div className={styles.titleBox}>
            <p className={`${font.fs_14} ${font.fw_7}`}>
              {modalType == "QnAs" ? "새 질문 올리기" : "새 게시물 올리기"}
            </p>
          </div>
          <div className={styles.btnBox}>
            <BsSendFill className={`${styles.submitBtn}`} onClick={submitPQ} />
          </div>
        </div>
        {modalType == "QnAs" ? (
          <div className={styles.writeTitle}>
            <input
              className={`${font.fs_14} ${font.fw_7}`}
              type="text"
              value={title}
              maxLength={50}
              placeholder="제목을 입력해주세요 (50자 이내)"
              onChange={titleChange}
            />
          </div>
        ) : null}
        <div className={styles.writeContent}>
          <MarkdownEditor
            value={mdValue}
            onChange={(e) => mdValueChange(e)}
            className={styles.memoBoxMemo}
            previewWidth={"100%"}
            style={{
              fontSize: 16,
            }}
            toolbars={[
              "bold",
              "italic",
              "strike",
              "underline",
              "quote",
              "link",
              "image",
              "code",
              "codeBlock",
            ]}
            toolbarsMode={["preview"]}
          />
        </div>
        {modalType == "QnAs" ? (
          <div className={styles.writeTag}>
            <input
              className={`${font.fs_12} ${font.fw_5}`}
              type="text"
              placeholder="태그를 입력해주세요 (Enter로 구분)"
              onKeyUp={(e) => tagInput(e)}
            />
            <div className={styles.tagsBox}>{tagsData}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default MainPQModal;
