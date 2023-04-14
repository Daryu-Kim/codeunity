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
  const auth = getAuth(); // Firebase 인증 객체 생성
  const user = auth.currentUser; // 현재 로그인한 사용자 정보 가져오기
  const uid = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기

  if (user) {
    // 사용자가 로그인한 경우
    try {
      const db = getFirestore(); // Firestore 데이터베이스 객체 생성
      const q = query(collection(db, "Posts"), where("userID", "==", uid)); // 해당 사용자가 작성한 게시물 쿼리
      const querySnapshot = await getDocs(q); // 쿼리 실행

      for (const snapshot of querySnapshot.docs) {
        // 해당 사용자가 작성한 모든 게시물에 대해 반복문 실행
        const postID = snapshot.data().postID; // 게시물 ID 가져오기
        const likesCol = await getDocs(
          query(collection(db, `Posts/${postID}/Likes`)) // 해당 게시물의 좋아요 컬렉션 쿼리
        );
        const cmtsCol = await getDocs(
          query(collection(db, `Posts/${postID}/Cmts`)) // 해당 게시물의 댓글 컬렉션 쿼리
        );
        await deleteDoc(doc(db, "Posts", postID)); // 해당 게시물 삭제
        for (const likesSnap of likesCol.docs) {
          // 해당 게시물의 좋아요 컬렉션에 대해 반복문 실행
          await deleteDoc(
            doc(db, `Posts/${postID}/Likes`, likesSnap.data().userID) // 해당 좋아요 삭제
          );
        }
        for (const cmtsSnap of cmtsCol.docs) {
          // 해당 게시물의 댓글 컬렉션에 대해 반복문 실행
          await deleteDoc(
            doc(db, `Posts/${postID}/Cmts`, cmtsSnap.data().userID) // 해당 댓글 삭제
          );
        }
      }

      await deleteDoc(doc(db, "Users", uid)); // 해당 사용자 정보 삭제
    } catch (error) {
      console.error(error); // 에러 발생 시 콘솔에 출력
    }

    await deleteUser(user); // Firebase 인증에서 해당 사용자 삭제
    alert("정상적으로 탈퇴되었습니다."); // 탈퇴 완료 메시지 출력
  }
};

const DeleteAccount = () => {
  return (
    <button disabled={true} onClick={handleDeleteAccount}>
      회원탈퇴하기
    </button>
  );
};

export default DeleteAccount;
