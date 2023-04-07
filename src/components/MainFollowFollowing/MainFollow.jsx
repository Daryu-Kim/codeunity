import React, { useState } from "react";
import styles from "./MainFollow.module.scss";

const MainFollow = ({ followers, following, onClose }) => {
  const [activeTab, setActiveTab] = useState("followers");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <h2 className="modal__title">Followers and Following</h2>
          <button className="modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal__tabs">
          <button
            className={`modal__tab ${
              activeTab === "followers" ? "modal__tab--active" : ""
            }`}
            onClick={() => handleTabClick("followers")}
          >
            Followers
          </button>
          <button
            className={`modal__tab ${
              activeTab === "following" ? "modal__tab--active" : ""
            }`}
            onClick={() => handleTabClick("following")}
          >
            Following
          </button>
        </div>
        <div className="modal__body">
          {activeTab === "followers" ? (
            <ul className="modal__list">
              {followers.map((follower) => (
                <li key={follower.id} className="modal__item">
                  <img
                    src={follower.avatar}
                    alt={`${follower.username} profile`}
                    className="modal__avatar"
                  />
                  <div className="modal__user">
                    <p className="modal__username">{follower.username}</p>
                    <p className="modal__name">{follower.name}</p>
                  </div>
                  <button className="modal__follow">Follow</button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="modal__list">
              {following.map((follow) => (
                <li key={follow.id} className="modal__item">
                  <img
                    src={follow.avatar}
                    alt={`${follow.username} profile`}
                    className="modal__avatar"
                  />
                  <div className="modal__user">
                    <p className="modal__username">{follow.username}</p>
                    <p className="modal__name">{follow.name}</p>
                  </div>
                  <button className="modal__unfollow">Unfollow</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFollow;
