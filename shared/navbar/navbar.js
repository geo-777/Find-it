function initNavbar() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const drawerClose = document.getElementById("drawerClose");

  if (!menuBtn) return;

  function openDrawer() {
    mobileDrawer.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    mobileDrawer.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  mobileOverlay.addEventListener("click", closeDrawer);
}
