import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-provider, x-signature',
};

/**
 * Expected payload shape (JSON):
 * {
 *   event: 'payment_success' | 'payment_failed',
 *   provider: 'mpesa'|'paystack'|'paypal'|'crypto',
 *   plan: string, // plan slug
 *   amount: number,
 *   currency: string,
 *   transaction_id: string,
 *   user_id?: string, // supabase auth user id when available
 *   user_email?: string,
 *   metadata?: object
 * }
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in env; webhook will still log events but cannot update DB');
}

async function postToSupabase(path: string, body: unknown) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.warn('Skipping supabase request - missing env');
    return null;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase REST error: ${res.status} ${txt}`);
  }

  return res.json();
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const signature = req.headers.get('x-signature') || '';
    const providerHeader = req.headers.get('x-provider') || '';

    const expected = Deno.env.get(`${providerHeader.toUpperCase()}_WEBHOOK_SECRET`) || Deno.env.get('PAYMENT_WEBHOOK_SECRET');
    if (expected && signature !== expected) {
      console.warn('Invalid webhook signature for provider', providerHeader);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const payload = await req.json();
    console.log('Received payment webhook payload:', payload);

    const {
      event,
      provider = providerHeader || payload.provider || 'unknown',
      plan,
      amount,
      currency,
      transaction_id,
      user_id,
      user_email,
      metadata,
    } = payload;

    // Insert audit log record for traceability
    try {
      await postToSupabase('audit_logs', [{
        action: event === 'payment_success' ? 'payment_received' : 'payment_failed',
        created_at: new Date().toISOString(),
        ip_address: null,
        metadata: { provider, plan, amount, currency, transaction_id, user_id, user_email, metadata },
        resource_id: transaction_id || null,
        resource_type: 'payment',
        user_id: user_id || null,
      }]);
    } catch (e) {
      console.error('Failed to write audit log', e);
    }

    if (event !== 'payment_success') {
      return new Response(JSON.stringify({ status: 'ignored' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // For successful payments, if user_id present - provision tenant/workspace and assign role
    if (user_id) {
      try {
        const displayName = (metadata && (metadata.full_name || metadata.name)) || user_email || user_id.substring(0, 8);
        const tenantName = `${displayName} ${plan}`;
        const tenantSlug = slugify(`${displayName}-${plan}-${Date.now()}`);

        const tenantRes = await postToSupabase('tenants', [{
          name: tenantName,
          slug: tenantSlug,
          created_by: user_id,
          billing_plan: plan,
        }]);

        const tenantId = tenantRes && tenantRes[0] && tenantRes[0].id;

        if (tenantId) {
          // upsert profile
          try {
            await postToSupabase('profiles', [{ user_id, tenant_id: tenantId, onboarding_completed: true }]);
          } catch (e) {
            console.error('Failed to upsert profile', e);
          }

          // create workspace
          const workspaceRes = await postToSupabase('workspaces', [{
            name: `${plan} workspace`,
            slug: slugify(`${plan}-${displayName}-${Date.now()}`),
            tenant_id: tenantId,
            created_by: user_id,
            status: 'active',
          }]);

          const workspaceId = workspaceRes && workspaceRes[0] && workspaceRes[0].id;

          if (workspaceId) {
            try {
              await postToSupabase('workspace_members', [{ workspace_id: workspaceId, user_id, role: plan === 'sanctum' ? 'observer' : plan === 'innovator' ? 'fellow' : plan === 'institutional' ? 'admin' : 'owner' }]);
            } catch (e) {
              console.error('Failed to add workspace member', e);
            }
          }
        }

        return new Response(JSON.stringify({ status: 'provisioned' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        console.error('Provisioning failure', e);
        return new Response(JSON.stringify({ status: 'error', error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // If user_id not provided but user_email provided, create tenant record for later linking
    if (user_email) {
      try {
        const displayName = user_email.split('@')[0];
        const tenantName = `${displayName} ${plan}`;
        const tenantSlug = slugify(`${displayName}-${plan}-${Date.now()}`);

        const tenantRes = await postToSupabase('tenants', [{ name: tenantName, slug: tenantSlug, created_by: null, billing_plan: plan }]);
        const tenantId = tenantRes && tenantRes[0] && tenantRes[0].id;

        // note in audit log the linkage required
        try {
          await postToSupabase('audit_logs', [{
            action: 'payment_pending_link',
            created_at: new Date().toISOString(),
            ip_address: null,
            metadata: { note: 'Payment received but no user_id; tenant created for later linking', tenantId, user_email, transaction_id },
            resource_id: transaction_id || null,
            resource_type: 'payment',
            user_id: null,
          }]);
        } catch (e) {
          console.error('Failed to write follow-up audit log', e);
        }

        return new Response(JSON.stringify({ status: 'tenant_created' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        console.error('Failed to create tenant for email', e);
        return new Response(JSON.stringify({ status: 'error', error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Otherwise, just acknowledge
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Webhook error', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
