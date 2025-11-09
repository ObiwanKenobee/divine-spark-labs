import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function InquiryModal({ plan, onClose }: { plan: any; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Try to persist via Supabase if configured
    try {
      if ((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY) {
        const payload = {
          plan: plan.slug,
          name,
          email,
          organization: org,
          message,
          metadata: {},
        } as any;

        const { data, error } = await supabase.from('inquiries').insert([payload]).select().single();
        if (error) throw error;

        setSent(true);
        toast({ title: 'Inquiry sent', description: 'We received your inquiry and will contact you shortly.' });
        return;
      }
    } catch (err: any) {
      console.warn('Supabase insert failed, falling back to localStorage', err?.message || err);
      toast({ title: 'Saved locally', description: 'Saved inquiry locally. Connect Supabase to persist it centrally.', variant: 'warning' });
    }

    // Fallback: store inquiry in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('jmf_inquiries') || '[]');
      existing.push({ plan: plan.slug, name, email, org, message, created_at: new Date().toISOString() });
      localStorage.setItem('jmf_inquiries', JSON.stringify(existing));
      setSent(true);
      toast({ title: 'Saved locally', description: 'Inquiry saved locally. Will persist centrally when Supabase is connected.' });
    } catch (e) {
      console.error('Failed to save inquiry locally', e);
      toast({ title: 'Error', description: 'Could not save inquiry. Please try again later.', variant: 'destructive' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl p-6 bg-card rounded-lg border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contact Sales — {plan.name}</h3>
          <button className="text-muted-foreground" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {sent ? (
          <div className="p-4 rounded bg-green-50">
            <p className="font-semibold">Thanks — your inquiry was received.</p>
            <p className="text-sm text-muted-foreground">We will reach out to the email provided within 48 hours.</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs block mb-1">Full name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs block mb-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1">Organization</label>
              <Input value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
            <div>
              <label className="text-xs block mb-1">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">We'll contact you to arrange a demo and discuss deployment options.</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Send Inquiry</Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
