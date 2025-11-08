import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const POLL_INTERVAL = Number(import.meta.env.VITE_AUTO_RELOAD_INTERVAL_MS) || 15000;
const VERSION_URL = "/version.json";

export default function AutoReloader() {
  const last = useRef<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch(VERSION_URL, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const v = data?.version || data?.timestamp || JSON.stringify(data);
        if (!last.current) {
          last.current = v;
          return;
        }
        if (last.current && v !== last.current) {
          // notify and reload
          toast({ title: "New deployment detected", description: "Reloading to latest version..." });
          // give a small delay to show toast
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      } catch (e) {
        // silent - file may not exist in some environments
        console.debug("AutoReloader fetch failed", e);
      }
    };

    // initial load
    check();
    const id = setInterval(() => {
      if (!mounted) return;
      check();
    }, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [toast]);

  return null;
}
