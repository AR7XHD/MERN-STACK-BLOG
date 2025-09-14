import { getEnv } from "../helpers/getEnv"
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "mern-blog-16bc8.firebaseapp.com",
  projectId: "mern-blog-16bc8",
  storageBucket: "mern-blog-16bc8.firebasestorage.app",
  messagingSenderId: "899632792485",
  appId: "1:899632792485:web:db45774d3db84a36395e4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}