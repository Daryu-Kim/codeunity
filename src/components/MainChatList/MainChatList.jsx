import styles from "./MainChatList.module.scss";
import font from "../../styles/Font.module.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "../../modules/Firebase";
import { BsChatDotsFill } from "react-icons/bs";

const MainChatList = () => {
  const userID = localStorage.getItem("uid");
  const [chatListData] = useCollectionData(
    query(
      collection(firestore, "Chats"),
      where("userArr", "array-contains", userID)
    )
  );

  return (
    <div className={styles.wrapper}>
      {chatListData && (
        <div className={styles.listBox}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <p className={`${font.fs_18} ${font.fw_7}`}>
                채팅
              </p>
              <p className={`${font.fs_18} ${font.fw_7} ${font.fc_accent}`}>
                {chatListData.length}
              </p>
            </div>
            <BsChatDotsFill className={`${font.fs_20} ${styles.newChat}`} />
          </div>
          {chatListData.length > 0 ? (
            <p>채팅방이 있습니다!</p>
          ) : (
            <div className={styles.noExistsBox}>
              <p className={`${font.fs_24} ${font.fw_7}`}>
                채팅방이 없습니다!
              </p>
              <p className={`
                ${font.fs_16} ${font.fw_5} ${font.fc_sub_light}
              `}>
                팔로워 / 팔로잉 분들이랑 채팅을 시작해보세요!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MainChatList;
