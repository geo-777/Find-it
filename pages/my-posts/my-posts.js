import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth, requireAuth } from "../../shared/services/auth.js";
const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();

  await renderNavbar();
  requireAuth();
  hideLoader();
  app.style.display = "block";
});
