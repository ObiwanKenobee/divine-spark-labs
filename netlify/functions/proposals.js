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
      let query = supabase.from('proposals').select('*');
      if (params.status) query = query.eq('status', params.status);
      if (params.submitter_id) query = query.eq('submitter_id', params.submitter_id);
      const { data, error } = await query.order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ data }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      // Basic server-side validation
      if (!body.title || !body.summary) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing title or summary' }) };
      }

      const payload = {
        title: body.title,
        summary: body.summary,
        sector: body.sector || null,
        region: body.region || null,
        requested_amount: body.requested_amount || null,
        milestones: body.milestones || null,
        attachments: body.attachments || null,
        submitter_id: body.submitter_id || null,
        status: 'submitted'
      };

      const { data, error } = await supabase.from('proposals').insert([payload]).select().single();
      if (error) throw error;
      return { statusCode: 201, body: JSON.stringify({ data }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
