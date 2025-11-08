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
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
      const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
      if (supabaseUrl && supabaseKey) {
        const { data, error } = await supabase.from("programs").select("*").order("title", { ascending: true }).limit(200);
        if (error) throw error;
        setPrograms(data || []);
      } else {
        const raw = localStorage.getItem("jmf_programs");
        if (raw) setPrograms(JSON.parse(raw));
        else {
          const sample = [
            { id: 'p1', title: 'Women Leaders Fellowship', description: 'A cohort focused on female-led ventures', seats: 20 },
            { id: 'p2', title: 'Youth Innovation Lab', description: 'Hands-on projects for 15–24 age group', seats: 30 },
          ];
          setPrograms(sample);
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to load programs", description: e?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const join = async (p: Program) => {
    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
      const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
      if (supabaseUrl && supabaseKey) {
        // For now just record a lightweight join in a program_members table if present
        const { error } = await supabase.from('program_members').insert({ program_id: p.id, joined_at: new Date().toISOString() });
        if (error) throw error;
        toast({ title: 'Joined', description: `You've joined ${p.title}` });
      } else {
        const raw = localStorage.getItem('jmf_program_members') || '[]';
        const arr = JSON.parse(raw);
        arr.push({ program_id: p.id, joined_at: new Date().toISOString() });
        localStorage.setItem('jmf_program_members', JSON.stringify(arr));
        toast({ title: 'Joined', description: `You've joined ${p.title} (local)` });
      }
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
