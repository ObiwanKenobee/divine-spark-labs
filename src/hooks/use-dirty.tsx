import { useEffect, useState } from 'react';

// Simple global dirty state hook. Components can call setDirty(true) to mark unsaved state.
// Implemented via window.__APP_DIRTY for cross-component access.

declare global {
  interface Window {
    __APP_DIRTY?: boolean;
  }
}

export function setDirty(flag: boolean) {
  window.__APP_DIRTY = !!flag;
  window.dispatchEvent(new CustomEvent('app:dirty', { detail: { dirty: !!flag } }));
}

export function isDirty() {
  return !!window.__APP_DIRTY;
}

export default function useDirty() {
  const [dirty, setDirtyState] = useState<boolean>(isDirty());

  useEffect(() => {
    const handler = (e: any) => setDirtyState(!!(e?.detail?.dirty));
    window.addEventListener('app:dirty', handler as EventListener);
    return () => window.removeEventListener('app:dirty', handler as EventListener);
  }, []);

  return { dirty, setDirty };
}
