import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isDirty } from "@/hooks/use-dirty";

const POLL_INTERVAL = Number(import.meta.env.VITE_AUTO_RELOAD_INTERVAL_MS) || 15000;
const VERSION_URL = "/version.json";
const SSE_URL = "/api/deployments";

function pushLocalEvent(ev: any) {
  try {
    const key = 'deploy_events';
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ ...ev, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 50)));
  } catch (e) {
    console.debug('Failed to persist deploy event', e);
  }
}

export default function AutoReloader() {
  const last = useRef<string | null>(null);
  const { toast } = useToast();
  const [usingSse, setUsingSse] = useState(false);

  useEffect(() => {
    let mounted = true;
    let es: EventSource | null = null;

    const handleDeployEvent = (data: any) => {
      const v = data?.version || data?.timestamp || JSON.stringify(data);
      // if first time, set last
      if (!last.current) {
        last.current = v;
        pushLocalEvent({ type: 'initial', payload: data });
        return;
      }

      // if different
      if (last.current && v !== last.current) {
        last.current = v;
        pushLocalEvent({ type: 'deploy', payload: data });

        if (isDirty()) {
          toast({ title: 'New deployment detected', description: 'You have unsaved changes — click "Reload anyway" in Deployments to refresh.' });
          // don't reload automatically
          return;
        }

        toast({ title: 'New deployment detected', description: 'Reloading to latest version...' });
        setTimeout(() => window.location.reload(), 800);
      }
    };

    const trySse = () => {
      try {
        es = new EventSource(SSE_URL);
        es.onopen = () => {
          if (!mounted) return;
          setUsingSse(true);
          toast({ title: 'Live reload connected', description: 'Watching for deployments via SSE.' });
        };
        es.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            handleDeployEvent(data);
          } catch (e) {
            console.debug('Invalid SSE message', e);
          }
        };
        es.onerror = (err) => {
          console.debug('SSE connection error', err);
          if (es) es.close();
          setUsingSse(false);
        };
      } catch (e) {
        console.debug('SSE not available', e);
        setUsingSse(false);
      }
    };

    // Start SSE, fallback to polling
    trySse();

    const poll = async () => {
      try {
        const res = await fetch(VERSION_URL, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const v = data?.version || data?.timestamp || JSON.stringify(data);
        if (!last.current) {
          last.current = v;
          pushLocalEvent({ type: 'initial', payload: data });
          return;
        }
        if (last.current && v !== last.current) {
          last.current = v;
          pushLocalEvent({ type: 'deploy', payload: data });

          if (isDirty()) {
            toast({ title: 'New deployment detected', description: 'You have unsaved changes — visit Deployments to reload manually.' });
            return;
          }

          toast({ title: 'New deployment detected', description: 'Reloading to latest version...' });
          setTimeout(() => window.location.reload(), 800);
        }
      } catch (e) {
        console.debug('AutoReloader fetch failed', e);
      }
    };

    const id = setInterval(() => {
      if (!mounted) return;
      if (!usingSse) poll();
    }, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(id);
      if (es) es.close();
    };
  }, [toast, usingSse]);

  return null;
}
