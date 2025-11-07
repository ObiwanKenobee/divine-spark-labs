import React from 'react';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-card rounded-lg border p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close modal" className="text-muted-foreground">✕</button>
        </div>
        <div className="max-h-[60vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
