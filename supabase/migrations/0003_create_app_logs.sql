create extension if not exists pgcrypto;

create table if not exists public.app_logs (
  id uuid primary key default gen_random_uuid(),
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.app_logs enable row level security;
