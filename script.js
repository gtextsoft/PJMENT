(function () {
  const DEADLINE = new Date("2026-09-12T23:59:59+01:00").getTime();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const diff = Math.max(0, DEADLINE - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(val);
    };
    set("cd-days", d);
    set("cd-hours", h);
    set("cd-mins", m);
    set("cd-secs", s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("is-scrolled", window.scrollY > 40);
      },
      { passive: true }
    );
  }

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuClose = document.getElementById("menuClose");

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-item__a");
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach(function (el) {
        el.classList.remove("is-open");
        const q = el.querySelector(".faq-item__q");
        const a = el.querySelector(".faq-item__a");
        if (q) q.setAttribute("aria-expanded", "false");
        if (a) a.style.maxHeight = "";
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Sticky price bar — show on landing, hide near payment / if dismissed */
  const priceSticky = document.getElementById("priceSticky");
  const priceStickyClose = document.getElementById("priceStickyClose");
  const STICKY_KEY = "pjment_price_sticky_dismissed";

  function setStickyVisible(show) {
    if (!priceSticky) return;
    if (show && !sessionStorage.getItem(STICKY_KEY)) {
      priceSticky.classList.add("is-visible");
      priceSticky.classList.remove("is-hidden");
      document.body.classList.add("has-price-sticky");
    } else {
      priceSticky.classList.remove("is-visible");
      document.body.classList.remove("has-price-sticky");
    }
  }

  if (priceSticky && !sessionStorage.getItem(STICKY_KEY)) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        setStickyVisible(true);
      }, 400);
    });

    if (priceStickyClose) {
      priceStickyClose.addEventListener("click", function () {
        sessionStorage.setItem(STICKY_KEY, "1");
        priceSticky.classList.add("is-dismissed");
        setStickyVisible(false);
      });
    }

    const hideTargets = ["#investment", "#register", ".price-card"];
    if ("IntersectionObserver" in window) {
      const hideIo = new IntersectionObserver(
        function (entries) {
          const anyVisible = entries.some(function (e) {
            return e.isIntersecting && e.intersectionRatio > 0.15;
          });
          if (anyVisible) {
            priceSticky.classList.add("is-hidden");
            document.body.classList.remove("has-price-sticky");
          } else if (!sessionStorage.getItem(STICKY_KEY)) {
            priceSticky.classList.remove("is-hidden");
            if (priceSticky.classList.contains("is-visible")) {
              document.body.classList.add("has-price-sticky");
            }
          }
        },
        { threshold: [0, 0.15, 0.4] }
      );
      hideTargets.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          hideIo.observe(el);
        });
      });
    }
  }
})();
