import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJDpzTYgAwaws0z7f9SzxKP8ff1GhPHns",
  authDomain: "find-it-38d67.firebaseapp.com",
  projectId: "find-it-38d67",
  storageBucket: "find-it-38d67.firebasestorage.app",
  messagingSenderId: "730786894452",
  appId: "1:730786894452:web:3b5bc808ffff223047f721",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
