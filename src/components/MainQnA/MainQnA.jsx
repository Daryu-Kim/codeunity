import React, { useState } from "react";
import styles from "./MainQnA.module.scss";
import font from "../../styles/Font.module.scss";
import WritePost from "./WritePost";

const MainQnA = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addPost = (title, content, tags) => {
    const newPost = { title, content, tags };
    setPosts([...posts, newPost]);
    setIsModalOpen(false); // 게시글 추가 후 모달창 닫기
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <hr />
        <div className={styles.postBox}>
          <button onClick={handleModalOpen}>글쓰기</button>
          <h2>게시글 목록</h2>
          {posts.length === 0 ? (
            <p>게시글이 없습니다.</p>
          ) : (
            <ul>
              {posts.map((post, index) => (
                <li className={styles.postItem} key={index}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>태그: {post.tags}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <WritePost addPost={addPost} closeModal={handleModalClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainQnA;
