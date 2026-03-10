function renderLoader() {
  const container = document.getElementById("loader-container");
  if (!container) return;

  container.innerHTML = `
  <div class="app-loader" id="appLoader">
      <div class="loader-content">
          <div class="spinner2"></div>
          <p class="loader-text">Loading...</p>
      </div>
  </div>
  `;
}

function hideLoader() {
  const loader = document.getElementById("appLoader");

  if (!loader) return;

  loader.classList.add("fade-out");

  setTimeout(() => {
    loader.remove();
  }, 300);
}

export { renderLoader, hideLoader };
