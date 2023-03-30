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
  query,
  setDoc,
  updateDoc,
  where,
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

export const getUserData = async (uid) => {
  const docSnap = await getDoc(doc(firestore, "Users", uid));
  if (docSnap.exists()) {
    return docSnap.data();
  }
};

export const getMyData = async () => {
  const myUID = sessionStorage.getItem("uid");
  const myDoc = await getDoc(doc(firestore, "Users", myUID));
  if (myDoc.exists()) {
    const myData = myDoc.data()
    return myData;
  }
}

export const getAllUserUID = async () => {
  const myUID = sessionStorage.getItem("uid");
  console.log(myUID)
  const allSnapshot = await getDocs(query(collection(firestore, "Users"), where("userID", "!=", myUID)));
  const allUserUID = [];
  allSnapshot.forEach((snapshot) => {
    allUserUID.push(snapshot.data().userID);
  });
  return allUserUID;
};
