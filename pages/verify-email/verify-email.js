import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { auth } from "../../shared/services/firebase.js";
import { initAuth, requireAuth } from "../../shared/services/auth.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const app = document.getElementById("app");
const sendBtn = document.getElementById("sendVerificationBtn");
const messageEl = document.getElementById("message");
const statusText = document.getElementById("status-text");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();
  await renderNavbar();
  requireAuth();

  // Reload user to get latest emailVerified status
  await auth.currentUser.reload();

  if (auth.currentUser.emailVerified) {
    statusText.textContent =
      "Your email is already verified! You can now post items.";
    sendBtn.style.display = "none";
    messageEl.textContent = "";
  }

  hideLoader();
  app.style.display = "block";
});

sendBtn.addEventListener("click", async () => {
  messageEl.textContent = "";
  messageEl.className = "message";

  try {
    await sendEmailVerification(auth.currentUser);
    messageEl.textContent = "Verification email sent! Check your inbox.";
    messageEl.classList.add("success");
  } catch (error) {
    console.error(error);

    // Error handling
    if (error.code === "auth/too-many-requests") {
      messageEl.textContent = "Too many requests. Try again later.";
    } else if (error.code === "auth/user-not-found") {
      messageEl.textContent = "User not found. Please log in again.";
    } else {
      messageEl.textContent = "Failed to send verification email. Try again.";
    }

    messageEl.classList.add("error");
  }
});
