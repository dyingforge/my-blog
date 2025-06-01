// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "my-blog-8cd0c.firebaseapp.com",
  projectId: "my-blog-8cd0c",
  storageBucket: "my-blog-8cd0c.firebasestorage.app",
  messagingSenderId: "276938520981",
  appId: "1:276938520981:web:4015d523f4da5287325e9c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
