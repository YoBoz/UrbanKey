// UrbanKey trading interactions.
// Handles mobile menu, smooth scroll, reveal animation, CTA WhatsApp links, and enquiry form flow.
(function () {
  const WHATSAPP_NUMBER = "971561093935";

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const form = document.getElementById("enquiryForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");
  const revealItems = document.querySelectorAll(".reveal");
  const servicesTrack = document.getElementById("servicesTrack");
  const servicesSlides = servicesTrack ? Array.from(servicesTrack.children) : [];
  const servicesDotsWrap = document.getElementById("servicesDots");
  const servicesPrev = document.getElementById("servicesPrev");
  const servicesNext = document.getElementById("servicesNext");

  const buildWaUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const openWa = (message) => window.open(buildWaUrl(message), "_blank", "noopener");

  // Keep all WhatsApp CTAs consistent with one canonical number.
  document.querySelectorAll("a[data-wa]").forEach((link) => {
    const fallback = "Hello UrbanKey, I have a general trading enquiry.";
    const existingText = new URL(link.href).searchParams.get("text");
    link.href = buildWaUrl(existingText || fallback);
  });

  // Mobile navigation behavior with accessibility state updates.
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for internal section links.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  // Fade-in sections and cards when they enter the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    observer.observe(item);
  });

  // Services slideshow: arrows, dots, autoplay, and pause on interaction.
  if (servicesTrack && servicesSlides.length > 1 && servicesDotsWrap) {
    let currentIndex = 0;
    let timer;

    const dots = servicesSlides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "services-dot";
      dot.setAttribute("aria-label", `Go to service ${index + 1}`);
      dot.addEventListener("click", () => goTo(index));
      servicesDotsWrap.appendChild(dot);
      return dot;
    });

    const render = () => {
      servicesTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => dot.classList.toggle("is-active", idx === currentIndex));
    };

    const goTo = (index) => {
      currentIndex = (index + servicesSlides.length) % servicesSlides.length;
      render();
    };

    const nextSlide = () => goTo(currentIndex + 1);
    const prevSlide = () => goTo(currentIndex - 1);

    if (servicesNext) servicesNext.addEventListener("click", nextSlide);
    if (servicesPrev) servicesPrev.addEventListener("click", prevSlide);

    const startAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(nextSlide, 4200);
    };

    servicesTrack.addEventListener("mouseenter", () => clearInterval(timer));
    servicesTrack.addEventListener("mouseleave", startAutoplay);
    servicesTrack.addEventListener("touchstart", () => clearInterval(timer), { passive: true });
    servicesTrack.addEventListener("touchend", startAutoplay, { passive: true });

    render();
    startAutoplay();
  }

  // Validate enquiry form, show loading/success feedback, and then open WhatsApp.
  if (form && submitBtn && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const request = document.getElementById("request")?.value.trim();

      if (!name || !phone || !request) {
        formMessage.textContent = "Please complete all fields before submitting.";
        formMessage.classList.remove("hidden", "text-green-800", "bg-green-50", "border-green-700/25");
        formMessage.classList.add("text-red-700", "bg-red-50", "border-red-700/20");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Preparing WhatsApp...";

      const payload = [
        "New UrbanKey trading enquiry",
        `Name: ${name}`,
        `Phone/WhatsApp: ${phone}`,
        `Request: ${request}`
      ].join("\n");

      setTimeout(() => {
        formMessage.textContent = "Thank you. Redirecting you to WhatsApp now.";
        formMessage.classList.remove("hidden", "text-red-700", "bg-red-50", "border-red-700/20");
        formMessage.classList.add("text-green-800", "bg-green-50", "border-green-700/25");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Enquiry";
        openWa(payload);
      }, 700);
    });
  }
})();
