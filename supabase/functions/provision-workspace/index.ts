import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProvisionWorkspaceRequest {
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  dataClassification?: 'public' | 'restricted' | 'sacred';
  resourceQuota?: {
    storage_gb?: number;
    compute_hours?: number;
    api_calls?: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ProvisionWorkspaceRequest = await req.json();
    console.log('Provisioning workspace:', { user: user.id, ...body });

    // Validate tenant membership
    const { data: tenantMember } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', body.tenantId)
      .eq('user_id', user.id)
      .single();

    if (!tenantMember) {
      return new Response(
        JSON.stringify({ error: 'Not a member of this tenant' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create workspace with provisioning status
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        tenant_id: body.tenantId,
        name: body.name,
        slug: body.slug,
        description: body.description,
        data_classification: body.dataClassification || 'restricted',
        status: 'provisioning',
        resource_quota: body.resourceQuota || {
          storage_gb: 100,
          compute_hours: 1000,
          api_calls: 1000000
        },
        created_by: user.id
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Workspace creation error:', workspaceError);
      return new Response(
        JSON.stringify({ error: workspaceError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Workspace created:', workspace.id);

    // Add creator as workspace owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner'
      });

    if (memberError) {
      console.error('Member creation error:', memberError);
    }

    // Simulate provisioning process
    // In production, this would:
    // - Create k8s namespace
    // - Provision storage buckets
    // - Set up network policies
    // - Create service accounts
    // - Configure monitoring
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mark workspace as active
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        status: 'active',
        provisioned_at: new Date().toISOString()
      })
      .eq('id', workspace.id);

    if (updateError) {
      console.error('Workspace update error:', updateError);
    }

    // Log audit event
    await supabase.rpc('log_audit_event_immutable', {
      p_event_type: 'workspace.provisioned',
      p_action: 'create',
      p_resource_type: 'workspace',
      p_resource_id: workspace.id,
      p_tenant_id: body.tenantId,
      p_workspace_id: workspace.id,
      p_metadata: {
        workspace_name: body.name,
        data_classification: body.dataClassification || 'restricted'
      }
    });

    console.log('Workspace provisioned successfully:', workspace.id);

    return new Response(
      JSON.stringify({
        success: true,
        workspace: {
          ...workspace,
          status: 'active',
          provisioned_at: new Date().toISOString()
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workspace provisioning error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
