import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth, requireAuth, user } from "../../shared/services/auth.js";
import { db } from "../../shared/services/firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = document.getElementById("app");
const lostTitle = document.getElementById("lost-title");
const foundTitle = document.getElementById("found-title");
const lostGrid = document.getElementById("lost-grid");
const foundGrid = document.getElementById("found-grid");
const lostSection = document.querySelector(".lost");
const foundSection = document.querySelector(".found");
const noItems = document.querySelector(".noitems");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();
  requireAuth();
  await renderNavbar();

  listenLostPosts();
  listenFoundPosts();
});

function createCard(item, docId, type) {
  const image =
    item.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
  const date = new Date(item.dateLost || item.dateFound).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return `
    <div class="item-card" id="card-${docId}">
      <div class="item-card__image"><img src="${image}" alt="${item.itemName}"></div>
      <div class="item-card__content">
        <h3 class="item-card__title">${item.itemName}</h3>
        <p class="item-card__description">${item.description || ""}</p>
        <div class="item-card__meta">
          <div class="item-card__meta-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${item.location || "Unknown location"}</span>
          </div>
          <div class="item-card__meta-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="4" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span>${date}</span>
          </div>
        </div>
        <div class="item-card__actions">
          <button class="btn-view" onclick="viewDetails('${docId}','${type}')">View</button>
          <button class="btn-delete" onclick="deletePost('${docId}','${type}')">Delete</button>
        </div>
      </div>
    </div>`;
}

// LISTEN LOST POSTS
function listenLostPosts() {
  const q = query(
    collection(db, "lostItems"),
    where("createdBy", "==", user.uid),
    orderBy("createdAt", "desc"),
  );
  onSnapshot(q, (snapshot) => {
    const fragment = document.createDocumentFragment();
    lostGrid.innerHTML = "";

    snapshot.forEach((d) => {
      const div = document.createElement("div");
      div.innerHTML = createCard(d.data(), d.id, "lost");
      fragment.appendChild(div.firstElementChild);
    });
    lostGrid.appendChild(fragment);

    lostSection.style.display = snapshot.size > 0 ? "block" : "none";
    lostTitle.textContent = `My Lost Items (${snapshot.size})`;
    checkEmpty();
    hideLoader();
    app.style.display = "block";
  });
}

// LISTEN FOUND POSTS
function listenFoundPosts() {
  const q = query(
    collection(db, "foundItems"),
    where("createdBy", "==", user.uid),
    orderBy("createdAt", "desc"),
  );
  onSnapshot(q, (snapshot) => {
    const fragment = document.createDocumentFragment();
    foundGrid.innerHTML = "";

    snapshot.forEach((d) => {
      const div = document.createElement("div");
      div.innerHTML = createCard(d.data(), d.id, "found");
      fragment.appendChild(div.firstElementChild);
    });
    foundGrid.appendChild(fragment);

    foundSection.style.display = snapshot.size > 0 ? "block" : "none";
    foundTitle.textContent = `My Found Items (${snapshot.size})`;
    checkEmpty();
    hideLoader();
    app.style.display = "block";
  });
}

// DELETE POST
window.deletePost = async function (docId, type) {
  if (!confirm("Delete this post?")) return;
  const collectionName = type === "lost" ? "lostItems" : "foundItems";
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (e) {
    console.error(e);
    alert("Error deleting post");
  }
};

// VIEW DETAILS
window.viewDetails = function (docId, type) {
  const page =
    type === "lost"
      ? "../lost-details/lost-details.html"
      : "../found-details/found-details.html";
  window.location.href = `${page}?id=${docId}`;
};

// EMPTY STATE
function checkEmpty() {
  const lostEmpty =
    lostSection.style.display === "none" || lostGrid.children.length === 0;
  const foundEmpty =
    foundSection.style.display === "none" || foundGrid.children.length === 0;
  noItems.style.display = lostEmpty && foundEmpty ? "flex" : "none";
}
