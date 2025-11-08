import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

export default function Deployments() {
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const [events, setEvents] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [sse, setSse] = useState<EventSource | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('deploy_events');
    if (raw) setEvents(JSON.parse(raw));
  }, []);

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem('deploy_events');
      if (raw) setEvents(JSON.parse(raw));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!isAdmin) return null;

  const connectSse = () => {
    if (sse) return;
    const es = new EventSource('/api/deployments');
    es.onopen = () => setConnected(true);
    es.onmessage = (m) => {
      try {
        const data = JSON.parse(m.data);
        const ev = { ...data, ts: new Date().toISOString() };
        const arr = [ev, ...(JSON.parse(localStorage.getItem('deploy_events') || '[]'))];
        localStorage.setItem('deploy_events', JSON.stringify(arr.slice(0, 50)));
        setEvents(arr.slice(0,50));
        toast({ title: 'Deployment event received', description: data.version || data.timestamp });
      } catch (e) {
        console.debug('Invalid SSE message', e);
      }
    };
    es.onerror = () => { setConnected(false); es.close(); setSse(null); };
    setSse(es);
  };

  const disconnectSse = () => {
    if (sse) {
      sse.close();
      setSse(null);
      setConnected(false);
    }
  };

  const triggerEvent = async () => {
    try {
      const secret = prompt('Enter deploy hook secret to trigger (env: DEPLOY_HOOK_SECRET)');
      if (!secret) return;
      const res = await fetch('/api/deployments', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-deploy-secret': secret }, body: JSON.stringify({ version: new Date().toISOString(), source: 'manual' }) });
      if (!res.ok) throw new Error('Failed to trigger');
      toast({ title: 'Triggered' });
    } catch (e: any) {
      toast({ title: 'Trigger failed', description: e.message, variant: 'destructive' });
    }
  };

  const manualReload = () => {
    if (window.confirm('Force reload to apply latest deployment? This will discard unsaved changes.')) {
      window.location.reload();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('deploy_events');
    setEvents([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Deployments</h2>
      <p className="text-sm text-muted-foreground mb-4">Live deployment events and controls</p>
      <div className="flex gap-2 mb-4">
        {!connected && <Button onClick={connectSse}>Connect SSE</Button>}
        {connected && <Button variant="destructive" onClick={disconnectSse}>Disconnect SSE</Button>}
        <Button onClick={triggerEvent} variant="outline">Trigger Event</Button>
        <Button onClick={manualReload} variant="secondary">Reload Anyway</Button>
        <Button onClick={clearHistory} variant="ghost">Clear History</Button>
      </div>

      <div className="space-y-2">
        {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        {events.map((ev, idx) => (
          <div key={idx} className="p-3 border rounded bg-card">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{ev.payload?.version || ev.version || ev.payload?.timestamp || ev.timestamp || 'unknown'}</div>
                <div className="text-xs text-muted-foreground">{ev.payload?.source || ev.source || ev.type || 'deploy'}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(ev.ts || ev.payload?.ts || Date.now()).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
