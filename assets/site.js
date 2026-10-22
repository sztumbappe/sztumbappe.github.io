(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.dataset.open !== "true";
      nav.dataset.open = String(open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const images = document.querySelectorAll("[data-lightbox]");
  if (images.length) {
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "图片预览");
    dialog.innerHTML = '<div class="lightbox-close"><button type="button" aria-label="关闭图片预览">关闭 ×</button></div><img alt="">';
    document.body.append(dialog);
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    images.forEach((button) => button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const preview = dialog.querySelector("img");
      preview.src = image.dataset.full || image.currentSrc || image.src;
      preview.alt = image.alt;
      dialog.showModal();
    }));
  }
})();
