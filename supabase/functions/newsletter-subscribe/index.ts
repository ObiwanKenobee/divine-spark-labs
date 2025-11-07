import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { email, tenantId, plan, name } = await req.json();
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'email is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // normalize
    const normalizedEmail = email.trim().toLowerCase();

    // Try to insert into newsletter_subscribers table via Supabase REST API
    let inserted = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_SERVICE_ROLE,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ email: normalizedEmail, tenant_id: tenantId || null, plan: plan || null, name: name || null, subscribed_at: new Date().toISOString() }),
        });

        if (res.ok) {
          inserted = await res.json();
        } else {
          const txt = await res.text();
          console.warn('Newsletter insert failed, falling back to audit_logs', res.status, txt);
        }
      } catch (e) {
        console.warn('Newsletter insert error, falling back to audit_logs', e.message);
      }
    }

    // If table not available, write to audit_logs as fallback
    if (!inserted && SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_SERVICE_ROLE,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify([{ action: 'newsletter_subscribe', created_at: new Date().toISOString(), ip_address: null, metadata: { email: normalizedEmail, tenantId, plan, name }, resource_id: null, resource_type: 'newsletter', user_id: null }]),
        });
      } catch (e) {
        console.warn('Failed to write audit log fallback', e.message);
      }
    }

    // Send confirmation email via SendGrid (if configured)
    if (SENDGRID_API_KEY) {
      try {
        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: normalizedEmail }], subject: 'Thanks for subscribing to The Joseph-Marie Foundation' }],
            content: [{ type: 'text/plain', value: `Thank you for subscribing to our newsletter.${plan ? `\nPlan: ${plan}` : ''}` }],
            from: { email: 'no-reply@joseph-marie.org', name: 'The Joseph-Marie Foundation' },
          }),
        });

        if (!sgRes.ok) {
          const txt = await sgRes.text();
          console.warn('SendGrid warning', sgRes.status, txt);
        }
      } catch (e) {
        console.warn('SendGrid send error', e.message);
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('newsletter-subscribe error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
