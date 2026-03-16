import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth } from "../../shared/services/auth.js";
import { db } from "../../shared/services/firebase.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();
  await renderNavbar();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || window.location.hash.slice(1);

  if (!id) {
    alert("No item selected!");
    window.location.href = "/";
    return;
  }

  const collections = ["foundItems", "lostItems"];
  let itemData = null;
  let itemType = null;

  for (const col of collections) {
    const docRef = doc(db, col, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      itemData = docSnap.data();
      itemType = col === "foundItems" ? "Found" : "Lost";
      break;
    }
  }

  const container = document.getElementById("app");

  if (!itemData) {
    container.innerHTML = "<p>Item not found!</p>";
  } else {
    let userInfo = { name: "Anonymous", phone: "N/A", email: "N/A" };
    if (itemData.createdBy) {
      const userRef = doc(db, "users", itemData.createdBy);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userInfo = userSnap.data();
      }
    }

    renderItem(itemData, itemType, userInfo);
  }

  hideLoader();
  app.style.display = "block";
});

function renderItem(item, type, user) {
  document.getElementById("item-image").src =
    item.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";

  const statusTag = document.getElementById("item-status");
  statusTag.innerText = type;
  statusTag.style.backgroundColor = type === "Found" ? "#dcfce7" : "#fcdedc";
  statusTag.style.color = type === "Found" ? "#166534" : "#651616";

  document.getElementById("item-title").innerText = item.itemName || "No Title";
  document.getElementById("item-description").innerText =
    item.description || "No Description";
  document.getElementById("item-location").innerText =
    item.location || "Location not specified";

  const dateField =
    item.dateFound || item.dateLost || item.createdAt?.toDate?.() || new Date();
  const formattedDate = new Date(dateField).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("item-date").innerText = formattedDate;

  document.getElementById("contact-name").innerText = user.name || "Anonymous";
  document.getElementById("contact-phone").innerText = user.phone || "N/A";
  document.getElementById("contact-email").innerText = user.email || "N/A";
}
