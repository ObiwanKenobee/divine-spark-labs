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
      // Programs table not yet configured, use sample data
      const sample = [
        { id: 'p1', title: 'Women Leaders Fellowship', description: 'A cohort focused on female-led ventures', seats: 20 },
        { id: 'p2', title: 'Youth Innovation Lab', description: 'Hands-on projects for 15–24 age group', seats: 30 },
      ];
      setPrograms(sample);
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
      // Program members table not yet configured, use console log
      console.log('Join program:', p.id, p.title);
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
