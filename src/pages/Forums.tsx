import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // Forums table not yet configured, use sample data
      const sample = [
        { id: 't1', title: 'Welcome to the community!', content: 'Introduce yourself here', created_at: new Date().toISOString() },
        { id: 't2', title: 'Feature requests', content: 'Share your ideas', created_at: new Date().toISOString() },
      ];
      setTopics(sample);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to load topics", description: e?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createTopic = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Missing fields", description: "Please provide title and content." });
      return;
    }
    setLoading(true);
    try {
      // Forums table not yet configured, use sample data
      const newTopic = { id: Math.random().toString(36).slice(2), title: title.trim(), content: content.trim(), created_at: new Date().toISOString() };
      setTopics((t) => [newTopic, ...t]);
      
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
