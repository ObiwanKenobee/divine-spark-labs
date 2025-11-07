import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Accepts POST { provider: 'mpesa'|'paystack'|'paypal'|'crypto', plan: 'innovator', success_url?, cancel_url? }
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const { provider, plan, success_url, cancel_url } = body;

    if (!provider || !plan) {
      return new Response(JSON.stringify({ error: 'provider and plan required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Try provider-specific env override, then fallback to generic
    const env = Deno.env;
    const providerKey = `${provider.toUpperCase()}_LINK_${plan.toUpperCase()}`;
    const genericKey = `PAYMENT_LINK_${plan.toUpperCase()}`;

    const target = env.get(providerKey) || env.get(genericKey);

    if (target) {
      // Append success/cancel params if present and if target is same-origin
      let url = target;
      if ((success_url || cancel_url) && url.startsWith('http')) {
        const u = new URL(url);
        if (success_url) u.searchParams.set('success_url', success_url);
        if (cancel_url) u.searchParams.set('cancel_url', cancel_url);
        url = u.toString();
      }

      return new Response(JSON.stringify({ url }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Prototype behavior: return a fake hosted checkout URL
    const fake = `https://example.com/checkout/${provider}/${plan}?success_url=${encodeURIComponent(success_url||'/auth')}&cancel_url=${encodeURIComponent(cancel_url||'/')}`;

    return new Response(JSON.stringify({ url: fake }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('create-checkout-session error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
