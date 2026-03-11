import { initAuth } from "./shared/services/auth.js";
import { renderNavbar } from "./shared/navbar/navbar-component.js";
import { renderLoader, hideLoader } from "./shared/loader/loader-component.js";

import { db } from "./shared/services/firebase.js";

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const lostGrid = document.getElementById("lostItemsGrid");
const foundGrid = document.getElementById("foundItemsGrid");

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();

  await initAuth();
  await renderNavbar();

  await loadLostItems();
  await loadFoundItems();

  hideLoader();
  app.style.display = "block";
});

function createCard(item) {
  const image =
    item.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";

  const date = new Date(item.dateLost || item.dateFound).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return `
  <div class="item-card">

    <div class="item-card__image">
      <img src="${image}" alt="${item.itemName}">
    </div>

    <div class="item-card__content">

      <h3 class="item-card__title">${item.itemName}</h3>

      <p class="item-card__description">
        ${item.description || ""}
      </p>

      <div class="item-card__meta">

        <div class="item-card__meta-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${item.location || "Location not specified"}</span>
        </div>

        <div class="item-card__meta-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span>${date}</span>
        </div>

      </div>

      <a href="#" class="btn-primary item-card__btn">
        View Details
      </a>

    </div>
  </div>
  `;
}

async function loadLostItems() {
  const q = query(
    collection(db, "lostItems"),
    orderBy("createdAt", "desc"),
    limit(3),
  );

  const snapshot = await getDocs(q);

  lostGrid.innerHTML = "";

  snapshot.forEach((doc) => {
    const item = doc.data();
    lostGrid.innerHTML += createCard(item);
  });
}

async function loadFoundItems() {
  const q = query(
    collection(db, "foundItems"),
    orderBy("createdAt", "desc"),
    limit(3),
  );

  const snapshot = await getDocs(q);

  foundGrid.innerHTML = "";

  snapshot.forEach((doc) => {
    const item = doc.data();
    foundGrid.innerHTML += createCard(item);
  });
}
