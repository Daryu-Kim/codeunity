import { getAuth, deleteUser } from "firebase/auth";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  getFirestore,
  writeBatch,
} from "firebase/firestore";

const handleDeleteAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = localStorage.getItem("uid");

  if (user) {
    try {
      const db = getFirestore();
      const q = query(collection(db, "Posts"), where("userID", "==", uid));
      const querySnapshot = await getDocs(q);

      // 개별 도큐먼트를 삭제한다.
      // const promises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      // await Promise.all(promises);

      querySnapshot.forEach(async (snapshot) => {
        const postID = snapshot.data().postID;
        const likesCol = await getDocs(
          query(collection(db, `Posts/${postID}/Likes`))
        );
        const cmtsCol = await getDocs(
          query(collection(db, `Posts/${postID}/Cmts`))
        );
        await deleteDoc(doc(db, "Posts", postID));
        likesCol.forEach(async (likesSnap) => {
          await deleteDoc(
            doc(db, `Posts/${postID}/Likes`, likesSnap.data().userID)
          );
        });
        cmtsCol.forEach(async (cmtsSnap) => {
          await deleteDoc(
            doc(db, `Posts/${postID}/Cmts`, cmtsSnap.data().userID)
          );
        });
      });

      // 해당 사용자에 대한 보안 규칙을 변경하여
      // 삭제된 도큐먼트를 다른 사용자가 읽을 수 없도록 한다.
      // await db.collection("Posts").setSettings({
      //   rules: {
      //     // 해당 사용자가 작성한 도큐먼트만 수정/삭제 가능하도록 한다.
      //     ".read": false,
      //     ".write": "request.auth.uid == resource.data.userID",
      //   },
      // });

      // 사용자 정보 도큐먼트를 삭제한다.
      await deleteDoc(doc(db, "Users", uid));
    } catch (error) {
      console.error(error);
    }

    await deleteUser(user);
    alert("정상적으로 탈퇴되었습니다.");
  }
};

const DeleteAccount = () => {
  return <button onClick={handleDeleteAccount}>회원탈퇴하기</button>;
};

export default DeleteAccount;
