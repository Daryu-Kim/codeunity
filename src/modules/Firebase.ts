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
  signInWithPopup
} from "firebase/auth";
import "react-toastify/dist/ReactToastify.css"
import { toastError } from "./Functions";
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
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, () => {
  const user = auth.currentUser;
  console.log(user);
});

export const getMyData = () => {
  return auth.currentUser;
};

export const getTargetData = () => {
};

export async function signInGitHub() {
  // await signInWithPopup(auth, new GithubAuthProvider())
  await get("https://github.com/login/oauth/authorize?client_id=0436e48b08b5dd10f81e")
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    // The signed-in user info.
    const user = result.user;                                                                                             
  });
}

export const signInEmail = async (email: string, password: string) =>  {
    await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    // ...
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
    // if (errorCode == "auth/invalid-password") {
    //   toastError("비밀번호는 최소 6자리여야 합니다!");
    // }
    if (errorCode == "auth/user-not-found") {
      toastError("이메일 또는 비밀번호가 잘못되었습니다!");
    }
    console.log(`${errorCode}: ${errorMessage}`);
  });
}