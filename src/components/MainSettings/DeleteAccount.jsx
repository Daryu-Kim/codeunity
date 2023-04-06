import { getAuth, deleteUser } from "firebase/auth";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";

// Firebase App 인스턴스를 가져온다.
const handleDeleteAccount = async () => {
  const auth = getAuth();

  const user = auth.currentUser;

  if (user) {
    try {
      const db = getFirestore();

      const q = query(collection(db, "Posts"), where("userID", "==", user.uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc(db, "Posts", doc.id));
      });
      await deleteDoc(doc(db, "Users", user.uid));
      // 사용자 계정이 성공적으로 삭제되면 로그아웃한다.
      // 게시물 qna 팔로우정보
      // await auth.signOut();
    } catch (error) {
      console.error(error);
    }
    await deleteUser(user);
  }
};
const DeleteAccount = () => {
  return <button onClick={handleDeleteAccount}>회원탈퇴하기</button>;
};

export default DeleteAccount;
