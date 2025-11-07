import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-provider, x-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const provider = req.headers.get('x-provider') || 'unknown';
    const signature = req.headers.get('x-signature') || '';

    // Accept simple token-based verification in prototype mode
    const expected = Deno.env.get(`${provider.toUpperCase()}_WEBHOOK_SECRET`) || Deno.env.get('PAYMENT_WEBHOOK_SECRET');

    if (expected && signature !== expected) {
      console.warn('Invalid webhook signature for provider', provider);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.text();
    console.log('Received payment webhook', { provider, body });

    // Basic acknowledgement; real implementation should verify payload and update DB
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Webhook error', err);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
