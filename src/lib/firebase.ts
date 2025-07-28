// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrQdfVvZzG4PhOEmIebPk-n3oXuV6FRtI",
  authDomain: "mlm-platform-2dc49.firebaseapp.com",
  projectId: "mlm-platform-2dc49",
  storageBucket: "mlm-platform-2dc49.firebasestorage.app",
  messagingSenderId: "424114515187",
  appId: "1:424114515187:web:8a5d0cb7e86adf69cddb86",
  measurementId: "G-XJMXT3ES0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;