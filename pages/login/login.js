import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth } from "../../shared/services/auth.js";
import { auth } from "../../shared/services/firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();

  await initAuth();

  await renderNavbar();

  hideLoader();
});

const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");

const loginBtn = document.getElementById("loginBtn");

function resetErrors() {
  emailError.textContent = "";
  passError.textContent = "";

  emailInput.classList.remove("input-error");
  passInput.classList.remove("input-error");
}

function validate() {
  resetErrors();

  let valid = true;

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email) {
    emailError.textContent = "Email required";
    emailInput.classList.add("input-error");
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    emailError.textContent = "Invalid email";
    emailInput.classList.add("input-error");
    valid = false;
  }

  if (!pass) {
    passError.textContent = "Password required";
    passInput.classList.add("input-error");
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) return;

  loginBtn.classList.add("loading");
  loginBtn.disabled = true;

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, pass);

    window.location.href = "/index.html";
  } catch (error) {
    console.error(error);

    if (error.code === "auth/invalid-credential") {
      passError.textContent = "Invalid email or password";
      passInput.classList.add("input-error");
      emailError.textContent = "Invalid email or password";
      emailInput.classList.add("input-error");
    } else if (error.code === "auth/user-not-found") {
      emailError.textContent = "User not found";
      emailInput.classList.add("input-error");
    } else if (error.code === "auth/too-many-requests") {
      passError.textContent = "Too many attempts. Try later.";
    } else {
      alert(error.message);
    }
  } finally {
    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;
  }
});
