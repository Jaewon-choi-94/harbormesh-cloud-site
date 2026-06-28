function getHarborMeshConfig() {
  return window.HARBORMESH_CONFIG || {};
}

function getCurrentLang() {
  return (document.documentElement.lang || document.body.dataset.lang || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
}

function gateText(en, ko) {
  return getCurrentLang() === "ko" ? ko : en;
}

function setGateMessage(message, type = "info") {
  document.querySelectorAll("[data-pay-gate-message]").forEach((el) => {
    el.textContent = message || "";
    el.dataset.type = type;
  });
}

function getSupabaseClient() {
  const config = getHarborMeshConfig();
  const authConfig = config.auth || {};
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
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

function getPlanConfig(plan) {
  const plans = {
    starter: {
      label: "Starter Credits",
      stripeUrl: "https://buy.stripe.com/eVqfZidk86h95pdg397bW01"
    },
    builder: {
      label: "Builder API",
      stripeUrl: "https://buy.stripe.com/eVq5kE93S8ph3h5cQX7bW05"
    }
  };

  return plans[plan] || null;
}

function withQuery(path, params) {
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function getAuthRedirect(plan) {
  const params = new URLSearchParams();
  params.set("next", window.location.pathname);
  if (plan) params.set("plan", plan);
  return withQuery(getCurrentLang() === "ko" ? "/ko/auth.html" : "/auth.html", params);
}

function getAccountVerifyRedirect(plan) {
  const params = new URLSearchParams();
  params.set("verify", "required");
  params.set("next", window.location.pathname);
  if (plan) params.set("plan", plan);
  return withQuery(getCurrentLang() === "ko" ? "/ko/account.html" : "/account.html", params);
}

function getAgreementRedirect(plan) {
  const params = new URLSearchParams();
  params.set("next", window.location.pathname);
  if (plan) params.set("plan", plan);
  return withQuery(getCurrentLang() === "ko" ? "/ko/agreement.html" : "/agreement.html", params);
}

async function hasSignedRequiredAgreements(user, plan) {
  // Future hook:
  // Later, replace this with a Supabase lookup against a signed terms/agreement table.
  // Return false when terms/signature must be completed before payment.
  return true;
}

async function runPayGate() {
  const plan = document.body.dataset.plan || "starter";
  const planConfig = getPlanConfig(plan);

  if (!planConfig) {
    setGateMessage(gateText("Unknown payment plan.", "알 수 없는 결제 플랜입니다."), "error");
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    setGateMessage(gateText("Auth is not configured.", "인증 설정이 아직 없습니다."), "error");
    return;
  }

  setGateMessage(gateText("Checking login and email verification...", "로그인 및 이메일 인증 상태를 확인하는 중입니다."), "info");

  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;

  const { data: userData } = await client.auth.getUser();
  const user = userData?.user || null;

  if (!token || !user) {
    window.location.href = getAuthRedirect(plan);
    return;
  }

  if (!isEmailVerified(user)) {
    window.location.href = getAccountVerifyRedirect(plan);
    return;
  }

  const signed = await hasSignedRequiredAgreements(user, plan);
  if (!signed) {
    window.location.href = getAgreementRedirect(plan);
    return;
  }

  setGateMessage(gateText("Opening Stripe checkout...", "Stripe 결제 페이지를 여는 중입니다."), "success");
  window.location.replace(planConfig.stripeUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  runPayGate().catch((error) => {
    console.error(error);
    setGateMessage(gateText("Checkout failed. Please try again.", "결제 페이지를 열 수 없습니다. 다시 시도하세요."), "error");
  });
});
