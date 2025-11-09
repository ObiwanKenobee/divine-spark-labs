exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const email = body.email;
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: 'email required' }) };

    console.log('Newsletter subscribe:', email, body.source || null);

    // If Supabase configured, insert into newsletter table
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_SERVICE_ROLE;
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        await supabase.from('newsletter_subscriptions').insert([{ email, meta: body, created_at: new Date().toISOString() }]);
      } catch (e) {
        console.warn('Failed to persist newsletter subscription', e.message || e);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('subscribe-newsletter error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};
