import { initAuth, logout, user, isLoggedIn } from "../services/auth.js";

async function renderNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const myPostsLink = isLoggedIn
    ? `<a href="/pages/my-posts/my-posts.html">My Posts</a>`
    : "";

  const mobileMyPostsLink = isLoggedIn
    ? `<a href="/pages/my-posts/my-posts.html">My Posts</a>`
    : "";

  const authSection = isLoggedIn
    ? `
      <div class="nav-user">
        <span class="nav-username">Hello, <span>${user.displayName || "User"}</span></span>
        <button id="logoutBtn" class="logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
        Logout</button>
      </div>
    `
    : `
      <div class="nav-auth-btns">
        <a href="/pages/login/login.html" class="login-btn">Login</a>
        <a href="/pages/register/register.html" class="btn-primary">Register</a>
      </div>
    `;

  const mobileAuth = isLoggedIn
    ? `
      <div class="drawer-auth">
        <span class="drawer-user">Hello, ${user.displayName || "User"}</span>
        <button id="mobileLogoutBtn" class="btn-outline full-width">Logout</button>
      </div>
    `
    : `
      <div class="drawer-auth">
        <a href="/pages/login/login.html" class="btn-outline">Login</a>
        <a href="/pages/register/register.html" class="btn-primary full-width">Register</a>
      </div>
    `;

  container.innerHTML = `
<nav id="nav">
  <a href="/index.html" class="nav-logo">
    <span class="logo-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" />
      </svg>
    </span>
    <span class="logo-text">Findit</span>
  </a>

  <div class="nav-links">
    <a href="/pages/lost/lost.html">Lost</a>
    <a href="/pages/found/found.html">Found</a>
    ${myPostsLink}
  </div>

  ${authSection}

  <button class="nav-menu-btn" id="menuBtn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  </button>
</nav>

<div class="mobile-overlay" id="mobileOverlay"></div>

<div class="mobile-drawer" id="mobileDrawer">
  <div class="drawer-header">
    <div class="drawer-logo">
      <span class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </span>
      <span class="logo-text">Findit</span>
    </div>

    <button class="drawer-close" id="drawerClose">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>

  <div class="drawer-links">
    <a href="/pages/lost/lost.html">Lost Items</a>
    <a href="/pages/found/found.html">Found Items</a>
    ${mobileMyPostsLink}
  </div>

  ${mobileAuth}

</div>
`;

  initNavbar();

  const logoutBtn = document.getElementById("logoutBtn");
  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "/index.html";
    });
  }

  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", async () => {
      await logout();
      window.location.href = "/index.html";
    });
  }
}

export { renderNavbar };
