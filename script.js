/* ============================================================
   Padma Travels — script.js (Nationwide + International)
   Sticky nav, mobile menu, BN/EN toggle, scroll-to-top,
   reveal animations, Formspree form handling.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. MOBILE MENU ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  /* ---------- 2. LANGUAGE TOGGLE (BN / EN) ---------- */
  const langToggle = document.getElementById("langToggle");
  const langLabel = document.getElementById("langLabel");
  const htmlRoot = document.getElementById("htmlRoot");
  const body = document.body;

  const setLanguage = (lang) => {
    const isEN = lang === "en";
    body.classList.toggle("lang-en", isEN);
    htmlRoot.setAttribute("lang", isEN ? "en" : "bn");
    langLabel.textContent = isEN ? "বাংলা" : "EN";

    document.querySelectorAll("[data-bn][data-en]").forEach((el) => {
      el.textContent = isEN ? el.dataset.en : el.dataset.bn;
    });

    localStorage.setItem("padma-lang", lang);
  };

  const savedLang = localStorage.getItem("padma-lang") || "bn";
  setLanguage(savedLang);

  langToggle?.addEventListener("click", () => {
    const current = body.classList.contains("lang-en") ? "en" : "bn";
    setLanguage(current === "bn" ? "en" : "bn");
  });

  /* ---------- 3. STICKY NAV SHADOW ---------- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    } else {
      navbar.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    }
  });

  /* ---------- 4. SCROLL-TO-TOP ---------- */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const hero = document.getElementById("hero");

  const toggleScrollTop = () => {
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 600;
    if (window.scrollY > heroBottom - 100) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleScrollTop);
  toggleScrollTop();

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("active"));
  }

  /* ---------- 6. FORM SUBMISSION via Formspree ---------- */
  const form = document.getElementById("bookingForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();

      if (!name || !email) {
        formStatus.textContent =
          "অনুগ্রহ করে নাম ও ইমেইল দিন। / Please provide name & email.";
        formStatus.className = "form-status error";
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "পাঠানো হচ্ছে... / Sending...";
      formStatus.textContent = "";
      formStatus.className = "form-status";

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          form.reset();
          formStatus.textContent =
            "✓ ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব। / Thank you! We'll contact you soon.";
          formStatus.className = "form-status success";
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formStatus.textContent =
          "⚠️ দুঃখিত, পাঠানো যায়নি। সরাসরি ফোন করুন। / Sorry, could not send. Please call us.";
        formStatus.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ---------- 7. SMOOTH SCROLL WITH NAV OFFSET ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos =
          target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
});
