function getHarborMeshConfig() {
  return window.HARBORMESH_CONFIG || {};
}

function getAuthConfig() {
  const config = getHarborMeshConfig();
  return config.auth || {};
}

function getCurrentLang() {
  return (document.documentElement.lang || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
}

function authText(en, ko) {
  return getCurrentLang() === "ko" ? ko : en;
}

function getLocalizedAuthPath() {
  return getCurrentLang() === "ko" ? "/ko/auth.html" : "/auth.html";
}

function getLocalizedAccountPath() {
  return getCurrentLang() === "ko" ? "/ko/account.html" : "/account.html";
}

function getLocalizedHomePath() {
  return getCurrentLang() === "ko" ? "/ko" : "/";
}

function withQuery(path, params) {
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function getPaymentLinkForPlan(plan) {
  const links = {
    starter: "https://buy.stripe.com/eVqfZidk86h95pdg397bW01",
    builder: "https://buy.stripe.com/eVq5kE93S8ph3h5cQX7bW05"
  };
  return links[plan] || "";
}

function getSupabaseClient() {
  const authConfig = getAuthConfig();
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

function setAuthMessage(message, type = "info") {
  document.querySelectorAll("[data-auth-message]").forEach((el) => {
    el.textContent = message || "";
    el.dataset.type = type;
  });
}

function getAuthRedirect(plan) {
  const params = new URLSearchParams();
  if (plan) params.set("plan", plan);
  return withQuery(getLocalizedAuthPath(), params);
}

function getAccountRedirect(extra = {}) {
  const params = new URLSearchParams();
  Object.entries(extra).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return withQuery(getLocalizedAccountPath(), params);
}

async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data?.user || null;
}

function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

async function updateAuthHeader() {
  const client = getSupabaseClient();
  const targetNodes = document.querySelectorAll("[data-auth-state]");
  if (!client || targetNodes.length === 0) return;

  const user = await getCurrentUser();

  targetNodes.forEach((node) => {
    if (user && isEmailVerified(user)) {
      node.innerHTML = `<a class="button secondary auth-mini" href="${getLocalizedAccountPath()}">${authText("Account", "내 계정")}</a>`;
    } else if (user) {
      node.innerHTML = `<a class="button secondary auth-mini" href="${getLocalizedAccountPath()}">${authText("Verify email", "이메일 인증")}</a>`;
    } else {
      node.innerHTML = `<a class="button secondary auth-mini" href="${getLocalizedAuthPath()}">${authText("Sign in", "로그인")}</a>`;
    }
  });
}

async function ensureCustomerProfile(user, profileInput = {}) {
  const client = getSupabaseClient();
  if (!client || !user) return;

  const metadata = user.user_metadata || {};
  const fullName = profileInput.full_name || metadata.full_name || "";
  const phone = profileInput.phone || metadata.phone || "";
  const address = profileInput.address || metadata.address || "";

  if (!fullName && !phone && !address) return;

  await client
    .from("harbormesh_customer_profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      phone,
      address,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
}

async function handleSignup(event) {
  event.preventDefault();

  const client = getSupabaseClient();
  if (!client) {
    setAuthMessage(authText("Auth is not configured.", "인증 설정이 아직 없습니다."), "error");
    return;
  }

  const form = event.currentTarget;
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const fullName = String(data.get("full_name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const address = String(data.get("address") || "").trim();

  if (!email || !password || !fullName || !phone || !address) {
    setAuthMessage(authText("Fill in every required field.", "필수 항목을 모두 입력하세요."), "error");
    return;
  }

  const { data: result, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}${getLocalizedAccountPath()}`,
      data: {
        full_name: fullName,
        phone,
        address,
        signup_source: "harbormesh_cloud"
      }
    }
  });

  if (error) {
    setAuthMessage(error.message, "error");
    return;
  }

  if (result?.user && result?.session) {
    await ensureCustomerProfile(result.user, { full_name: fullName, phone, address });
  }

  setAuthMessage(
    authText(
      "Signup received. Check your inbox and click the verification email before paying.",
      "회원가입이 접수됐습니다. 결제 전 이메일함에서 인증 링크를 클릭하세요."
    ),
    "success"
  );
  form.reset();
}

async function handleLogin(event) {
  event.preventDefault();

  const client = getSupabaseClient();
  if (!client) {
    setAuthMessage(authText("Auth is not configured.", "인증 설정이 아직 없습니다."), "error");
    return;
  }

  const form = event.currentTarget;
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");

  const { data: result, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    setAuthMessage(error.message, "error");
    return;
  }

  const user = result?.user;
  if (!isEmailVerified(user)) {
    window.location.href = getAccountRedirect({ verify: "required" });
    return;
  }

  await ensureCustomerProfile(user);
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  if (plan) {
    await startProtectedCheckout(plan);
    return;
  }

  window.location.href = getLocalizedAccountPath();
}

async function handleLogout() {
  const client = getSupabaseClient();
  if (!client) return;
  await client.auth.signOut();
  window.location.href = getLocalizedHomePath();
}

async function startProtectedCheckout(plan) {
  const paymentLink = getPaymentLinkForPlan(plan || "starter");
  if (!paymentLink) {
    setAuthMessage(authText("Checkout is not available.", "결제를 열 수 없습니다."), "error");
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    window.location.href = getAuthRedirect(plan);
    return;
  }

  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;
  const user = await getCurrentUser();

  if (!token || !user) {
    window.location.href = getAuthRedirect(plan);
    return;
  }

  if (!isEmailVerified(user)) {
    window.location.href = getAccountRedirect({ verify: "required" });
    return;
  }

  window.location.href = paymentLink;
}

function wireProtectedCheckoutButtons() {
  document.querySelectorAll("[data-protected-checkout]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const plan = button.dataset.plan || "starter";
      await startProtectedCheckout(plan);
    });
  });
}

async function renderAccountPage() {
  const accountRoot = document.querySelector("[data-account-page]");
  if (!accountRoot) return;

  const user = await getCurrentUser();
  if (!user) {
    accountRoot.innerHTML = `
      <div class="auth-panel">
        <h1>${authText("Sign in required", "로그인이 필요합니다")}</h1>
        <p class="muted">${authText("Create an account or sign in before opening payment links.", "결제링크를 열기 전에 회원가입 또는 로그인을 진행하세요.")}</p>
        <a class="button primary" href="${getLocalizedAuthPath()}">${authText("Go to sign in", "로그인으로 이동")}</a>
      </div>
    `;
    return;
  }

  await ensureCustomerProfile(user);

  const metadata = user.user_metadata || {};
  const verified = isEmailVerified(user);

  accountRoot.innerHTML = `
    <div class="auth-panel">
      <div class="eyebrow">${authText("Account", "내 계정")}</div>
      <h1>${verified ? authText("Email verified", "이메일 인증 완료") : authText("Email verification required", "이메일 인증 필요")}</h1>
      <p class="muted">${authText("Signed in as", "로그인 계정")}: ${user.email || ""}</p>
      <div class="account-grid">
        <p><strong>${authText("Name", "이름")}</strong><span>${metadata.full_name || "-"}</span></p>
        <p><strong>${authText("Phone", "휴대폰번호")}</strong><span>${metadata.phone || "-"}</span></p>
        <p><strong>${authText("Address", "주소")}</strong><span>${metadata.address || "-"}</span></p>
      </div>
      <div class="auth-actions">
        ${verified ? `<button class="button primary" data-protected-checkout data-plan="starter">${authText("Open Starter payment", "Starter 결제 열기")}</button>` : `<p class="auth-warning">${authText("Check your inbox and click the verification link before paying.", "결제 전 이메일함에서 인증 링크를 클릭하세요.")}</p>`}
        <button class="button secondary" data-logout>${authText("Sign out", "로그아웃")}</button>
      </div>
      <p data-auth-message class="auth-message"></p>
    </div>
  `;

  wireProtectedCheckoutButtons();

  const logout = accountRoot.querySelector("[data-logout]");
  if (logout) logout.addEventListener("click", handleLogout);
}

function initAuthForms() {
  const signupForm = document.querySelector("[data-signup-form]");
  if (signupForm) signupForm.addEventListener("submit", handleSignup);

  const loginForm = document.querySelector("[data-login-form]");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", handleLogout);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initAuthForms();
  wireProtectedCheckoutButtons();
  await updateAuthHeader();
  await renderAccountPage();

  const client = getSupabaseClient();
  if (client) {
    client.auth.onAuthStateChange(async () => {
      await updateAuthHeader();
    });
  }
});
