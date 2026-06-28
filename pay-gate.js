var POLICY_VERSION = "refund_chargeback_policy_v1_20260628";

var PLAN_CONFIGS = {
  starter: {
    label: "Starter Credits",
    amountLabel: "HK$5,000",
    stripeUrl: "https://buy.stripe.com/eVqfZidk86h95pdg397bW01"
  },
  builder: {
    label: "Builder API",
    amountLabel: "HK$25,000",
    stripeUrl: "https://buy.stripe.com/eVq5kE93S8ph3h5cQX7bW05"
  }
};

var CHECKBOX_TEXT = {
  ko: "본인은 결제 완료 즉시 디지털 클라우드 서비스 접근권이 활성화되며, 결제 후 카드 취소·환불·부분 환불·차지백·결제분쟁이 불가능하다는 점을 이해하고 동의합니다.",
  en: "I understand and agree that digital cloud service access is activated immediately after payment, and that after payment is completed, card cancellation, refund, partial refund, chargeback, and payment dispute are not available."
};

var TERMS_TEXT = {
  ko: "## 결제 후 취소·환불 불가 및 차지백 분쟁 동의 조항\n\n본인은 HarborMesh Cloud가 디지털 클라우드 컴퓨트 접근권, GPU 컴퓨트 크레딧, API 사용권 또는 예약형 컴퓨트 용량을 제공하는 서비스임을 이해하고 동의합니다.\n\n본인은 결제가 완료되는 즉시 HarborMesh Cloud 계정, 시스템 또는 운영 환경에서 해당 디지털 서비스 접근권이 활성화되거나, 사용 가능 상태로 배정되거나, 컴퓨트 용량 예약·운영 준비가 개시될 수 있음을 이해합니다.\n\n본인은 위와 같은 서비스 특성상 결제 완료 후 단순 변심, 사용하지 않음, 사용 지연, 내부 사정, 예산 변경, 프로젝트 취소, 기대한 성능과의 주관적 차이, 고객 측 환경 문제, 고객 측 설정 오류, 사용 방법 미숙지 또는 고객의 사업상 판단 변경을 이유로 카드 결제 취소, 환불, 부분 환불, 지급거절, 차지백 또는 결제분쟁을 제기할 수 없다는 점에 명시적으로 동의합니다.\n\n본인은 HarborMesh Cloud가 결제 완료 후 디지털 서비스 접근권을 활성화하거나, 컴퓨트 크레딧을 배정하거나, GPU 용량 제공을 준비한 경우 해당 서비스는 즉시 제공이 개시된 것으로 간주되며, 해당 결제는 취소 불가능하고 환불 불가능한 최종 거래임을 인정합니다.\n\n본인은 결제 전 서비스 내용, 가격, 통화, 사용 조건, 환불 불가 조건 및 디지털 서비스 즉시 활성화 조건을 확인했으며, 이에 동의한 후 결제를 진행합니다.\n\n본인은 결제 후 카드사, 은행 또는 결제 네트워크에 차지백, 지급거절, 결제분쟁 또는 무단 환불 청구를 제기하기 전에 HarborMesh Cloud 고객지원팀에 먼저 연락하여 문제 해결을 시도해야 함을 동의합니다.\n\n본인은 본 약관에 동의하고 결제를 완료한 후, 이미 디지털 서비스 접근권이 활성화되었거나 사용 가능 상태로 제공된 거래에 대하여 “서비스 미수령”, “상품 불일치”, “환불 미처리”, “승인하지 않은 거래” 또는 이와 유사한 사유로 사실과 다른 차지백을 제기하지 않을 것에 동의합니다.\n\n만약 본인이 위 동의 내용과 달리 차지백 또는 결제분쟁을 제기하는 경우, HarborMesh Cloud는 본인의 계정 생성 기록, 로그인 기록, 이메일 인증 기록, 약관 동의 기록, 결제 기록, IP 주소, 기기 정보, 서비스 활성화 기록, 컴퓨트 크레딧 배정 기록, 사용 로그, 고객지원 기록 및 본 동의 조항을 카드사, 결제대행사, 카드 네트워크 또는 관련 기관에 증빙자료로 제출할 수 있습니다.\n\n본인은 허위 또는 부당한 차지백으로 인해 HarborMesh Cloud에 손해, 수수료, 조사 비용, 계정 제한, 결제 처리상 불이익 또는 기타 비용이 발생하는 경우, 관련 법령이 허용하는 범위 내에서 HarborMesh Cloud가 해당 손해 및 비용의 회복을 청구할 수 있음을 이해합니다.\n\n본 조항은 관련 법령상 배제할 수 없는 소비자 권리 또는 명백한 무단 결제에 대한 권리를 제한하지 않습니다. 다만, 정상적으로 본인이 계정을 생성하고, 이메일 인증을 완료하고, 본 약관에 동의하고, 결제를 승인한 후 디지털 서비스가 활성화된 경우, 해당 결제는 환불 불가 및 취소 불가 거래로 처리됩니다.",
  en: "## No Cancellation, No Refund, and Chargeback Dispute Acknowledgement\n\nI understand and agree that HarborMesh Cloud provides digital cloud compute access, GPU compute credits, API access, reserved compute capacity, and other digital cloud infrastructure services.\n\nI understand that immediately after payment is completed, HarborMesh Cloud may activate digital service access, allocate compute credits, reserve compute capacity, prepare GPU resources, or otherwise make the purchased service available to my account.\n\nDue to the immediate digital nature of the service, I expressly agree that, after payment is completed, I am not entitled to cancel the card payment, request a refund, request a partial refund, reverse the payment, file a payment reversal, initiate a chargeback, or raise a payment dispute based on change of mind, non-use, delayed use, internal business reasons, budget changes, project cancellation, subjective performance expectations, customer-side technical or operational issues, customer-side configuration issues, lack of familiarity with usage, or changes in the customer’s business decision.\n\nI acknowledge that once HarborMesh Cloud activates digital service access, allocates compute credits, reserves GPU capacity, or begins preparing the purchased compute service, the service is deemed to have started and the transaction becomes final, non-cancellable, and non-refundable.\n\nBefore completing payment, I confirm that I have reviewed the service description, price, currency, usage conditions, no-refund policy, and immediate digital activation terms.\n\nI agree to contact HarborMesh Cloud customer support first and attempt to resolve any issue before filing a chargeback, payment reversal, bank dispute, or card network dispute.\n\nAfter agreeing to these terms and completing payment, I agree not to file a false or improper chargeback claiming “service not received,” “product not as described,” “refund not processed,” “unauthorized transaction,” or any similar claim where I created the account, verified my email, accepted these terms, authorized payment, and HarborMesh Cloud activated or made available the purchased digital service.\n\nIf I file a chargeback or payment dispute contrary to this acknowledgement, HarborMesh Cloud may submit my account creation records, login records, email verification records, terms acceptance record, payment record, IP address, device information, service activation record, compute credit allocation record, usage logs, customer support records, and this acknowledgement as evidence to the payment processor, card issuer, card network, acquiring bank, or other relevant party.\n\nI understand that if a false or improper chargeback causes HarborMesh Cloud to incur losses, dispute fees, investigation costs, account restrictions, payment processing penalties, or other costs, HarborMesh Cloud may seek recovery of such losses and costs to the fullest extent permitted by applicable law.\n\nNothing in this clause limits any non-waivable consumer rights or rights relating to a genuinely unauthorized transaction. However, where I created an account, verified my email, accepted these terms, authorized payment, and the digital service was activated or made available, the payment will be treated as a final, non-refundable, and non-cancellable transaction."
};

function getHarborMeshConfig() {
  return window.HARBORMESH_CONFIG || {};
}

function getCurrentLang() {
  return (document.documentElement.lang || document.body.dataset.lang || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
}

function gateText(en, ko) {
  return getCurrentLang() === "ko" ? ko : en;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTermsHtml(text) {
  return String(text || "")
    .split("\n\n")
    .map(function (block) {
      if (block.indexOf("## ") === 0) {
        return "<h2>" + escapeHtml(block.replace("## ", "")) + "</h2>";
      }
      return "<p>" + escapeHtml(block).replace(/\n/g, "<br>") + "</p>";
    })
    .join("");
}

function getSupabaseClient() {
  var config = getHarborMeshConfig();
  var authConfig = config.auth || {};
  if (!window.supabase || !authConfig.supabaseUrl || !authConfig.supabaseAnonKey) {
    return null;
  }

  if (!window.HARBORMESH_SUPABASE_CLIENT) {
    window.HARBORMESH_SUPABASE_CLIENT = window.supabase.createClient(
      authConfig.supabaseUrl,
      authConfig.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  return window.HARBORMESH_SUPABASE_CLIENT;
}

function isEmailVerified(user) {
  return Boolean(user && (user.email_confirmed_at || user.confirmed_at));
}

function getPlanConfig(plan) {
  return PLAN_CONFIGS[plan] || null;
}

function withQuery(path, params) {
  var query = params.toString();
  return query ? path + "?" + query : path;
}

function getAuthRedirect(plan) {
  var params = new URLSearchParams();
  params.set("next", window.location.pathname);
  if (plan) params.set("plan", plan);
  return withQuery(getCurrentLang() === "ko" ? "/ko/auth.html" : "/auth.html", params);
}

function getAccountVerifyRedirect(plan) {
  var params = new URLSearchParams();
  params.set("verify", "required");
  params.set("next", window.location.pathname);
  if (plan) params.set("plan", plan);
  return withQuery(getCurrentLang() === "ko" ? "/ko/account.html" : "/account.html", params);
}

function setGateMessage(message, type) {
  document.querySelectorAll("[data-pay-gate-message]").forEach(function (el) {
    el.textContent = message || "";
    el.dataset.type = type || "info";
  });
}

function initSignaturePad(canvas, onChange) {
  var ctx = canvas.getContext("2d");
  var drawing = false;
  var lastX = 0;
  var lastY = 0;
  var totalDistance = 0;
  var signed = false;

  function resize() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(rect.width, 320);
    var height = 180;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    clear(false);
  }

  function clear(emit) {
    var rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, 180);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0b1220";
    totalDistance = 0;
    signed = false;
    if (emit !== false && onChange) onChange(false);
  }

  function point(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  canvas.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    var p = point(event);
    drawing = true;
    lastX = p.x;
    lastY = p.y;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", function (event) {
    if (!drawing) return;
    event.preventDefault();
    var p = point(event);
    var dx = p.x - lastX;
    var dy = p.y - lastY;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
    if (!signed && totalDistance > 12) {
      signed = true;
      if (onChange) onChange(true);
    }
  });

  function stop(event) {
    if (!drawing) return;
    drawing = false;
    if (event && canvas.releasePointerCapture) {
      try { canvas.releasePointerCapture(event.pointerId); } catch {}
    }
  }

  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("pointerleave", stop);

  resize();

  return {
    clear: function () { clear(true); },
    hasSignature: function () { return signed; },
    dataUrl: function () { return canvas.toDataURL("image/png"); }
  };
}

function renderAgreementForm(client, token, user, plan, planConfig) {
  var lang = getCurrentLang();
  var root = document.querySelector("[data-pay-gate-root]") || document.querySelector(".auth-panel");
  var terms = TERMS_TEXT[lang] || TERMS_TEXT.en;
  var checkboxText = CHECKBOX_TEXT[lang] || CHECKBOX_TEXT.en;
  var signerName = user && user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : "";
  var signerEmail = user && user.email ? user.email : "";

  root.innerHTML = [
    '<div class="eyebrow">' + escapeHtml(gateText("Required agreement", "필수 결제 동의")) + '</div>',
    '<h1>' + escapeHtml(gateText("Review, agree, and sign before payment.", "결제 전 약관 동의 및 서명이 필요합니다.")) + '</h1>',
    '<p class="muted">' + escapeHtml(planConfig.label + " / " + planConfig.amountLabel) + '</p>',
    '<div class="agreement-scroll">' + renderTermsHtml(terms) + '</div>',
    '<form data-agreement-form class="agreement-form">',
    '<label class="agreement-check">',
    '<input type="checkbox" data-agreement-checkbox>',
    '<span>' + escapeHtml(checkboxText) + '</span>',
    '</label>',
    '<div class="signature-block">',
    '<div class="signature-head">',
    '<strong>' + escapeHtml(gateText("Signature", "서명")) + '</strong>',
    '<span>' + escapeHtml(signerName ? signerName + " / " + signerEmail : signerEmail) + '</span>',
    '</div>',
    '<canvas class="signature-pad" data-signature-pad aria-label="Signature pad"></canvas>',
    '<button type="button" class="button secondary signature-clear" data-signature-clear>' + escapeHtml(gateText("Clear signature", "서명 지우기")) + '</button>',
    '</div>',
    '<button type="submit" class="button primary full" data-submit-agreement disabled>' + escapeHtml(gateText("Agree, sign, and continue to payment", "동의 및 서명 후 결제 진행")) + '</button>',
    '<p data-pay-gate-message class="auth-message"></p>',
    '</form>'
  ].join("");

  var form = root.querySelector("[data-agreement-form]");
  var checkbox = root.querySelector("[data-agreement-checkbox]");
  var canvas = root.querySelector("[data-signature-pad]");
  var clearButton = root.querySelector("[data-signature-clear]");
  var submitButton = root.querySelector("[data-submit-agreement]");
  var pad = initSignaturePad(canvas, updateState);

  function updateState() {
    submitButton.disabled = !(checkbox.checked && pad.hasSignature());
  }

  checkbox.addEventListener("change", updateState);
  clearButton.addEventListener("click", function () {
    pad.clear();
    updateState();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!checkbox.checked) {
      setGateMessage(gateText("Check the agreement box first.", "약관 동의 체크박스를 먼저 선택하세요."), "error");
      return;
    }

    if (!pad.hasSignature()) {
      setGateMessage(gateText("Add your signature first.", "서명을 먼저 입력하세요."), "error");
      return;
    }

    submitButton.disabled = true;
    setGateMessage(gateText("Saving agreement evidence...", "약관 동의 및 서명 증빙을 저장하는 중입니다."), "info");

    var payload = {
      plan: plan,
      plan_label: planConfig.label,
      amount_label: planConfig.amountLabel,
      stripe_url: planConfig.stripeUrl,
      policy_version: POLICY_VERSION,
      policy_language: lang,
      checkbox_text: checkboxText,
      terms_text: terms,
      signature_data_url: pad.dataUrl(),
      page_url: window.location.href,
      referrer: document.referrer || "",
      browser_user_agent: navigator.userAgent || ""
    };

    var response = await fetch("/api/payment-agreement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    var result = await response.json().catch(function () { return {}; });

    if (!response.ok || !result.ok) {
      submitButton.disabled = false;
      setGateMessage(result.detail || result.error || gateText("Agreement could not be saved.", "약관 동의 증빙을 저장할 수 없습니다."), "error");
      return;
    }

    try {
      localStorage.setItem("harbormesh_last_payment_agreement", JSON.stringify({
        agreement_id: result.agreement_id,
        accepted_at: result.accepted_at,
        plan: plan,
        policy_version: POLICY_VERSION
      }));
    } catch {}

    setGateMessage(gateText("Opening Stripe checkout...", "Stripe 결제 페이지를 여는 중입니다."), "success");
    window.location.replace(planConfig.stripeUrl);
  });

  updateState();
}

async function runPayGate() {
  var plan = document.body.dataset.plan || "starter";
  var planConfig = getPlanConfig(plan);

  if (!planConfig) {
    setGateMessage(gateText("Unknown payment plan.", "알 수 없는 결제 플랜입니다."), "error");
    return;
  }

  var client = getSupabaseClient();
  if (!client) {
    setGateMessage(gateText("Auth is not configured.", "인증 설정이 아직 없습니다."), "error");
    return;
  }

  setGateMessage(gateText("Checking login and email verification...", "로그인 및 이메일 인증 상태를 확인하는 중입니다."), "info");

  var sessionResult = await client.auth.getSession();
  var token = sessionResult && sessionResult.data && sessionResult.data.session ? sessionResult.data.session.access_token : "";

  var userResult = await client.auth.getUser();
  var user = userResult && userResult.data ? userResult.data.user : null;

  if (!token || !user) {
    window.location.href = getAuthRedirect(plan);
    return;
  }

  if (!isEmailVerified(user)) {
    window.location.href = getAccountVerifyRedirect(plan);
    return;
  }

  renderAgreementForm(client, token, user, plan, planConfig);
}

document.addEventListener("DOMContentLoaded", function () {
  runPayGate().catch(function (error) {
    console.error(error);
    setGateMessage(gateText("Checkout failed. Please try again.", "결제 페이지를 열 수 없습니다. 다시 시도하세요."), "error");
  });
});
