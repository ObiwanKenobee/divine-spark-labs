import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Matchmaking() {
  const { toast } = useToast();
  const [proposalId, setProposalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[] | null>(null);

  const runMatch = async () => {
    if (!proposalId) {
      toast({ title: 'Missing proposal id', description: 'Enter a proposal id to match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/.netlify/functions/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error || 'Match failed');
      setMatches(json.matches || []);
    } catch (e: any) {
      toast({ title: 'Match error', description: e?.message || String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Investment Matchmaking</h1>
          <p className="text-muted-foreground">Align investors and causes via shared values and measurable impact.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Quick Match</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter a proposal id to compute ranked matches from investor profiles.</p>
            <div className="flex gap-2 items-center">
              <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} placeholder="proposal id" className="input" />
              <Button onClick={runMatch} disabled={loading}>{loading ? 'Matching...' : 'Run Match'}</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Matches</h2>
            <p className="text-sm text-muted-foreground mb-4">Results will show ranked investors and scores.</p>
            <div>
              {matches === null ? (
                <div className="text-sm text-muted-foreground">No matches computed yet.</div>
              ) : matches.length === 0 ? (
                <div className="text-sm text-muted-foreground">No matches found.</div>
              ) : (
                <ul className="space-y-2">
                  {matches.map((m: any, i: number) => (
                    <li key={i} className="p-2 border rounded">
                      <div className="font-semibold">{m.investor?.name || 'Investor'}</div>
                      <div className="text-xs text-muted-foreground">Score: {m.score}</div>
                      <div className="text-sm">{m.investor?.profile}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
