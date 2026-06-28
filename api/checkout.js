import { createClient } from "@supabase/supabase-js";

const json = (response, status = 200) =>
  new Response(JSON.stringify(response), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

function getPaymentLink(plan) {
  const links = {
    starter: process.env.STRIPE_LINK_STARTER,
    builder: process.env.STRIPE_LINK_BUILDER,
    enterprise: process.env.STRIPE_LINK_ENTERPRISE,
    dedicated: process.env.STRIPE_LINK_DEDICATED
  };

  return links[plan] || "";
}

function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

export default async function handler(request) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "starter";
  const paymentLink = getPaymentLink(plan);

  if (!paymentLink || !paymentLink.startsWith("https://")) {
    return json({ error: "Payment link is not configured for this plan." }, 404);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Auth server is not configured." }, 500);
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return json({ error: "Login required." }, 401);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return json({ error: "Invalid or expired session." }, 401);
  }

  const user = data.user;

  if (!isEmailVerified(user)) {
    return json({ error: "Email verification required." }, 403);
  }

  return json({ url: paymentLink });
}
