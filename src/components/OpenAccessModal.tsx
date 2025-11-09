import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function OpenAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  if (!open) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // best-effort post to serverless endpoint
      await fetch('/.netlify/functions/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'open_access_sanctum' }),
      }).catch(() => {});

      try {
        const existing = JSON.parse(localStorage.getItem('jmf_newsletter') || '[]');
        existing.push({ email, ts: new Date().toISOString() });
        localStorage.setItem('jmf_newsletter', JSON.stringify(existing));
      } catch (_) {}

      setEmail('');
      toast({ title: 'Subscribed', description: 'You have been added to the monthly newsletter.' });
      onClose();
    } catch (err) {
      toast({ title: 'Subscribe failed', description: 'Unable to subscribe at this time.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl p-6 bg-card rounded-lg border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Open Access Sanctum — Welcome</h3>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">What's included</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>• Access to core pillars content</li>
              <li>• Community forum access</li>
              <li>• Educational resources</li>
              <li>• Basic ethical frameworks</li>
              <li>• Monthly newsletter</li>
              <li>• Observer workspace access</li>
            </ul>
            <div className="mt-4 space-y-2">
              <Button asChild>
                <a href="/pillars">Explore Core Pillars</a>
              </Button>
              <div className="flex gap-2">
                <Button asChild variant="outline"><a href="/resources">Educational Resources</a></Button>
                <Button asChild variant="ghost"><a href="/frameworks">Ethical Frameworks</a></Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Stay informed</h4>
            <p className="text-sm text-muted-foreground mt-2">Subscribe to the monthly newsletter to receive curated content, learning paths, and community highlights.</p>

            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Subscribe'}</Button>
            </form>

            <div className="mt-6">
              <h5 className="font-semibold">Observer workspace</h5>
              <p className="text-sm text-muted-foreground mt-2">Observer workspaces allow viewing community projects and reading public logs without edit permissions. <a href="/workspaces" className="underline text-primary">Open Observer Workspace</a></p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
