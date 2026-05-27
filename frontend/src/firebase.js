import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCy2UUxFS5g0aM-uqgtTcTPnC9Ix2NYCZw",

  authDomain:
    "expense-tracker-e59fe.firebaseapp.com",

  projectId:
    "expense-tracker-e59fe",

  storageBucket:
    "expense-tracker-e59fe.firebasestorage.app",

  messagingSenderId:
    "210129832525",

  appId:
    "1:210129832525:web:05c04248e20207600eea04",

  measurementId:
    "G-7GKCQKC5JC"
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const provider =
  new GoogleAuthProvider();