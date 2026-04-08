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
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { GEMINI_API } from "../../api.js";

const app = document.getElementById("app");
const lostTitle = document.getElementById("lost-title");
const foundTitle = document.getElementById("found-title");
const lostGrid = document.getElementById("lost-grid");
const foundGrid = document.getElementById("found-grid");
const lostSection = document.querySelector(".lost");
const foundSection = document.querySelector(".found");
const noItems = document.querySelector(".noitems");

// Matches elements
const matchesModal = document.getElementById("matches-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const matchesLoading = document.getElementById("matches-loading");
const matchesEmpty = document.getElementById("matches-empty");
const matchesGrid = document.getElementById("matches-grid");

// Store current items to easily retrieve data by id
window.userItemsMap = {};

document.addEventListener("DOMContentLoaded", async () => {
  renderLoader();
  await initAuth();
  requireAuth();
  await renderNavbar();
  listenLostPosts();
  listenFoundPosts();
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeMatchModal);
  }
});

function createCard(item, docId, type) {
  const image =
    item.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
  const date = new Date(
    item.dateLost || item.dateFound || item.createdAt?.toDate?.() || new Date(),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Store item for matching
  window.userItemsMap[docId] = { ...item, type };

  return `
    <div class="item-card" id="card-${docId}">
      <div class="item-card__image">
        <img src="${image}" alt="${item.itemName}">
      </div>
      <div class="item-card__content">
        <h3 class="item-card__title">${item.itemName || "No Title"}</h3>
        <p class="item-card__description">${item.description || ""}</p>

        <div class="item-card__meta">
          <div class="item-card__meta-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${item.location || "Unknown location"}</span>
          </div>

          <div class="item-card__meta-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            <span>${date}</span>
          </div>
        </div>

        <div class="item-card__actions">
          <button class="btn-view" onclick="viewDetails('${docId}')">View</button>
          <button class="btn-delete" onclick="deletePost('${docId}')">Delete</button>
        </div>
        <button id="match-btn-${docId}" class="btn-match" onclick="findMatches('${docId}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Find Matches
        </button>
      </div>
    </div>`;
}

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
      div.innerHTML = createCard(d.data(), d.id, "lostItems");
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
      div.innerHTML = createCard(d.data(), d.id, "foundItems");
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

window.deletePost = async function (docId) {
  if (!confirm("Delete this post?")) return;
  try {
    await deleteDoc(doc(db, "lostItems", docId));
    await deleteDoc(doc(db, "foundItems", docId));
  } catch (e) {
    console.error(e);
    alert("Error deleting post");
  }
};

window.viewDetails = function (docId) {
  window.location.href = `/pages/item/item.html?id=${docId}`;
};

function checkEmpty() {
  const lostEmpty =
    lostSection.style.display === "none" || lostGrid.children.length === 0;
  const foundEmpty =
    foundSection.style.display === "none" || foundGrid.children.length === 0;
  noItems.style.display = lostEmpty && foundEmpty ? "flex" : "none";
}

// --- AI MATCH UP LOGIC --- //

window.closeMatchModal = function () {
  matchesModal.style.display = "none";
  document.body.style.overflow = "auto";
};

async function fetchCandidates(oppositeType) {
  try {
    const q = query(
      collection(db, oppositeType),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snap = await getDocs(q);
    const candidates = [];
    snap.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
    });
    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

function keywordScore(a, b) {
  const wordsA = (a || "").toLowerCase().split(/\s+/);
  const wordsB = (b || "").toLowerCase().split(/\s+/);

  if (!wordsA.length || !wordsB.length) return 0;

  let matches = 0;
  wordsA.forEach(w1 => {
    wordsB.forEach(w2 => {
      if (w1.length > 2 && w2.length > 2 && (w1.includes(w2) || w2.includes(w1))) {
        matches++;
      }
    });
  });

  return Math.min((matches / wordsA.length) * 100, 100);
}

async function getGeminiScores(currentText, listText) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a strict similarity scoring system.

Compare ONE item with a list of items and assign a match score from 0 to 100.

Item:
${currentText}

Candidates:
${listText}

Return ONLY valid JSON array:
[
  { "index": 1, "score": 85 },
  { "index": 2, "score": 40 }
]

No explanation. No text outside JSON.`
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    let textOut = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (textOut) {
      // Remove any markdown blocks around JSON
      textOut = textOut.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(textOut);
    }
  } catch (err) {
    console.error("Gemini API Error:", err);
  }
  return null;
}

window.findMatches = async function (docId) {
  const sourceData = window.userItemsMap[docId];
  if (!sourceData) return;

  const btn = document.getElementById(`match-btn-${docId}`);
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;"></div> Matching...';

  matchesModal.style.display = "flex";
  document.body.style.overflow = "hidden"; // Prevent background scroll
  matchesLoading.style.display = "flex";
  matchesEmpty.style.display = "none";
  matchesGrid.style.display = "none";
  matchesGrid.innerHTML = "";

  try {
    const currentText = `${sourceData.itemName}. ${sourceData.description}. ${sourceData.location}`;
    const oppositeType = sourceData.type === "lostItems" ? "foundItems" : "lostItems";
    
    const candidates = await fetchCandidates(oppositeType);
    
    if (candidates.length === 0) {
      matchesLoading.style.display = "none";
      matchesEmpty.style.display = "flex";
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
      return;
    }

    const listText = candidates
      .map((c, i) => `${i + 1}. ${c.itemName}. ${c.description}. ${c.location}`)
      .join("\n");

    const geminiScores = await getGeminiScores(currentText, listText);
    
    let scoredCandidates = candidates.map((c, idx) => {
      const kScore = keywordScore(
        currentText,
        `${c.itemName} ${c.description} ${c.location}`
      );
      
      let finalScore = kScore;
      if (geminiScores && Array.isArray(geminiScores)) {
        const geminiMatch = geminiScores.find(g => g.index === idx + 1);
        if (geminiMatch && typeof geminiMatch.score === "number") {
          finalScore = 0.7 * geminiMatch.score + 0.3 * kScore;
        }
      }
      
      return { ...c, matchScore: Math.round(finalScore) };
    });

    // Filter >= 50 and Sort descending
    scoredCandidates = scoredCandidates
      .filter(c => c.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    matchesLoading.style.display = "none";

    if (scoredCandidates.length === 0) {
      matchesEmpty.style.display = "flex";
    } else {
      matchesGrid.style.display = "grid";
      scoredCandidates.forEach(match => {
        const div = document.createElement("div");
        div.innerHTML = renderMatchCard(match);
        matchesGrid.appendChild(div.firstElementChild);
      });
    }

  } catch (error) {
    console.error("Match finding error:", error);
    alert("Error finding matches. Please try again.");
    matchesModal.style.display = "none";
    document.body.style.overflow = "auto";
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
  }
};

function renderMatchCard(item) {
  const image = item.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
  
  let scoreClass = "match-medium";
  if (item.matchScore >= 80) scoreClass = "match-high";

  return `
    <div class="item-card">
      <div class="item-card__image" style="height: 160px;">
        <img src="${image}" alt="${item.itemName}">
      </div>
      <div class="item-card__content">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h3 class="item-card__title">${item.itemName || "No Title"}</h3>
        </div>
        <div class="match-score-badge ${scoreClass}">
          Match: ${item.matchScore}%
        </div>
        <p class="item-card__description" style="margin-top:0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.description || ""}</p>
        
        <div class="item-card__meta" style="margin-top:0.5rem;">
          <div class="item-card__meta-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style="font-size:12px;">${item.location || "Unknown"}</span>
          </div>
        </div>

        <div class="item-card__actions">
          <button class="btn-view" onclick="viewDetails('${item.id}')" style="width: 100%;">View Details</button>
        </div>
      </div>
    </div>
  `;
}
