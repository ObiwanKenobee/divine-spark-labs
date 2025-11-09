import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const samplePartnerships = [
  { id: 'p1', name: 'Regenerative Ag Network', sector: 'Agriculture', region: 'Africa', lat: -1.286389, lng: 36.817223, status: 'active' },
  { id: 'p2', name: 'FaithTech Labs', sector: 'Technology', region: 'Global', lat: 37.7749, lng: -122.4194, status: 'pilot' },
];

import { useToast } from '@/hooks/use-toast';

export default function Partnerships() {
  const { toast } = useToast();
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPartnerships = async () => {
      setLoading(true);
      try {
        if ((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY) {
          // Primary attempt: partnerships table
          const { data, error } = await supabase.from('partnerships').select('*').limit(200);
          if (error) {
            // If not found, attempt legacy/alternate table 'fellowships'
            const msg = (error && error.message) || JSON.stringify(error);
            console.warn('Supabase partnerships error:', msg);
            if (msg && msg.includes("Could not find the table 'public.partnerships'")) {
              toast({ title: 'Table missing', description: "'partnerships' table not found in Supabase, attempting 'fellowships' table instead", variant: 'warning' });
              const alt = await supabase.from('fellowships').select('*').limit(200);
              if (alt.error) throw alt.error;
              if (mounted) setPartnerships(alt.data || samplePartnerships);
            } else {
              throw error;
            }
          } else {
            if (mounted) setPartnerships(data || []);
          }
        } else {
          if (mounted) setPartnerships(samplePartnerships);
        }
      } catch (e: any) {
        console.warn('Failed to load partnerships', e);
        toast({ title: 'Load failed', description: 'Could not load partnerships from Supabase — using sample data', variant: 'destructive' });
        if (mounted) setPartnerships(samplePartnerships);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPartnerships();
    return () => { mounted = false; };
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Partnerships & Investment</h1>
          <p className="text-muted-foreground">Scaling capital and collaboration with transparency and shared outcomes.</p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Partnership Map</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">View collaborations by sector and region to identify synergy.</p>
            <div className="mb-4">
              <PartnershipsMap partnerships={partnerships} loading={loading} />
            </div>
            <div className="flex justify-end">
              <Button variant="link">Open Map →</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Proposal Portal</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Submit ideas, track reviews, and monitor funding status.</p>
            <div className="flex justify-end">
              <Button onClick={() => (window.location.href = '/proposals') } variant="outline">Go to Proposal Portal</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Investment Matchmaking</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Align investors and causes via shared values and measurable impact.</p>
            <div className="flex justify-end">
              <Button onClick={() => (window.location.href = '/matchmaking') } >Start Matching</Button>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PartnershipsMap({ partnerships, loading }: { partnerships: any[]; loading: boolean }) {
  // Simple static placeholder map box; integrated map can be built with react-leaflet
  return (
    <div className="h-44 w-full rounded bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">
      {loading ? 'Loading map...' : `${partnerships.length} partnerships loaded`}
    </div>
  );
}
