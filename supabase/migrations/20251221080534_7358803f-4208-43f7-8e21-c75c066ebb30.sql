-- Create security definer function to check tenant membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_tenant_member(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_members
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
  )
$$;

-- Create security definer function to check if user is tenant admin/owner
CREATE OR REPLACE FUNCTION public.is_tenant_admin(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_members
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = ANY (ARRAY['owner'::text, 'admin'::text])
  )
$$;

-- Get all tenant IDs for a user (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.tenant_members WHERE user_id = _user_id
$$;

-- Get tenant IDs where user is admin/owner
CREATE OR REPLACE FUNCTION public.get_user_admin_tenant_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.tenant_members 
  WHERE user_id = _user_id 
  AND role = ANY (ARRAY['owner'::text, 'admin'::text])
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Tenant admins can manage members" ON public.tenant_members;
DROP POLICY IF EXISTS "Users can view tenant members" ON public.tenant_members;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view tenant members"
ON public.tenant_members
FOR SELECT
USING (
  tenant_id IN (SELECT public.get_user_tenant_ids(auth.uid()))
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Tenant admins can manage members"
ON public.tenant_members
FOR ALL
USING (
  tenant_id IN (SELECT public.get_user_admin_tenant_ids(auth.uid()))
  OR public.is_admin(auth.uid())
);