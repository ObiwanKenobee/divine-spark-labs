const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { proposal_id } = JSON.parse(event.body || '{}');
    if (!proposal_id) return { statusCode: 400, body: JSON.stringify({ error: 'proposal_id required' }) };

    // Fetch proposal
    const { data: proposal } = await supabase.from('proposals').select('*').eq('id', proposal_id).single();
    if (!proposal) return { statusCode: 404, body: JSON.stringify({ error: 'Proposal not found' }) };

    // Simple matching: fetch investors that share the sector
    let { data: investors } = await supabase.from('investors').select('*').limit(200);
    investors = investors || [];

    const matches = investors.map((inv) => {
      let score = 0;
      if (inv.sectors && Array.isArray(inv.sectors) && inv.sectors.includes(proposal.sector)) score += 50;
      // ticket size match
      if (proposal.requested_amount && inv.min_ticket && inv.max_ticket) {
        const amt = parseFloat(proposal.requested_amount) || 0;
        if (amt >= inv.min_ticket && amt <= inv.max_ticket) score += 30;
      }
      // region preference
      if (inv.region_preferences && Array.isArray(inv.region_preferences) && proposal.region && inv.region_preferences.includes(proposal.region)) score += 20;

      return { investor: inv, score };
    }).sort((a,b) => b.score - a.score).slice(0,20);

    return { statusCode: 200, body: JSON.stringify({ matches }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};
