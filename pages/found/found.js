import { initAuth } from "../../shared/services/auth.js";
import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";

import { db } from "../../shared/services/firebase.js";

import {
  collection,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const foundGrid = document.getElementById("foundGrid");
const searchInput = document.getElementById("search");
const app = document.getElementById("app");

let foundItems = [];
let debounceTimer;

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();

  await initAuth();
  await renderNavbar();

  await loadFoundItems();

  hideLoader();
  app.style.display = "block";
});

function createCard(item, searchQuery = "") {
  const image =
    item.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";

  const date = new Date(item.dateFound).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = highlightText(item.itemName || "", searchQuery);
  const desc = highlightText(item.description || "", searchQuery);
  const location = highlightText(
    item.location || "Location not specified",
    searchQuery,
  );

  return `
  <div class="item-card">

    <div class="item-card__image">
      <img src="${image}" alt="${item.itemName}">
    </div>

    <div class="item-card__content">

      <h3 class="item-card__title">${title}</h3>

      <p class="item-card__description">
        ${desc}
      </p>

      <div class="item-card__meta">

        <div class="item-card__meta-row">
          <span>${location}</span>
        </div>

        <div class="item-card__meta-row">
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

async function loadFoundItems() {
  const q = query(collection(db, "foundItems"), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  foundItems = [];

  snapshot.forEach((doc) => {
    foundItems.push(doc.data());
  });

  renderItems(foundItems);
}

function renderItems(items, searchQuery = "") {
  foundGrid.innerHTML = "";

  if (items.length === 0) {
    foundGrid.innerHTML =
      "<p style='grid-column:1/-1;text-align:center;'>No items found.</p>";
    return;
  }

  items.forEach((item) => {
    foundGrid.innerHTML += createCard(item, searchQuery);
  });
}

function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");

  return text.replace(regex, `<mark>$1</mark>`);
}

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const query = searchInput.value.trim().toLowerCase();

    const filteredItems = foundItems.filter((item) => {
      const title = item.itemName?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const location = item.location?.toLowerCase() || "";

      return (
        title.includes(query) ||
        desc.includes(query) ||
        location.includes(query)
      );
    });

    renderItems(filteredItems, query);
  }, 300);
});
