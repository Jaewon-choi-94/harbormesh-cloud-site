function getConfig() {
  return window.HARBORMESH_CONFIG || {};
}

function getCurrentLanguage() {
  return (document.documentElement.lang || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
}

function checkout(plan) {
  const config = getConfig();
  const link = config.checkoutLinks && config.checkoutLinks[plan];
  if (link && link.startsWith("http")) {
    window.location.href = link;
    return;
  }
  openQuote(plan);
}

function openQuote(plan) {
  const modal = document.getElementById("quoteModal");
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modal.dataset.plan = plan || "enterprise";
}

function closeQuote() {
  const modal = document.getElementById("quoteModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function initQuoteForm() {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const config = getConfig();
    const modal = document.getElementById("quoteModal");
    const plan = modal?.dataset?.plan || "enterprise";
    const data = new FormData(form);
    const company = data.get("company") || "";
    const workload = data.get("workload") || "";
    const budget = data.get("budget") || "";
    const tier = data.get("tier") || "";
    const date = data.get("date") || "";
    const to = config.salesEmail || "sales@harbormeshcloud.com";
    const language = getCurrentLanguage();

    const subject = encodeURIComponent(
      language === "ko"
        ? `GPU 용량 견적 요청 — ${plan}`
        : `GPU capacity quote request — ${plan}`
    );

    const body = encodeURIComponent(
      language === "ko"
        ? `회사명: ${company}
요청 플랜: ${plan}
워크로드 유형: ${workload}
목표 일일 예산(HKD): ${budget}
필요 GPU 등급: ${tier}
예상 시작일: ${date}

가용 용량, 가격, 온보딩 요건을 안내해 주세요.`
        : `Company name: ${company}
Requested plan: ${plan}
Workload type: ${workload}
Target daily budget in HKD: ${budget}
Required GPU tier: ${tier}
Expected start date: ${date}

Please contact me with availability, pricing and onboarding requirements.`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
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
    if (button.tagName === "A" && button.href) return;
    button.addEventListener("click", () => checkout(button.dataset.plan));
  });

  document.querySelectorAll(".quote").forEach((button) => {
    button.addEventListener("click", () => openQuote(button.dataset.plan));
  });

  document.querySelectorAll(".modal-close").forEach((button) => {
    button.addEventListener("click", closeQuote);
  });

  const modal = document.getElementById("quoteModal");
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeQuote();
    });
  }

  initQuoteForm();
});
