import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Program = { id: string; title: string; description?: string; seats?: number };

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("title", { ascending: true })
        .limit(200);
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to load programs", description: e?.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const join = async (p: Program) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to join programs.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('program_members')
        .insert({ program_id: p.id, user_id: user.id });
      
      if (error) throw error;
      toast({ title: 'Joined', description: `You've joined ${p.title}` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Join failed', description: e?.message || '' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Collaborative Programs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explore fellowships, cohorts, and shared initiatives.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div key={p.id} className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => join(p)}>Join</Button>
                <Button variant="ghost" onClick={() => window.location.href = `/programs/${p.id}`} >Details</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
