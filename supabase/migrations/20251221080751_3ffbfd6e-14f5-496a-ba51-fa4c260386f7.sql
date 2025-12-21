-- Fix tenants RLS policies using security definer functions to avoid recursion
DROP POLICY IF EXISTS "Tenant admins can update" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenant" ON public.tenants;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view their tenant"
ON public.tenants
FOR SELECT
USING (
  id IN (SELECT public.get_user_tenant_ids(auth.uid()))
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Tenant admins can update"
ON public.tenants
FOR UPDATE
USING (
  id IN (SELECT public.get_user_admin_tenant_ids(auth.uid()))
  OR public.is_admin(auth.uid())
);