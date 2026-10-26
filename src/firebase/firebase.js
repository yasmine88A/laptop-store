// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeKhkJln1p9NBbAcY51uU9lOTpqXT2RJw",
  authDomain: "laptop-store-web.firebaseapp.com",
  databaseURL: "https://laptop-store-web-default-rtdb.firebaseio.com/", // <-- Remplacez par VOTRE URL Realtime DB
  projectId: "laptop-store-web",
  storageBucket: "laptop-store-web.firebasestorage.app",
  messagingSenderId: "637273502102",
  appId: "1:637273502102:web:3f6861ba9343f29894adb7",
  measurementId: "G-587S1L06KZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Firestore so they can be used in the app
export const auth = getAuth(app);
export const db = getDatabase(app);