import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Topic = { id: string; title: string; content: string; created_at?: string };

const Forums = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      
      if (error) throw error;
      setTopics(data || []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to load topics", description: e?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    
    // Set up real-time subscription
    const channel: RealtimeChannel = supabase
      .channel('forums-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forums' },
        (payload) => {
          const newTopic = payload.new as Topic;
          setTopics((prev) => [newTopic, ...prev]);
          toast({ title: "New Topic", description: `"${newTopic.title}" was just posted!` });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'forums' },
        (payload) => {
          const updated = payload.new as Topic;
          setTopics((prev) => prev.map((t) => t.id === updated.id ? updated : t));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'forums' },
        (payload) => {
          const deleted = payload.old as { id: string };
          setTopics((prev) => prev.filter((t) => t.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createTopic = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Missing fields", description: "Please provide title and content." });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to post topics.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const newTopic = { 
        title: title.trim(), 
        content: content.trim(),
        user_id: user.id
      };
      
      const { data, error } = await supabase.from("forums").insert(newTopic).select();
      if (error) throw error;
      
      setTopics((t) => [...(data || []), ...t]);
      setTitle("");
      setContent("");
      toast({ title: "Posted", description: "Your topic has been created." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to create topic", description: e?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Forums</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Participate in discussions, Q&A, and working groups.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Start a new topic</h2>
              <div className="space-y-2">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Share your idea or question..." value={content} onChange={(e) => setContent(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={createTopic} disabled={loading}>{loading ? 'Posting...' : 'Post Topic'}</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {topics.length === 0 && <div className="text-muted-foreground">No topics yet.</div>}
              {topics.map((t) => (
                <div key={(t as any).id} className="bg-card border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{t.title}</h3>
                    <div className="text-xs text-muted-foreground">{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{t.content}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <h4 className="text-sm font-medium">Working Groups</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-2">
                <li>Ethics & Governance</li>
                <li>Women-led Innovation</li>
                <li>Age-Group Labs</li>
                <li>Impact Measurement</li>
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <h4 className="text-sm font-medium">Guidelines</h4>
              <p className="text-sm text-muted-foreground mt-2">Be respectful, cite sources, and prioritize regenerative outcomes.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Forums;
