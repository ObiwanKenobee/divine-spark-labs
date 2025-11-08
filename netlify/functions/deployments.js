// Netlify Functions: deployments
// Simple SSE broadcaster. Persistent clients in function scope may work for warm lambdas but is not a durable solution.

const clients = [];

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    // Netlify functions aren't ideal for SSE; this is a best-effort example.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      },
      body: ':ok\n\n'
    };
  }

  if (event.httpMethod === 'POST') {
    const headers = event.headers || {};
    const secret = headers['x-deploy-secret'] || headers['x-deploy-secret'.toLowerCase()];
    if (process.env.DEPLOY_HOOK_SECRET && secret !== process.env.DEPLOY_HOOK_SECRET) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
    }

    const payload = JSON.parse(event.body || '{}');
    const dataStr = JSON.stringify(payload);

    // No real broadcast here in Netlify functions. Return OK for webhook.
    return { statusCode: 200, body: JSON.stringify({ ok: true, payload }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
