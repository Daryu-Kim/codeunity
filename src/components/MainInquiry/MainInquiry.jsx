import React from "react";
import styles from "./MainInquiry.module.scss";
import font from "../../styles/Font.module.scss";
import { BsFillTelephoneFill, BsGithub } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";

const MainInquiry = () => {
  const members = [
    {
      name: "김원재",
      img: "https://avatars.githubusercontent.com/u/86081049?v=4",
      position: "Fullstack Engineer",
      comment: `현재 5년차 미드레벨을 달리고 있는 풀스택 & 어플리케이션 개발자입니다!
      항상 문제 해결과 협업을 위한 공부 및 경험을 끊임없이 하고 있으며, 하루하루 새로운 지식을 찾아 배워나가는 것을 좋아합니다:)
      언제든 따끔한 지적은 환영입니다!`,
      phone: "010-6894-1916",
      email: "dev_daryu@kakao.com",
      github: "https://github.com/Daryu-Kim",
    },
    {
      name: "백승호",
      img: "https://avatars.githubusercontent.com/u/18731998?v=4",
      position: "Front-End Developer",
      comment: `북경이공대학교를 졸업하면서 계속 공부해왔고 앞으로도 계속 공부하고싶은 웹 개발자입니다.
      저의 강점은 끈기와 성실함 입니다. 또한 부족한 부분은 빠르게 인정하고 더 배우고자 하고 초심을 잃지않고 문제를 해결
      할 때까지 절대 포기하지 않습니다. `,
      phone: "010-2045-7967",
      email: "vudrkd1580@naver.com",
      github: "https://github.com/baekseungho",
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
                  <div>
                    <h1 className={font.fs_24}>{member.name}</h1>
                    <h3 className={font.fs_16}>{member.position}</h3>
                  </div>
                  <p className={font.fs_12}>{member.comment}</p>
                  <div className={styles.contactBox}>
                    <a href={`tel:${member.phone}`}>
                      <BsFillTelephoneFill />
                    </a>
                    <a href={`mailto: ${member.email}`}>
                      <AiFillMail />
                    </a>
                    <a href={member.github} target="_blank">
                      <BsGithub />
                    </a>
                  </div>
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
