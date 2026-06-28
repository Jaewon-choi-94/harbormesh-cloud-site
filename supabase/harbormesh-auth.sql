
-- HarborMesh Cloud customer profile table.

-- Run this in Supabase SQL Editor after creating the Supabase project.



create table if not exists public.harbormesh_customer_profiles (

  id uuid primary key references auth.users(id) on delete cascade,

  email text not null,

  full_name text not null default '',

  phone text not null default '',

  address text not null default '',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()

);



alter table public.harbormesh_customer_profiles enable row level security;



drop policy if exists "Customers can read own HarborMesh profile"

  on public.harbormesh_customer_profiles;



create policy "Customers can read own HarborMesh profile"

  on public.harbormesh_customer_profiles

  for select

  to authenticated

  using (auth.uid() = id);



drop policy if exists "Customers can insert own HarborMesh profile"

  on public.harbormesh_customer_profiles;



create policy "Customers can insert own HarborMesh profile"

  on public.harbormesh_customer_profiles

  for insert

  to authenticated

  with check (auth.uid() = id);



drop policy if exists "Customers can update own HarborMesh profile"

  on public.harbormesh_customer_profiles;



create policy "Customers can update own HarborMesh profile"

  on public.harbormesh_customer_profiles

  for update

  to authenticated

  using (auth.uid() = id)

  with check (auth.uid() = id);

