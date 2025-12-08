import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type EventItem = { id: string; title: string; date?: string; description?: string; location?: string };

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(200);
      
      if (error) throw error;
      setEvents(data || []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to load events", description: e?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    
    // Set up real-time subscription
    const channel: RealtimeChannel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          const newEvent = payload.new as EventItem;
          setEvents((prev) => [newEvent, ...prev]);
          toast({ title: "New Event", description: `"${newEvent.title}" was just added!` });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events' },
        (payload) => {
          const updated = payload.new as EventItem;
          setEvents((prev) => prev.map((e) => e.id === updated.id ? updated : e));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'events' },
        (payload) => {
          const deleted = payload.old as { id: string };
          setEvents((prev) => prev.filter((e) => e.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createEvent = async () => {
    if (!title.trim() || !date.trim()) {
      toast({ title: "Missing fields", description: "Please provide title and date." });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to create events.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const item = { 
        title: title.trim(), 
        date, 
        description: description.trim(), 
        location: location.trim(),
        user_id: user.id
      };
      
      const { data, error } = await supabase.from("events").insert(item).select();
      if (error) throw error;
      
      setEvents((e) => [...(data || []), ...e]);
      setTitle("");
      setDate("");
      setDescription("");
      setLocation("");
      toast({ title: "Event created", description: "The event has been added." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to create event", description: e?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Events</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Workshops, webinars, and fellowship opportunities.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Create an event</h2>
              <div className="space-y-2">
                <Input placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={createEvent} disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {events.length === 0 && <div className="text-muted-foreground">No upcoming events.</div>}
              {events.map((ev) => (
                <div key={(ev as any).id} className="bg-card border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{ev.title}</h3>
                    <div className="text-xs text-muted-foreground">{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{ev.description}</p>
                  {ev.location && <div className="text-xs text-muted-foreground mt-2">Location: {ev.location}</div>}
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <h4 className="text-sm font-medium">Upcoming Highlights</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-2">
                {events.slice(0,5).map((e) => (
                  <li key={(e as any).id}>{e.title} — {e.date ? new Date(e.date).toLocaleDateString() : 'TBA'}</li>
                ))}
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <h4 className="text-sm font-medium">Host an event</h4>
              <p className="text-sm text-muted-foreground mt-2">Contact us at <a href="mailto:events@jmf.org" className="underline">events@jmf.org</a> to propose a workshop.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
