function getConfig() {
  return window.HARBORMESH_CONFIG || {};
}

function getCurrentLanguage() {
  return (document.documentElement.lang || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
}

function openQuote(plan) {
  const config = getConfig();
  const language = getCurrentLanguage();
  const to = config.salesEmail || "sales@harbormeshcloud.com";
  const subject = encodeURIComponent(
    language === "ko"
      ? `GPU 용량 문의 — ${plan || "enterprise"}`
      : `GPU capacity inquiry — ${plan || "enterprise"}`
  );
  const body = encodeURIComponent(
    language === "ko"
      ? "필요한 GPU 용량, 예산, 시작일을 입력해 주세요."
      : "Please describe your GPU capacity requirement, budget, and expected start date."
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function applyConfigText() {
  const config = getConfig();

  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = config.brandName || "HarborMesh Cloud";
  });

  document.querySelectorAll("[data-company]").forEach((el) => {
    el.textContent = config.companyName || "DOUBLE J PARTNERS LIMITED";
  });

  document.querySelectorAll("[data-brn]").forEach((el) => {
    el.textContent = config.businessRegistrationNumber || "77498577";
  });

  document.querySelectorAll("[data-office]").forEach((el) => {
    el.textContent = config.registeredOffice || "RM 409, Beverley Commercial Centre, 87-105 Chatham Road South, Tsim Sha Tsui, Hong Kong";
  });

  document.querySelectorAll("[data-support-email]").forEach((el) => {
    el.textContent = config.supportEmail || "support@harbormeshcloud.com";
    el.href = `mailto:${config.supportEmail || "support@harbormeshcloud.com"}`;
  });

  document.querySelectorAll("[data-legal-email]").forEach((el) => {
    el.textContent = config.legalEmail || "legal@harbormeshcloud.com";
    el.href = `mailto:${config.legalEmail || "legal@harbormeshcloud.com"}`;
  });

  document.querySelectorAll("[data-privacy-email]").forEach((el) => {
    el.textContent = config.privacyEmail || "privacy@harbormeshcloud.com";
    el.href = `mailto:${config.privacyEmail || "privacy@harbormeshcloud.com"}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfigText();

  document.querySelectorAll(".checkout").forEach((button) => {
    if (button.hasAttribute("data-protected-checkout")) return;
    if (button.tagName === "A" && button.href) return;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openQuote(button.dataset.plan);
    });
  });

  document.querySelectorAll(".quote").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openQuote(button.dataset.plan);
    });
  });
});
