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

  const videos = [...document.querySelectorAll("video[data-autoplay-visible]")];
  if (videos.length && "IntersectionObserver" in window) {
    const playback = new WeakMap();
    const stateFor = (video) => {
      let state = playback.get(video);
      if (!state) {
        state = { visible: false, autoPaused: false, pauseRequested: false, userPaused: false };
        playback.set(video, state);
        video.muted = true;
        video.addEventListener("pause", () => {
          if (state.pauseRequested) {
            state.pauseRequested = false;
          } else if (!video.ended) {
            state.userPaused = true;
          }
        });
        video.addEventListener("play", () => {
          state.userPaused = false;
          state.autoPaused = false;
        });
      }
      return state;
    };
    const pauseAutomatically = (video, state) => {
      if (video.paused || video.ended) return;
      state.autoPaused = true;
      state.pauseRequested = true;
      video.pause();
    };
    const playWhenAllowed = (video, state) => {
      if (!state.visible || document.hidden || state.userPaused || video.ended) return;
      const result = video.play();
      if (result && typeof result.catch === "function") result.catch(() => {});
    };
    videos.forEach((video) => stateFor(video));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const state = stateFor(video);
        state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (state.visible) {
          if (state.autoPaused) state.autoPaused = false;
          playWhenAllowed(video, state);
        } else {
          pauseAutomatically(video, state);
        }
      });
    }, { threshold: 0.5 });
    videos.forEach((video) => observer.observe(video));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        videos.forEach((video) => pauseAutomatically(video, stateFor(video)));
      } else {
        videos.forEach((video) => playWhenAllowed(video, stateFor(video)));
      }
    });
  }
})();
