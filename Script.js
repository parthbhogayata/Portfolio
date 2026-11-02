(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var header = document.getElementById("site-header");
  var themeToggle = document.getElementById("theme-toggle");
  var menuToggle = document.getElementById("menu-toggle");
  var navigation = document.getElementById("primary-navigation");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var year = document.getElementById("current-year");
  var themeStorageKey = "parth-portfolio-theme";

  body.classList.add("js-ready");

  function updateThemeControl() {
    var isDark = root.dataset.theme === "dark";
    var nextTheme = isDark ? "light" : "dark";
    themeToggle.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
    themeToggle.setAttribute("title", "Switch to " + nextTheme + " theme");

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#080d18" : "#f5f7fb");
    }
  }

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    updateThemeControl();

    if (persist) {
      try {
        localStorage.setItem(themeStorageKey, theme);
      } catch (error) {
        // The theme still works when browser storage is unavailable.
      }
    }
  }

  function closeMenu() {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    body.classList.remove("menu-open");
  }

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 18);
  }

  updateThemeControl();
  updateHeader();

  themeToggle.addEventListener("click", function () {
    var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
  });

  menuToggle.addEventListener("click", function () {
    var willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    body.classList.toggle("menu-open", willOpen);
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach(function (element) {
      revealObserver.observe(element);
    });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
