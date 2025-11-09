import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error capture: reports to /api/logs and localStorage
window.addEventListener('error', (event) => {
  try {
    const payload = {
      type: 'error',
      message: (event && (event.error?.message || event.message)) || 'Unknown error',
      stack: event.error?.stack || null,
      filename: event.filename || null,
      lineno: (event as any).lineno || null,
      colno: (event as any).colno || null,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    };
    // best-effort send
    fetch('/.netlify/functions/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
    // keep last errors locally for debugging
    try { const errs = JSON.parse(localStorage.getItem('jmf_client_errors') || '[]'); errs.push(payload); localStorage.setItem('jmf_client_errors', JSON.stringify(errs.slice(-50))); } catch (_) {}
  } catch (_) {}
});

window.addEventListener('unhandledrejection', (ev) => {
  try {
    const reason = (ev && (ev.reason?.message || ev.reason)) || 'Unhandled rejection';
    const payload = { type: 'unhandledrejection', message: reason, ts: new Date().toISOString(), userAgent: navigator.userAgent };
    fetch('/.netlify/functions/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
    try { const errs = JSON.parse(localStorage.getItem('jmf_client_errors') || '[]'); errs.push(payload); localStorage.setItem('jmf_client_errors', JSON.stringify(errs.slice(-50))); } catch (_) {}
  } catch (_) {}
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
