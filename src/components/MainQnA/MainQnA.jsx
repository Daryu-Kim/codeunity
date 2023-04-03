import React, { useState } from "react";
import styles from "./MainQnA.module.scss";
import font from "../../styles/Font.module.scss";
import WritePost from "./WritePost";

const MainQnA = () => {
  const [posts, setPosts] = useState([]);

  const addPost = (title, content, tags) => {
    const newPost = { title, content, tags };
    setPosts([...posts, newPost]);
  };

  return (
    <div>
      <WritePost addPost={addPost} />
      <hr />
      <h2>게시글 목록</h2>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>태그: {post.tags}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainQnA;
