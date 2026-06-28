create table if not exists public.harbormesh_payment_agreements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  plan text not null check (plan in ('starter', 'builder')),
  plan_label text not null,
  amount_label text not null,
  currency text not null default 'HKD',
  stripe_url text not null,
  policy_version text not null,
  policy_language text not null check (policy_language in ('ko', 'en')),
  checkbox_text text not null,
  terms_text text not null,
  signature_data_url text not null,
  page_url text,
  referrer text,
  browser_user_agent text,
  request_ip text,
  server_user_agent text,
  accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.harbormesh_payment_agreements enable row level security;

drop policy if exists "Users can insert own payment agreements" on public.harbormesh_payment_agreements;
drop policy if exists "Users can view own payment agreements" on public.harbormesh_payment_agreements;

create policy "Users can insert own payment agreements"
on public.harbormesh_payment_agreements
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view own payment agreements"
on public.harbormesh_payment_agreements
for select
to authenticated
using (auth.uid() = user_id);

create index if not exists harbormesh_payment_agreements_user_id_idx
on public.harbormesh_payment_agreements(user_id);

create index if not exists harbormesh_payment_agreements_plan_policy_idx
on public.harbormesh_payment_agreements(plan, policy_version);

create index if not exists harbormesh_payment_agreements_created_at_idx
on public.harbormesh_payment_agreements(created_at desc);
