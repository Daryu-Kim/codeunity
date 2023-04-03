import React, { useState, useEffect, useRef } from "react";
import font from "../../styles/Font.module.scss";
import styles from "./WritePost.module.scss";

const WritePost = ({ addPost, closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const modalRef = useRef(null);

  const titleChange = (e) => setTitle(e.target.value);
  const contentChange = (e) => setContent(e.target.value);
  const tagsChange = (e) => setTags(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(title, content, tags); // addPost 함수를 호출하여 게시글을 추가함
    setTitle("");
    setContent("");
    setTags("");
    closeModal();
  };

  const overlayClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  return (
    <div className={styles.modalWrapper} onClick={overlayClick} ref={modalRef}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <div className={styles.writeTitle}>
            <label className={font.fs_16} htmlFor="title">
              제목
            </label>
            <input
              className={font.fs_12}
              type="text"
              id="title"
              value={title}
              placeholder="제목을 입력해주세요"
              onChange={titleChange}
            />
          </div>
          <div className={styles.writeContent}>
            <label htmlFor="content">내용</label>
            <textarea
              className={font.fs_12}
              id="content"
              value={content}
              placeholder="궁금하신 내용을 적어주세요.
              내용이 구체적일수록 좋아요!"
              onChange={contentChange}
            ></textarea>
          </div>
          <div className={styles.writeTag}>
            <label htmlFor="tags">태그</label>
            <input
              className={font.fs_12}
              type="text"
              id="tags"
              value={tags}
              placeholder="태그를 선택해주세요"
              onChange={tagsChange}
            />
          </div>
          <div className={styles.buttonsWrapper}>
            <button className={styles.submitBtn} type="submit">
              글쓰기
            </button>
          </div>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={closeModal}
          >
            X
          </button>
        </form>
      </div>
    </div>
  );
};
export default WritePost;
