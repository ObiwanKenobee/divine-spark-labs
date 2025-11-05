-- Phase 1: Multi-tenant Workspace System with Audit Logging

-- Create enum for workspace roles
CREATE TYPE workspace_role AS ENUM (
  'owner',
  'admin', 
  'project_lead',
  'fellow',
  'researcher',
  'observer'
);

-- Create enum for workspace status
CREATE TYPE workspace_status AS ENUM (
  'provisioning',
  'active',
  'suspended',
  'archived',
  'deleted'
);

-- Create enum for data classification
CREATE TYPE data_classification AS ENUM (
  'public',
  'restricted',
  'sacred'
);

-- Create enum for consent types
CREATE TYPE consent_type AS ENUM (
  'terms_of_service',
  'privacy_policy',
  'data_processing',
  'research_ethics'
);

-- Tenants table (organizations)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  data_residency TEXT DEFAULT 'global',
  compliance_flags JSONB DEFAULT '[]'::jsonb,
  billing_plan TEXT DEFAULT 'starter',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant members (replaces organization_members conceptually)
CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID,
  UNIQUE(tenant_id, user_id)
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  status workspace_status DEFAULT 'provisioning',
  data_classification data_classification DEFAULT 'restricted',
  resource_quota JSONB DEFAULT '{
    "storage_gb": 100,
    "compute_hours": 1000,
    "api_calls": 1000000
  }'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  provisioned_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Workspace members with roles
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role workspace_role DEFAULT 'observer',
  permissions JSONB DEFAULT '{}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID,
  UNIQUE(workspace_id, user_id)
);

-- Onboarding consents (versioned)
CREATE TABLE onboarding_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  consent_type consent_type NOT NULL,
  consent_version TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable audit events with hash chaining
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_id UUID,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  resource_type TEXT,
  resource_id UUID,
  action TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  previous_hash TEXT,
  event_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tenant_id to profiles for tenant association
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX idx_workspaces_tenant ON workspaces(tenant_id);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_events_tenant ON audit_events(tenant_id);
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_created ON audit_events(created_at DESC);
CREATE INDEX idx_consents_user ON onboarding_consents(user_id);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view their tenant"
  ON tenants FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    ) OR is_admin(auth.uid())
  );

CREATE POLICY "Users can create tenants"
  ON tenants FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Tenant admins can update"
  ON tenants FOR UPDATE
  USING (
    id IN (
      SELECT tenant_id FROM tenant_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR is_admin(auth.uid())
  );

-- RLS Policies for tenant_members
CREATE POLICY "Users can view tenant members"
  ON tenant_members FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    ) OR is_admin(auth.uid())
  );

CREATE POLICY "Tenant admins can manage members"
  ON tenant_members FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR is_admin(auth.uid())
  );

-- RLS Policies for workspaces
CREATE POLICY "Users can view workspaces they have access to"
  ON workspaces FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ) OR 
    tenant_id IN (
      SELECT tenant_id FROM tenant_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Tenant members can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    ) AND auth.uid() = created_by
  );

CREATE POLICY "Workspace owners can update"
  ON workspaces FOR UPDATE
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR is_admin(auth.uid())
  );

-- RLS Policies for workspace_members
CREATE POLICY "Users can view workspace members"
  ON workspace_members FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ) OR is_admin(auth.uid())
  );

CREATE POLICY "Workspace admins can manage members"
  ON workspace_members FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR is_admin(auth.uid())
  );

-- RLS Policies for consents
CREATE POLICY "Users can view their consents"
  ON onboarding_consents FOR SELECT
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users can create their consents"
  ON onboarding_consents FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for audit_events (read-only for users, admins can read all)
CREATE POLICY "Users can view their audit events"
  ON audit_events FOR SELECT
  USING (
    actor_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ) OR
    is_admin(auth.uid())
  );

-- Function to generate event hash (simple SHA256)
CREATE OR REPLACE FUNCTION generate_event_hash(
  p_event_type TEXT,
  p_action TEXT,
  p_actor_id UUID,
  p_metadata JSONB,
  p_previous_hash TEXT,
  p_timestamp TIMESTAMPTZ
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash_input TEXT;
BEGIN
  v_hash_input := p_event_type || '|' || 
                  p_action || '|' || 
                  COALESCE(p_actor_id::TEXT, 'null') || '|' || 
                  COALESCE(p_metadata::TEXT, '{}') || '|' || 
                  COALESCE(p_previous_hash, 'genesis') || '|' || 
                  p_timestamp::TEXT;
  
  RETURN encode(digest(v_hash_input, 'sha256'), 'hex');
END;
$$;

-- Function to log audit event with hash chaining
CREATE OR REPLACE FUNCTION log_audit_event_immutable(
  p_event_type TEXT,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_tenant_id UUID DEFAULT NULL,
  p_workspace_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
  v_previous_hash TEXT;
  v_event_hash TEXT;
  v_timestamp TIMESTAMPTZ;
BEGIN
  v_timestamp := NOW();
  v_event_id := gen_random_uuid();
  
  -- Get the last event hash for chaining
  SELECT event_hash INTO v_previous_hash
  FROM audit_events
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Generate new hash
  v_event_hash := generate_event_hash(
    p_event_type,
    p_action,
    auth.uid(),
    p_metadata,
    v_previous_hash,
    v_timestamp
  );
  
  -- Insert audit event
  INSERT INTO audit_events (
    id,
    event_type,
    actor_id,
    tenant_id,
    workspace_id,
    resource_type,
    resource_id,
    action,
    metadata,
    previous_hash,
    event_hash,
    created_at
  ) VALUES (
    v_event_id,
    p_event_type,
    auth.uid(),
    p_tenant_id,
    p_workspace_id,
    p_resource_type,
    p_resource_id,
    p_action,
    p_metadata,
    v_previous_hash,
    v_event_hash,
    v_timestamp
  );
  
  RETURN v_event_id;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();