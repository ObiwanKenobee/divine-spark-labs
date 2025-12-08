import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from "@supabase/supabase-js";

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
        const { data, error } = await supabase
          .from('partnerships')
          .select('*')
          .limit(200);
        
        if (error) throw error;
        if (mounted) setPartnerships(data || samplePartnerships);
      } catch (e: any) {
        console.warn('Failed to load partnerships', e);
        if (mounted) setPartnerships(samplePartnerships);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPartnerships();

    // Set up real-time subscription
    const channel: RealtimeChannel = supabase
      .channel('partnerships-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'partnerships' },
        (payload) => {
          const newPartnership = payload.new as any;
          setPartnerships((prev) => [newPartnership, ...prev]);
          toast({ title: "New Partnership", description: `"${newPartnership.name}" was just added!` });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'partnerships' },
        (payload) => {
          const updated = payload.new as any;
          setPartnerships((prev) => prev.map((p) => p.id === updated.id ? updated : p));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'partnerships' },
        (payload) => {
          const deleted = payload.old as { id: string };
          setPartnerships((prev) => prev.filter((p) => p.id !== deleted.id));
        }
      )
      .subscribe();

    return () => { 
      mounted = false; 
      supabase.removeChannel(channel);
    };
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
