import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

let user = null;
let isLoggedIn = false;

function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user = firebaseUser;
        isLoggedIn = true;
        console.log(user);
      } else {
        user = null;
        isLoggedIn = false;
        console.log("no user");
      }

      resolve(firebaseUser);
    });
  });
}

function requireAuth() {
  if (!isLoggedIn) {
    window.location.href = "../../pages/login/login.html";
  }
}

function logout() {
  return signOut(auth);
}

export { initAuth, requireAuth, logout, user, isLoggedIn };
