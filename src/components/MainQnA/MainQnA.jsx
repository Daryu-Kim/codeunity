import React, { useState } from "react";
import styles from "./MainQnA.module.scss";
import font from "../../styles/Font.module.scss";
import WritePost from "./WritePost";
import MainPQModal from "../MainPQModal/MainPQModal";

const MainQnA = () => {
  const [posts, setPosts] = useState([]);
  const [modalState, setModalState] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <hr />
        <div className={styles.postBox}>
          <button onClick={() => setModalState(true)}>글쓰기</button>
          <h2>게시글 목록</h2>
          {posts.length === 0 ? (
            <p>게시글이 없습니다.</p>
          ) : (
            <ul>
              {posts.map((post, index) => (
                <li className={styles.postItem} key={index}>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <p>태그: {post.tags}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalState && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <MainPQModal setModalState={setModalState} modalType="QnAs" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainQnA;
