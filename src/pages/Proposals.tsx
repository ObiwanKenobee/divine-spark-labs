import { useEffect, useState } from "react";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Proposals() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/.netlify/functions/proposals');
        if (!res.ok) {
          // fallback to localStorage if not configured
          throw new Error(`Endpoint error: ${res.status}`);
        }
        const body = await res.json();
        const data = body?.data || [];
        if (mounted) setProposals(data);
        return;
      } catch (e: any) {
        console.warn('Proposals fetch failed, falling back to localStorage', e?.message || e);
        try {
          const local = JSON.parse(localStorage.getItem('jmf_proposals') || '[]');
          if (mounted) setProposals(local || []);
          toast({ title: 'Offline mode', description: 'Proposals loaded from local storage.', variant: 'warning' });
        } catch (err) {
          console.error('Failed to load proposals from localStorage', err);
          if (mounted) setProposals([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProposals();
    return () => { mounted = false; };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      toast({ title: 'Missing fields', description: 'Please provide a title and summary.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      summary,
      sector: sector || null,
      region: region || null,
      requested_amount: requestedAmount || null,
    } as any;

    try {
      const res = await fetch('/.netlify/functions/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const body = await res.json();
        const created = body?.data || null;
        if (created) {
          setProposals((p) => [created, ...p]);
          toast({ title: 'Proposal submitted', description: 'Your proposal was submitted successfully.' });
        } else {
          toast({ title: 'Submitted', description: 'Proposal submitted but no confirmation received.' });
        }
        // clear form
        setTitle(''); setSummary(''); setSector(''); setRegion(''); setRequestedAmount('');
        return;
      }

      // non-OK: fallback to localStorage
      const errText = await res.text();
      console.warn('Server returned non-OK when submitting proposal', res.status, errText);
    } catch (err) {
      console.warn('Proposal submission failed, saving locally', err);
    }

    // Fallback: save locally
    try {
      const existing = JSON.parse(localStorage.getItem('jmf_proposals') || '[]');
      const record = { id: `local-${Date.now()}`, title, summary, sector, region, requested_amount: requestedAmount, status: 'saved', created_at: new Date().toISOString() };
      existing.unshift(record);
      localStorage.setItem('jmf_proposals', JSON.stringify(existing));
      setProposals((p) => [record, ...p]);
      setTitle(''); setSummary(''); setSector(''); setRegion(''); setRequestedAmount('');
      toast({ title: 'Saved locally', description: 'Proposal saved locally and will be sent when the server is available.', variant: 'warning' });
    } catch (e) {
      console.error('Failed to save proposal locally', e);
      toast({ title: 'Error', description: 'Could not submit proposal. Try again later.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Proposal Portal</h1>
          <p className="text-muted-foreground">Submit project proposals and track review status.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading proposals...</p>
                ) : proposals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No proposals found.</p>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((p) => (
                      <div key={p.id} className="p-4 border rounded bg-background">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="text-xs text-muted-foreground">{p.sector || '—'} • {p.region || '—'}</p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <div>{p.status || 'submitted'}</div>
                            <div>{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Submit a Proposal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs block mb-1">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Summary</label>
                    <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={4} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Sector</label>
                    <Input value={sector} onChange={(e) => setSector(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Region</label>
                    <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Requested amount</label>
                    <Input value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button variant="outline" onClick={() => { setTitle(''); setSummary(''); setSector(''); setRegion(''); setRequestedAmount(''); }}>Reset</Button>
                    <Button type="submit" className="ml-2" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Proposal'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
