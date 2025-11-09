-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Inquiries table for enterprise sales/contact leads
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  plan text not null,
  name text not null,
  email text not null,
  organization text,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.inquiries enable row level security;

-- Allow anonymous inserts via supabase 'anon' role if needed (adjust policies in Supabase dashboard)
-- By default, the project admin should configure RLS policies. This migration creates the table only.
