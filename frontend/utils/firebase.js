// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5SR5e-Zm_l9-VuHcphKFXmOmHPEaMCYI",
  authDomain: "campuseats-bf7cc.firebaseapp.com",
  projectId: "campuseats-bf7cc",
  storageBucket: "campuseats-bf7cc.firebasestorage.app",
  messagingSenderId: "634101606726",
  appId: "1:634101606726:web:f154518dcb652dca0bdd47",
  measurementId: "G-GVJK30XBBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Prevent Firebase Analytics from running on the server
let analytics;
if (typeof window !== "undefined") {
    import("firebase/analytics").then((module) => {
        analytics = module.getAnalytics(app);
    });
}

export { auth, db, analytics };