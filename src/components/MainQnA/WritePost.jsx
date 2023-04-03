import React, { useState } from "react";

const WritePost = ({ addPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(title, content, tags); // addPost 함수를 호출하여 게시글을 추가함
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
      <div>
        <label htmlFor="tags">태그</label>
        <input type="text" id="tags" value={tags} onChange={handleTagsChange} />
      </div>
      <button type="submit">글쓰기</button>
    </form>
  );
};

export default WritePost;
