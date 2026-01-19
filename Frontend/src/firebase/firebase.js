import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqJ9OCei4YzberpgfZixCSxZePbWQ2UbA",
  authDomain: "myplantexpert-ae836.firebaseapp.com",
  projectId: "myplantexpert-ae836",
  storageBucket: "myplantexpert-ae836.firebasestorage.app",
  messagingSenderId: "698514276074",
  appId: "1:698514276074:web:2e9849679d8379e64be193",
  measurementId: "G-EHCLL4PCBQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
