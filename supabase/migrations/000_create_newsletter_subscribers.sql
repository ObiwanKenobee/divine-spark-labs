-- Create newsletter_subscribers table
-- Run this migration using your database migration tool or via psql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  tenant_id uuid NULL REFERENCES public.tenants(id) ON DELETE SET NULL,
  plan text NULL,
  name text NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed boolean NOT NULL DEFAULT false,
  unsubscribed_at timestamptz NULL,
  unsubscribe_token text NULL UNIQUE,
  metadata jsonb NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers (lower(email));
CREATE INDEX IF NOT EXISTS idx_newsletter_tenant ON public.newsletter_subscribers (tenant_id);
