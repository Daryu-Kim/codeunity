// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { toastError } from "./Functions";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY, // API 키
  authDomain: process.env.REACT_APP_AUTH_DOMAIN, // 인증 도메인
  projectId: process.env.REACT_APP_PROJECT_ID, // 프로젝트 ID
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET, // 스토리지 버킷
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID, // 메시지 전송 ID
  appId: process.env.REACT_APP_ID, // 앱 ID
  measurementId: process.env.REACT_APP_MEASUREMENT_ID, // 측정 ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // firebaseConfig를 사용하여 앱 초기화
const analytics = getAnalytics(app); // 앱의 분석 정보 가져오기
export const auth = getAuth(app); // 앱의 인증 정보 가져오기
export const firestore = getFirestore(app); // 앱의 Firestore 데이터베이스 가져오기
export const storage = getStorage(app); // 앱의 스토리지 가져오기

setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, () => { // Firebase 인증 상태가 변경될 때마다 실행되는 콜백 함수 등록
  const user = auth.currentUser; // 현재 인증된 사용자 정보 가져오기
});

export const followUser = async (targetID) => {
  const myUID = localStorage.getItem("uid"); // 현재 사용자의 uid를 가져옴
  const myDoc = await getDoc(doc(firestore, "Users", myUID)); // 현재 사용자의 문서를 가져옴
  const targetDoc = await getDoc(doc(firestore, "Users", targetID)); // 타겟 사용자의 문서를 가져옴
  try {
    if (myDoc.exists() && targetDoc.exists()) { // 현재 사용자와 타겟 사용자의 문서가 모두 존재하는 경우
      await setDoc(
        doc(
          firestore,
          `Follows/${myUID}/Following`,
          targetDoc.data().userID // 현재 사용자의 Following 컬렉션에 타겟 사용자의 uid를 추가함
        ),
        {
          userID: targetDoc.data().userID,
        }
      );

      await setDoc(
        doc(
          firestore,
          `Follows/${targetDoc.data().userID}/Follower`,
          myUID // 타겟 사용자의 Follower 컬렉션에 현재 사용자의 uid를 추가함
        ),
        {
          userID: myUID
        }
      );

      await updateDoc(doc(firestore, "Users", myUID), {
        followingCount: myDoc.data().followingCount + 1, // 현재 사용자의 followingCount를 1 증가시킴
      });

      await updateDoc(doc(firestore, "Users", targetID), {
        followerCount: targetDoc.data().followerCount + 1, // 타겟 사용자의 followerCount를 1 증가시킴
      });

      return true; // 성공적으로 팔로우를 완료한 경우 true 반환
    }
  } catch (error) {
    toastError(error); // 에러가 발생한 경우 에러 메시지를 띄움
    return false; // 팔로우를 실패한 경우 false 반환
  }
};

export const unfollowUser = async (targetID) => {
  const myUID = localStorage.getItem("uid"); // 현재 사용자의 uid를 가져옴
  const myDoc = await getDoc(doc(firestore, "Users", myUID)); // 현재 사용자의 문서를 가져옴
  const targetDoc = await getDoc(doc(firestore, "Users", targetID)); // 언팔로우 대상 사용자의 문서를 가져옴
  try {
    if (myDoc.exists() && targetDoc.exists()) { // 현재 사용자와 언팔로우 대상 사용자의 문서가 모두 존재하는 경우
      await deleteDoc(
        doc(
          firestore,
          `Follows/${myUID}/Following`,
          targetDoc.data().userID // 현재 사용자의 Following 컬렉션에서 언팔로우 대상 사용자의 uid를 가진 문서를 삭제
        )
      );

      await deleteDoc(
        doc(
          firestore,
          `Follows/${targetDoc.data().userID}/Follower`,
          myUID // 언팔로우 대상 사용자의 Follower 컬렉션에서 현재 사용자의 uid를 가진 문서를 삭제
        )
      );

      await updateDoc(doc(firestore, "Users", myUID), {
        followingCount: myDoc.data().followingCount - 1, // 현재 사용자의 followingCount를 1 감소시킴
      });

      await updateDoc(doc(firestore, "Users", targetID), {
        followerCount: targetDoc.data().followerCount - 1, // 언팔로우 대상 사용자의 followerCount를 1 감소시킴
      });
    }
  } catch (error) {
    toastError(error); // 에러가 발생한 경우 에러 메시지를 출력
  }
};

export const uploadImage = async (img, path) => {
  console.log(path); // path 출력
  const myUID = localStorage.getItem("uid"); // 로컬 스토리지에서 uid 가져오기
  const fileName = Math.random().toString(36).substring(2, 24) + ".png"; // 파일 이름 생성
  const storageRef = ref(storage, `file.png`); // 스토리지 참조 생성
  try {
    const snapshot = await uploadBytes(storageRef, img, ""); // 이미지 업로드
    const url = await snapshot.ref.getDownloadURL(); // 다운로드 URL 가져오기
    return url; // URL 반환
  } catch (error) {
    toastError(error); // 에러 토스트 메시지 출력
  }
};

export const uploadProfileImage = async (img, uid) => {
  // 사용자의 프로필 이미지를 저장할 경로를 설정합니다.
  const storageRef = ref(storage, `Users/${uid}/profile_image.png`);
  // 이미지를 업로드하고 업로드 결과를 받아옵니다.
  const response = await uploadImage(storageRef, img);
  // 업로드 결과를 콘솔에 출력합니다.
  console.log(response);
  // 업로드한 이미지의 다운로드 URL을 받아옵니다.
  const url = await getDownloadURL(response.ref);
  // 다운로드 URL을 콘솔에 출력합니다.
  console.log(url);
  // 다운로드 URL을 반환합니다.
  return url;
};
