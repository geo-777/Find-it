import { renderNavbar } from "../../shared/navbar/navbar-component.js";
import {
  renderLoader,
  hideLoader,
} from "../../shared/loader/loader-component.js";
import { initAuth, requireAuth } from "../../shared/services/auth.js";
import { db, auth } from "../../shared/services/firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();

  await initAuth();
  await renderNavbar();

  requireAuth();

  hideLoader();
});

const uploadBox = document.querySelector(".upload-box");
const imageInput = document.getElementById("imageInput");
const imageText = document.getElementById("image-text");
const submitBtn = document.getElementById("submitBtn");
const removeImg = document.getElementById("removeImg");
const uploadIcon = document.getElementById("uploadIcon");

const form = document.getElementById("lostForm");

const itemName = document.getElementById("itemName");
const description = document.getElementById("description");
const locationInput = document.getElementById("location");
const dateLost = document.getElementById("dateLost");

const itemNameError = document.getElementById("itemNameError");
const descriptionError = document.getElementById("descriptionError");
const locationError = document.getElementById("locationError");
const dateError = document.getElementById("dateError");

uploadBox.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  if (imageInput.files.length > 0) {
    imageText.textContent = imageInput.files[0].name;
    removeImg.style.display = "flex";
    uploadIcon.style.display = "none";
  }
});

removeImg.addEventListener("click", (e) => {
  e.stopPropagation();

  imageInput.value = "";
  imageText.textContent = "Click to upload image";

  removeImg.style.display = "none";
  uploadIcon.style.display = "block";
});

function clearErrors() {
  itemNameError.textContent = "";
  descriptionError.textContent = "";
  locationError.textContent = "";
  dateError.textContent = "";

  itemName.classList.remove("input-error");
  description.classList.remove("input-error");
  locationInput.classList.remove("input-error");
  dateLost.classList.remove("input-error");
}

async function uploadToCloudinary(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "findit");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dmh54ix9o/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Image upload failed");
  }

  return data.secure_url;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearErrors();

  let valid = true;

  if (itemName.value.trim() === "") {
    itemNameError.textContent = "Required";
    itemName.classList.add("input-error");
    valid = false;
  }

  if (description.value.trim() === "") {
    descriptionError.textContent = "Required";
    description.classList.add("input-error");
    valid = false;
  }

  if (locationInput.value.trim() === "") {
    locationError.textContent = "Required";
    locationInput.classList.add("input-error");
    valid = false;
  }

  if (dateLost.value === "") {
    dateError.textContent = "Required";
    dateLost.classList.add("input-error");
    valid = false;
  } else {
    const selectedDate = new Date(dateLost.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      dateError.textContent = "Cannot be future date";
      dateLost.classList.add("input-error");
      valid = false;
    }
  }

  if (!valid) return;

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    let imageUrl = null;

    // Upload image if provided
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      imageUrl = await uploadToCloudinary(file);
    }

    // Store document in Firestore
    await addDoc(collection(db, "lostItems"), {
      itemName: itemName.value.trim(),
      description: description.value.trim(),
      location: locationInput.value.trim(),
      dateLost: dateLost.value,
      imageUrl: imageUrl,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    alert("Lost item posted successfully");

    form.reset();

    imageText.textContent = "Click to upload image";
    removeImg.style.display = "none";
    uploadIcon.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("Something went wrong while posting");
  } finally {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
});
