import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Pioneer = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  projects: string[] | null;
  focusAreas: string[] | null;
  location: {
    city: string | null;
    country: string;
    lat: number | null;
    lng: number | null;
  };
  website?: string | null;
  linkedin?: string | null;
  contact?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean | null;
};

export function usePioneers() {
  const [pioneers, setPioneers] = useState<Pioneer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPioneers() {
      try {
        const { data, error: fetchError } = await supabase
          .from('women_pioneers')
          .select('*')
          .eq('is_verified', true)
          .order('name');

        if (fetchError) throw fetchError;

        const transformedPioneers: Pioneer[] = (data || []).map((p: Tables<'women_pioneers'>) => ({
          id: p.id,
          name: p.name,
          title: p.title,
          bio: p.bio,
          projects: p.projects,
          focusAreas: p.focus_areas,
          location: {
            city: p.city,
            country: p.country,
            lat: p.lat,
            lng: p.lng,
          },
          website: p.website_url,
          linkedin: p.linkedin_url,
          contact: p.contact_email,
          avatarUrl: p.avatar_url,
          isVerified: p.is_verified,
        }));

        setPioneers(transformedPioneers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pioneers');
      } finally {
        setLoading(false);
      }
    }

    fetchPioneers();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('women_pioneers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'women_pioneers',
          filter: 'is_verified=eq.true',
        },
        () => {
          fetchPioneers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pioneers, loading, error };
}
