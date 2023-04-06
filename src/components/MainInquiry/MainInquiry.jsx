import React from "react";
import styles from "./MainInquiry.module.scss";
import font from "../../styles/Font.module.scss";

const MainInquiry = () => {
  const members = [
    {
      name: "김원재",
      img: "https://avatars.githubusercontent.com/u/86081049?v=4",
      position: "Fullstack Engineer",
      conment: `현재 5년차 미드레벨을 달리고 있는 풀스택 & 어플리케이션 개발자입니다!
      항상 문제 해결과 협업을 위한 공부 및 경험을 끊임없이 하고 있으며, 하루하루 새로운 지식을 찾아 배워나가는 것을 좋아합니다:)
      언제든 따끔한 지적은 환영입니다!`,
    },
    {
      name: "백승호",
      img: "https://avatars.githubusercontent.com/u/18731998?v=4",
      position: "Front-End Developer",
      conment: "hao",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentBox}>
        <h3>MEMBERS</h3>
        <h1 className={font.fs_28}>Meet our Members</h1>
        <div className={styles.memberBox}>
          {members.map((member) => {
            return (
              <div className={styles.member}>
                <img src={member.img}></img>
                <div className={styles.infoBox}>
                  <h1>{member.name}</h1>
                  <h3>{member.position}</h3>
                  <p>{member.conment}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainInquiry;
