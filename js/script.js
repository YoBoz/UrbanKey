// UrbanKey Concierge interactions: mobile nav, CTA consistency, and form-to-WhatsApp flow.
(function () {
  const WHATSAPP_NUMBER = "971XXXXXXXXX"; // Replace with real number in international format.

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const form = document.getElementById("enquiryForm");
  const formMessage = document.getElementById("formMessage");
  const floatingWhatsApp = document.getElementById("floatingWhatsApp");

  const getWhatsAppUrl = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const openWhatsApp = (message) => {
    window.open(getWhatsAppUrl(message), "_blank", "noopener");
  };

  // Keep all CTA links aligned with one configurable WhatsApp number.
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    const text = "Hello UrbanKey Concierge, I would like assistance with a request.";
    link.href = getWhatsAppUrl(text);
  });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const request = document.getElementById("request")?.value.trim();

      if (!name || !phone || !request) {
        formMessage.textContent = "Please complete all fields before submitting.";
        formMessage.classList.remove("hidden", "text-green-800", "bg-green-50");
        formMessage.classList.add("text-red-700", "bg-red-50");
        return;
      }

      const leadMessage = [
        "New UrbanKey Concierge enquiry:",
        `Name: ${name}`,
        `Phone/WhatsApp: ${phone}`,
        `Request: ${request}`
      ].join("\n");

      formMessage.textContent = "Thank you. Your enquiry is ready to send on WhatsApp.";
      formMessage.classList.remove("hidden", "text-red-700", "bg-red-50");
      formMessage.classList.add("text-green-800", "bg-green-50");

      setTimeout(() => openWhatsApp(leadMessage), 400);
      form.reset();
    });
  }

  if (floatingWhatsApp) {
    floatingWhatsApp.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp("Hello UrbanKey Concierge, I have an enquiry.");
    });
  }
})();
