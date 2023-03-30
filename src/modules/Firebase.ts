// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { toastError } from "./Functions";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, () => {
  const user = auth.currentUser;
});

export const getMyData = () => {
  return auth.currentUser;
};

export const getTargetData = () => {};

export async function signInGitHub() {
  // await signInWithPopup(auth, new GithubAuthProvider())
  // await get("https://github.com/login/oauth/authorize?client_id=0436e48b08b5dd10f81e")
  // .then((result) => {
  //   // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  //   const credential = GithubAuthProvider.credentialFromResult(result);
  //   const token = credential?.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  // });
}

export const signInEmail = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const currentUser = auth.currentUser;
      console.log(user);

      if (currentUser) {
        await updateDoc(
          doc(firestore, "Users", user.uid),
          {
            verifiedEmail: user.emailVerified,
            userImg: user.photoURL,
          }
        );
      }

      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/wrong-password") {
        toastError("비밀번호가 맞지 않습니다!");
      }
      if (errorCode == "auth/internal-error") {
        toastError("알 수 없는 오류입니다!");
      }
      if (errorCode == "auth/invalid-email") {
        toastError("이메일 형식이 맞지 않습니다!");
      }
      if (errorCode == "auth/user-not-found") {
        toastError("이메일 또는 비밀번호가 잘못되었습니다!");
      }
      console.log(`${errorCode}: ${errorMessage}`);
      return false;
    });
};

export const signUpEmail = (
  email: string,
  nickname: string,
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    toastError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
    return false;
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const currentUser = auth.currentUser;
      console.log(user);

      // update user's display name
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: nickname,
        });

        await setDoc(
          doc(firestore, "Users", user.uid),
          {
            followerCount: 0,
            followingCount: 0,
            userDesc: "",
            userID: user.uid,
            userImg: user.photoURL,
            userName: user.displayName,
            verifiedEmail: user.emailVerified,
          }
        );
      }
      
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/email-already-in-use") {
        toastError("이미 사용 중인 이메일입니다.");
      }
      if (errorCode == "auth/invalid-email") {
        toastError("유효하지 않은 이메일입니다. 다시 확인해주세요.");
      }
      if (errorCode == "auth/weak-password") {
        toastError("비밀번호는 최소 6자 이상이어야 합니다.");
      }
      console.log(`${errorCode}: ${errorMessage}`);
      return false;
    });
};

export const getUserData = async () => {
  const uid = await auth.currentUser?.uid as string;
  const docSnap = await getDoc(doc(firestore, "Users", uid));
  if (docSnap.exists()) {
    return docSnap.data();
  }
};

export const getAllUserUID = async () => {
  const allSnapshot = await getDocs(collection(firestore, "Users"));
  const allUserUID: string[] = [];
  allSnapshot.forEach((snapshot) => {
    allUserUID.push(snapshot.data().userID);
  });
  return allUserUID;
}
