import { auth, db } from "../../shared/services/firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth } from "../../shared/services/auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();

  await initAuth();

  await renderNavbar();

  hideLoader();
  app.style.display = "block";
});

const form = document.querySelector(".form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("mobNum");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");

function setError(input, message) {
  const label = input.parentElement.querySelector("label");

  label.classList.add("label-error");

  let error = label.querySelector(".error-text");

  if (!error) {
    error = document.createElement("span");
    error.className = "error-text";
    label.appendChild(error);
  }

  error.textContent = message;

  input.classList.add("input-error");
}

function clearError(input) {
  const label = input.parentElement.querySelector("label");

  label.classList.remove("label-error");

  const error = label.querySelector(".error-text");
  if (error) error.remove();

  input.classList.remove("input-error");
}

function validate() {
  let valid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  // clear previous errors
  [nameInput, emailInput, phoneInput, passwordInput].forEach(clearError);

  // name
  if (!name) {
    setError(nameInput, "Cannot be empty");
    valid = false;
  }

  // email
  if (!email) {
    setError(emailInput, "Cannot be empty");
    valid = false;
  } else if (!email.endsWith("@gectcr.ac.in")) {
    setError(emailInput, "Only GEC mails are permitted.");
    valid = false;
  }

  // phone
  if (!phone) {
    setError(phoneInput, "Cannot be empty");
    valid = false;
  } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ""))) {
    setError(phoneInput, "Invalid mobile number.");
    valid = false;
  }

  // password
  if (!password) {
    setError(passwordInput, "Cannot be empty");
    valid = false;
  } else if (password.length < 6) {
    setError(passwordInput, "Minimum of 6 chars");
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) return;

  registerBtn.classList.add("loading");
  registerBtn.disabled = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phone,
      createdAt: new Date(),
    });

    console.log("User created successfully");

    window.location.href = "../../index.html";
  } catch (error) {
    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      setError(emailInput, "Email already registered.");
    } else {
      alert(error.message);
    }
  } finally {
    registerBtn.classList.remove("loading");
    registerBtn.disabled = false;
  }
});
