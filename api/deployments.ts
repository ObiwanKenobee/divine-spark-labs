import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple SSE broadcaster for deployments. NOTE: Serverless platforms may not support long-lived
// connections reliably. For production use, run this on a dedicated server or use a managed pub/sub.

const clients: VercelResponse[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // SSE connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.write(':ok\n\n');
    clients.push(res);

    req.on('close', () => {
      const idx = clients.indexOf(res);
      if (idx !== -1) clients.splice(idx, 1);
    });

    return;
  }

  if (req.method === 'POST') {
    const secret = req.headers['x-deploy-secret'] || req.query.secret;
    if (process.env.DEPLOY_HOOK_SECRET && secret !== process.env.DEPLOY_HOOK_SECRET) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const payload = req.body || { version: new Date().toISOString() };
    const dataStr = JSON.stringify(payload);

    // Broadcast to all connected clients
    clients.forEach((c) => {
      try {
        c.write(`data: ${dataStr}\n\n`);
      } catch (e) {
        // ignore
      }
    });

    // Optionally write to a version file if running on a server with write access
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
