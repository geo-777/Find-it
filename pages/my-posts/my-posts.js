import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth } from "../../shared/services/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();

  await renderNavbar();

  hideLoader();
});
