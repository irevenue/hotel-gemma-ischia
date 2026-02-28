/* ============================================
   Hotel Gemma - Main JavaScript
   Dynamic Smooth Motion & Interactivity
   ============================================ */

(function () {
  "use strict";

  // ============================================
  // SMOOTH SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.createElement("div");
  scrollProgress.classList.add("scroll-progress");
  document.body.prepend(scrollProgress);

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  // ============================================
  // NAVIGATION
  // ============================================
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function handleNavScroll() {
    const scrolled = window.scrollY > 60;
    nav.classList.toggle("nav--scrolled", scrolled);
  }

  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("nav__menu--open");
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("nav__menu--open");
    });
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  function initScrollReveal() {
    // Add reveal classes to elements
    const revealMappings = [
      { selector: ".section__header", className: "reveal" },
      { selector: ".about__images", className: "reveal--left" },
      { selector: ".about__content", className: "reveal--right" },
      { selector: ".room-card", className: "reveal" },
      { selector: ".amenity-card", className: "reveal" },
      { selector: ".dining__content", className: "reveal--left" },
      { selector: ".dining__images", className: "reveal--right" },
      { selector: ".gallery__item", className: "reveal--scale" },
      { selector: ".location__map", className: "reveal--left" },
      { selector: ".location__info", className: "reveal--right" },
      { selector: ".thermal-banner__content", className: "reveal" },
      { selector: ".contact__info", className: "reveal--left" },
      { selector: ".contact__form", className: "reveal--right" },
      { selector: ".about__stats", className: "reveal" },
      { selector: ".reviews__platforms", className: "reveal" },
      { selector: ".reviews__carousel-wrapper", className: "reveal" },
    ];

    revealMappings.forEach(function (mapping) {
      document.querySelectorAll(mapping.selector).forEach(function (el) {
        el.classList.add(mapping.className);
      });
    });

    // Stagger amenities, rooms, and reviews platform grids
    document
      .querySelectorAll(".amenities__grid, .rooms__grid, .reviews__platforms")
      .forEach(function (grid) {
        grid.classList.add("stagger-children");
        grid.classList.add("reveal");
      });

    // Intersection Observer for reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    };

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(
        ".reveal, .reveal--left, .reveal--right, .reveal--scale",
      )
      .forEach(function (el) {
        revealObserver.observe(el);
      });
  }

  // ============================================
  // PARALLAX SCROLLING
  // ============================================
  const parallaxElements = [];

  function initParallax() {
    // Hero background parallax
    const heroBg = document.querySelector(".hero__bg-img");
    if (heroBg) {
      parallaxElements.push({ el: heroBg, speed: 0.3, type: "translate" });
    }

    // Amenities background parallax
    const amenitiesBg = document.querySelector(".amenities__bg img");
    if (amenitiesBg) {
      parallaxElements.push({
        el: amenitiesBg,
        speed: 0.15,
        type: "translate",
      });
    }

    // Thermal banner parallax
    const thermalBg = document.querySelector(".thermal-banner__bg img");
    if (thermalBg) {
      parallaxElements.push({ el: thermalBg, speed: 0.15, type: "translate" });
    }
  }

  function updateParallax() {
    const scrollTop = window.scrollY;

    parallaxElements.forEach(function (item) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const yOffset = scrollTop * item.speed;
        item.el.style.transform = `translateY(${yOffset}px) scale(1.1)`;
      }
    });
  }

  // ============================================
  // SMOOTH COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    const counters = document.querySelectorAll("[data-target]");

    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const target = parseFloat(entry.target.dataset.target);
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              const current = eased * target;

              if (isFloat) {
                entry.target.textContent = current.toFixed(1);
              } else {
                entry.target.textContent = Math.floor(current);
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                entry.target.textContent = isFloat ? target.toFixed(1) : target;
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // ============================================
  // TILT EFFECT ON CARDS
  // ============================================
  function initTiltEffect() {
    const cards = document.querySelectorAll(".room-card, .amenity-card");

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  // ============================================
  // MAGNETIC BUTTON EFFECT
  // ============================================
  function initMagneticButtons() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  // ============================================
  // GALLERY LIGHTBOX
  // ============================================
  function initLightbox() {
    // Create lightbox element
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Close">&times;</button>
      <img class="lightbox__img" src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector(".lightbox__img");
    const lightboxClose = lightbox.querySelector(".lightbox__close");

    document.querySelectorAll(".gallery__item img").forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("lightbox--active");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("lightbox--active");
      document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // ============================================
  // SMOOTH ANCHOR SCROLLING
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = nav.offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top + window.scrollY - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // ============================================
  // IMAGE REVEAL ON SCROLL
  // ============================================
  function initImageReveal() {
    const images = document.querySelectorAll(".about__img, .dining__img");

    images.forEach(function (img) {
      img.classList.add("img-reveal");
    });

    const imgObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            imgObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    images.forEach(function (img) {
      imgObserver.observe(img);
    });
  }

  // ============================================
  // MOUSE CURSOR GLOW EFFECT
  // ============================================
  function initCursorGlow() {
    const glow = document.createElement("div");
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200,149,108,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.opacity = "1";
    });

    document.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + "px";
      glow.style.top = glowY + "px";
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ============================================
  // CONTACT FORM HANDLING
  // ============================================
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function () {
        submitBtn.textContent = "Request Sent!";
        submitBtn.style.background = "#4a9e7a";

        setTimeout(function () {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ============================================
  // SMOOTH SCROLL ON RAF (REQUEST ANIMATION FRAME)
  // ============================================
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavScroll();
        updateScrollProgress();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ============================================
  // HEADER TEXT ANIMATION
  // ============================================
  function initTextSplit() {
    const heroTitle = document.querySelector(".hero__title");
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.innerHTML = "";

    text.split("").forEach(function (char, i) {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(50px) rotateX(-90deg);
        animation: letterReveal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: ${0.5 + i * 0.04}s;
      `;
      heroTitle.appendChild(span);
    });

    // Add the keyframe
    const style = document.createElement("style");
    style.textContent = `
      @keyframes letterReveal {
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // SMOOTH HORIZONTAL MARQUEE FOR FOOTER
  // ============================================
  function initFloatingElements() {
    // Add subtle floating animation to about images
    const aboutImg2 = document.querySelector(".about__img--2");
    if (aboutImg2) {
      aboutImg2.classList.add("float");
    }

    const diningImg2 = document.querySelector(".dining__img--2");
    if (diningImg2) {
      diningImg2.style.animation = "float 7s ease-in-out 1s infinite";
    }
  }

  // ============================================
  // LANGUAGE SWITCHER
  // ============================================
  function initLanguageSwitcher() {
    var LANG_FLAGS = {
      it: "\u{1F1EE}\u{1F1F9}",
      en: "\u{1F1EC}\u{1F1E7}",
      fr: "\u{1F1EB}\u{1F1F7}",
      de: "\u{1F1E9}\u{1F1EA}",
      ru: "\u{1F1F7}\u{1F1FA}",
    };

    var LANG_CODES = {
      it: "IT",
      en: "EN",
      fr: "FR",
      de: "DE",
      ru: "RU",
    };

    var langToggle = document.getElementById("langToggle");
    var langDropdown = document.getElementById("langDropdown");
    var currentFlag = document.getElementById("currentFlag");
    var currentLang = document.getElementById("currentLang");

    if (!langToggle || !langDropdown) return;

    // Get saved language or detect from browser
    var savedLang = localStorage.getItem("hotelGemmaLang");
    var currentLanguage = savedLang || detectBrowserLanguage();

    function detectBrowserLanguage() {
      var browserLang = (navigator.language || navigator.userLanguage || "it")
        .substring(0, 2)
        .toLowerCase();
      var supportedLangs = ["it", "en", "fr", "de", "ru"];
      return supportedLangs.indexOf(browserLang) !== -1 ? browserLang : "it";
    }

    function applyTranslations(lang) {
      var elements = document.querySelectorAll("[data-i18n]");
      elements.forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        if (
          typeof TRANSLATIONS !== "undefined" &&
          TRANSLATIONS[key] &&
          TRANSLATIONS[key][lang]
        ) {
          var tagName = el.tagName.toLowerCase();
          if (tagName === "option") {
            el.textContent = TRANSLATIONS[key][lang];
          } else {
            el.textContent = TRANSLATIONS[key][lang];
          }
        }
      });

      // Update HTML lang attribute
      document.documentElement.lang = lang;
    }

    function setActiveOption(lang) {
      var options = langDropdown.querySelectorAll(".lang-switcher__option");
      options.forEach(function (opt) {
        opt.classList.toggle(
          "lang-switcher__option--active",
          opt.getAttribute("data-lang") === lang,
        );
      });
    }

    function switchLanguage(lang) {
      currentLanguage = lang;
      localStorage.setItem("hotelGemmaLang", lang);
      currentFlag.textContent = LANG_FLAGS[lang] || LANG_FLAGS.it;
      currentLang.textContent = LANG_CODES[lang] || LANG_CODES.it;
      setActiveOption(lang);
      applyTranslations(lang);
      langDropdown.classList.remove("lang-switcher__dropdown--open");
    }

    // Toggle dropdown
    langToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle("lang-switcher__dropdown--open");
    });

    // Handle language selection
    langDropdown
      .querySelectorAll(".lang-switcher__option")
      .forEach(function (option) {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          var lang = this.getAttribute("data-lang");
          switchLanguage(lang);
        });
      });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      langDropdown.classList.remove("lang-switcher__dropdown--open");
    });

    // Apply saved or detected language on load
    switchLanguage(currentLanguage);
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    function toggleButton() {
      var show = window.scrollY > 600;
      btn.classList.toggle("back-to-top--visible", show);
    }

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleButton, { passive: true });
  }

  // ============================================
  // REVIEWS CAROUSEL
  // ============================================
  function initReviewsCarousel() {
    var track = document.getElementById("reviewsTrack");
    var dotsContainer = document.getElementById("reviewsDots");
    var prevBtn = document.querySelector(".reviews__arrow--prev");
    var nextBtn = document.querySelector(".reviews__arrow--next");

    if (!track || !dotsContainer) return;

    var cards = track.querySelectorAll(".review-card");
    var totalCards = cards.length;
    var currentIndex = 0;
    var cardsPerView = 3;
    var autoPlayInterval = null;
    var isDragging = false;
    var startX = 0;
    var currentTranslate = 0;
    var dragOffset = 0;

    function getCardsPerView() {
      var width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, totalCards - cardsPerView);
    }

    function buildDots() {
      dotsContainer.innerHTML = "";
      var maxIdx = getMaxIndex();
      for (var i = 0; i <= maxIdx; i++) {
        var dot = document.createElement("button");
        dot.classList.add("reviews__dot");
        dot.setAttribute("aria-label", "Go to review " + (i + 1));
        if (i === currentIndex) {
          dot.classList.add("reviews__dot--active");
        }
        dot.addEventListener(
          "click",
          (function (idx) {
            return function () {
              goToSlide(idx);
            };
          })(i),
        );
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      var dots = dotsContainer.querySelectorAll(".reviews__dot");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("reviews__dot--active", i === currentIndex);
      });
    }

    function goToSlide(index) {
      var maxIdx = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIdx));

      var card = cards[0];
      if (!card) return;
      var cardStyle = window.getComputedStyle(card);
      var cardWidth = card.offsetWidth;
      var gap = parseFloat(cardStyle.marginRight) || 16;

      // Calculate gap from CSS
      var trackStyle = window.getComputedStyle(track);
      gap = parseFloat(trackStyle.gap) || 16;

      currentTranslate = -(currentIndex * (cardWidth + gap));
      track.style.transform = "translateX(" + currentTranslate + "px)";
      updateDots();
    }

    function nextSlide() {
      var maxIdx = getMaxIndex();
      goToSlide(currentIndex >= maxIdx ? 0 : currentIndex + 1);
    }

    function prevSlide() {
      var maxIdx = getMaxIndex();
      goToSlide(currentIndex <= 0 ? maxIdx : currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Touch/drag support
    function onDragStart(e) {
      isDragging = true;
      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      track.style.transition = "none";
      stopAutoPlay();
    }

    function onDragMove(e) {
      if (!isDragging) return;
      var currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      dragOffset = currentX - startX;
      track.style.transform =
        "translateX(" + (currentTranslate + dragOffset) + "px)";
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = "";

      var threshold = 80;
      if (dragOffset < -threshold) {
        nextSlide();
      } else if (dragOffset > threshold) {
        prevSlide();
      } else {
        goToSlide(currentIndex);
      }
      dragOffset = 0;
      startAutoPlay();
    }

    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    // Mouse drag
    track.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    // Touch drag
    track.addEventListener("touchstart", onDragStart, { passive: true });
    track.addEventListener("touchmove", onDragMove, { passive: true });
    track.addEventListener("touchend", onDragEnd);

    // Prevent link dragging
    track.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // Handle resize
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var newPerView = getCardsPerView();
        if (newPerView !== cardsPerView) {
          cardsPerView = newPerView;
          if (currentIndex > getMaxIndex()) {
            currentIndex = getMaxIndex();
          }
          buildDots();
        }
        goToSlide(currentIndex);
      }, 200);
    });

    // Pause on hover
    var carousel = document.getElementById("reviewsCarousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoPlay);
      carousel.addEventListener("mouseleave", startAutoPlay);
    }

    // Initialize
    cardsPerView = getCardsPerView();
    buildDots();
    goToSlide(0);
    startAutoPlay();
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    initTextSplit();
    initScrollReveal();
    initParallax();
    animateCounters();
    initTiltEffect();
    initMagneticButtons();
    initLightbox();
    initSmoothScroll();
    initImageReveal();
    initCursorGlow();
    initContactForm();
    initFloatingElements();
    initBackToTop();
    initReviewsCarousel();
    initLanguageSwitcher();

    // Scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial calls
    handleNavScroll();
    updateScrollProgress();
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
