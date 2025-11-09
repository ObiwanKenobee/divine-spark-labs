const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase not configured' })
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  if (event.httpMethod === 'GET') {
    try {
      const params = event.queryStringParameters || {};
      let query = supabase.from('partnerships').select('*');

      if (params.sector) query = query.eq('sector', params.sector);
      if (params.region) query = query.eq('region', params.region);
      if (params.status) query = query.eq('status', params.status);

      const { data, error } = await query.order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ data }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
