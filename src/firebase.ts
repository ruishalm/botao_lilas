import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA12EMSLVgdTF56AcOLNtzmr1D6PEyrJyg",
  authDomain: "botaolilasproducao.firebaseapp.com",
  projectId: "botaolilasproducao",
  storageBucket: "botaolilasproducao.firebasestorage.app",
  messagingSenderId: "788369407939",
  appId: "1:788369407939:web:63d4304e7b51e990fb0776",
  measurementId: "G-9PZ3T9SJYV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };