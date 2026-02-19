function renderNavbar(currentPage = "home") {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const isHome = currentPage === "home";
  const prefix = isHome ? "./" : "../../";

  container.innerHTML = `
<nav id="nav">
  <a href="${prefix}index.html" class="nav-logo">
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
    <a href="${prefix}pages/lost/lost.html">Lost</a>
    <a href="${prefix}pages/found/found.html">Found</a>
  </div>

  <div class="nav-auth-btns">
    <a href="${prefix}pages/login/login.html" class="login-btn">Login</a>
    <a href="${prefix}pages/register/register.html" class="btn-primary">Register</a>
  </div>

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
    <a href="${prefix}pages/lost/lost.html">Lost Items</a>
    <a href="${prefix}pages/found/found.html">Found Items</a>
  </div>

  <div class="drawer-auth">
    <a href="${prefix}pages/login/login.html" class="btn-outline">Login</a>
    <a href="${prefix}pages/register/register.html" class="btn-primary full-width">Register</a>
  </div>
</div>
  `;

  initNavbar();
}
