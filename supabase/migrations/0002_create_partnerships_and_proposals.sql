create extension if not exists pgcrypto;

-- Partnerships
create table if not exists public.partnerships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sector text,
  region text,
  lat double precision,
  lng double precision,
  status text,
  partners jsonb,
  impact_metrics jsonb,
  created_at timestamptz default now()
);

-- Proposals
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  sector text,
  region text,
  requested_amount numeric,
  milestones jsonb,
  attachments jsonb,
  submitter_id uuid,
  status text default 'submitted',
  reviewer_notes jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Investors
create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile text,
  sectors jsonb,
  values jsonb,
  min_ticket numeric,
  max_ticket numeric,
  region_preferences jsonb,
  contact_info jsonb,
  created_at timestamptz default now()
);

-- Matches
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references public.investors(id) on delete set null,
  proposal_id uuid references public.proposals(id) on delete set null,
  score double precision,
  reasonings jsonb,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS (policies to be configured in dashboard)
alter table public.partnerships enable row level security;
alter table public.proposals enable row level security;
alter table public.investors enable row level security;
alter table public.matches enable row level security;
