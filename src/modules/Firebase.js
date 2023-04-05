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

export const followUser = async (targetID) => {
  const myUID = localStorage.getItem("uid");
  const myDoc = await getDoc(doc(firestore, "Users", myUID));
  const targetDoc = await getDoc(doc(firestore, "Users", targetID));
  try {
    if (myDoc.exists()) {
      if (targetDoc.exists()) {
        await setDoc(
          doc(
            firestore,
            `Follows/${myUID}/Following`,
            targetDoc.data().userID
          ),
          {
            userID: targetDoc.data().userID,
          }
        );

        await setDoc(
          doc(
            firestore,
            `Follows/${targetDoc.data().userID}/Follower`,
            myUID
          ),
          {
            userID: myUID
          }
        );

        await updateDoc(doc(firestore, "Users", myUID), {
          followingCount: myDoc.data().followingCount + 1,
        });

        await updateDoc(doc(firestore, "Users", targetID), {
          followerCount: targetDoc.data().followerCount + 1,
        });

        return true;
      }
    }
  } catch (error) {
    toastError(error);
    return false;
  }
};

export const unfollowUser = async (targetID) => {
  const myUID = localStorage.getItem("uid");
  const myDoc = await getDoc(doc(firestore, "Users", myUID));
  const targetDoc = await getDoc(doc(firestore, "Users", targetID));
  try {
    if (myDoc.exists()) {
      if (targetDoc.exists()) {
        await deleteDoc(
          doc(
            firestore,
            `Follows/${myUID}/Following`,
            targetDoc.data().userID
          )
        );

        await deleteDoc(
          doc(
            firestore,
            `Follows/${targetDoc.data().userID}/Follower`,
            myUID
          )
        );

        await updateDoc(doc(firestore, "Users", myUID), {
          followingCount: myDoc.data().followingCount - 1,
        });

        await updateDoc(doc(firestore, "Users", targetID), {
          followerCount: targetDoc.data().followerCount - 1,
        });
      }
    }
  } catch (error) {
    toastError(error);
  }
};
