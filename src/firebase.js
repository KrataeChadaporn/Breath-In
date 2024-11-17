// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKGPmEP25V55J9es2jdhMXcVPNMTvaqWM",
  authDomain: "datamental-58c6c.firebaseapp.com",
  databaseURL: "https://datamental-58c6c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datamental-58c6c",
  storageBucket: "datamental-58c6c.firebasestorage.app",
  messagingSenderId: "790178018578",
  appId: "1:790178018578:web:ad65e4f9c44ff884ca2fcb",
  measurementId: "G-HECP2Q677X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };