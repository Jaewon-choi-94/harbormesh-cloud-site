const { createClient } = require("@supabase/supabase-js");

function getHeader(req, name) {
  const value = req.headers[name.toLowerCase()] || req.headers[name];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    sendJson(res, 500, { error: "supabase_env_missing" });
    return;
  }

  const authHeader = String(getHeader(req, "authorization"));
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    sendJson(res, 401, { error: "missing_auth_token" });
    return;
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(res, 400, { error: "invalid_json" });
      return;
    }
  }

  const required = [
    "plan",
    "plan_label",
    "amount_label",
    "stripe_url",
    "policy_version",
    "policy_language",
    "checkbox_text",
    "terms_text",
    "signature_data_url",
    "page_url"
  ];

  for (const key of required) {
    if (!body[key] || typeof body[key] !== "string") {
      sendJson(res, 400, { error: "missing_" + key });
      return;
    }
  }

  if (!["starter", "builder"].includes(body.plan)) {
    sendJson(res, 400, { error: "invalid_plan" });
    return;
  }

  if (!["ko", "en"].includes(body.policy_language)) {
    sendJson(res, 400, { error: "invalid_policy_language" });
    return;
  }

  if (!body.signature_data_url.startsWith("data:image/png;base64,")) {
    sendJson(res, 400, { error: "invalid_signature" });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: "Bearer " + token
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const user = userData && userData.user ? userData.user : null;

  if (userError || !user) {
    sendJson(res, 401, { error: "invalid_user" });
    return;
  }

  const requestIp =
    String(getHeader(req, "x-forwarded-for")).split(",")[0].trim() ||
    String(getHeader(req, "x-real-ip")).trim() ||
    "";

  const serverUserAgent = String(getHeader(req, "user-agent"));

  const record = {
    user_id: user.id,
    email: user.email || "",
    plan: body.plan,
    plan_label: body.plan_label,
    amount_label: body.amount_label,
    currency: "HKD",
    stripe_url: body.stripe_url,
    policy_version: body.policy_version,
    policy_language: body.policy_language,
    checkbox_text: body.checkbox_text,
    terms_text: body.terms_text,
    signature_data_url: body.signature_data_url,
    page_url: body.page_url,
    referrer: body.referrer || "",
    browser_user_agent: body.browser_user_agent || "",
    request_ip: requestIp,
    server_user_agent: serverUserAgent
  };

  const { data, error } = await supabase
    .from("harbormesh_payment_agreements")
    .insert(record)
    .select("id, accepted_at")
    .single();

  if (error) {
    sendJson(res, 500, { error: "agreement_insert_failed", detail: error.message });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    agreement_id: data.id,
    accepted_at: data.accepted_at
  });
};
