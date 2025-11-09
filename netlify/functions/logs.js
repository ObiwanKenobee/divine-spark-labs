exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    console.log('Client log:', payload);

    // Optional: persist to Supabase when service role provided
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_SERVICE_ROLE;

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        await supabase.from('app_logs').insert([{ payload, created_at: new Date().toISOString() }]);
      } catch (e) {
        console.warn('Failed to persist log to Supabase', e.message || e);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Failed to process client log', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};
