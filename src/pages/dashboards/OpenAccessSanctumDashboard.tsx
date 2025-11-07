import { useState } from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, MessageCircle, Mail, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OpenAccessSanctumDashboard = ({ tenantId }: { tenantId?: string | null }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSpark, setLastSpark] = useState<string | null>(null);

  const trigger = (label: string, cb?: () => void) => {
    setLastSpark(label);
    toast({ title: label, description: `Opening ${label}` });
    if (cb) cb();
    setTimeout(() => setLastSpark(null), 900);
  };

  const subscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Call serverless function to store subscriber and send confirmation email
      const fnBase = ((import.meta as any).env.VITE_SUPABASE_FUNCTIONS_URL || '').trim() || '';
      const url = fnBase ? `${fnBase.replace(/\/$/, '')}/newsletter-subscribe` : '/newsletter-subscribe';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tenantId, plan: 'sanctum' }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Subscription failed: ${res.status} ${txt}`);
      }

      toast({ title: "Subscribed", description: "Thanks for subscribing to our newsletter." });
      setEmail("");
    } catch (err: any) {
      console.error("Subscribe error", err);
      // Fallback: try to write to audit_logs directly
      try {
        await supabase.from('audit_logs').insert([
          {
            action: 'newsletter_subscribe_fallback',
            created_at: new Date().toISOString(),
            ip_address: null,
            metadata: { email, tenantId },
            resource_id: null,
            resource_type: 'newsletter',
            user_id: null,
          }
        ]);
      } catch (e) {
        console.warn('Fallback audit log failed', e);
      }

      toast({ title: "Subscription failed", description: err.message || "Try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">Open Access Sanctum</h2>
        <p className="text-lg text-muted-foreground max-w-3xl">Free or minimal cost for educational, ethical access — Knowledge democratization for 1 billion+ minds</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Core Pillars</CardTitle>
            <CardDescription>Explore the foundational principles guiding our mission</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => trigger('Core Pillars', () => navigate('/'))}><span className="flex items-center justify-center gap-2 w-full">View Core Pillars{lastSpark === 'Core Pillars' && <span className="spark-anim"><Sparkles className="w-4 h-4 text-primary" /></span>}</span></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community Forum</CardTitle>
            <CardDescription>Join community discussions and peer learning</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => trigger('Community Forum', () => window.open('https://community.example.com', '_blank'))}><span className="flex items-center justify-center gap-2 w-full">Open Forum{lastSpark === 'Community Forum' && <span className="spark-anim"><Sparkles className="w-4 h-4 text-primary" /></span>}</span></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Educational Resources</CardTitle>
            <CardDescription>Access curated learning materials and toolkits</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => trigger('Resources', () => navigate('/'))}><span className="flex items-center justify-center gap-2 w-full">Browse Resources{lastSpark === 'Resources' && <span className="spark-anim"><Sparkles className="w-4 h-4 text-primary" /></span>}</span></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Ethical Frameworks</CardTitle>
            <CardDescription>Practical ethical design and governance templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => trigger('Ethical Frameworks', () => navigate('/'))}><span className="flex items-center justify-center gap-2 w-full">View Frameworks{lastSpark === 'Ethical Frameworks' && <span className="spark-anim"><Sparkles className="w-4 h-4 text-primary" /></span>}</span></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Monthly Newsletter</CardTitle>
            <CardDescription>Stay updated with curated insights and events</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={subscribeNewsletter} className="space-y-3">
              <input
                className="w-full rounded-md border px-3 py-2 bg-background"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" className="w-full" disabled={loading} onClick={() => setLastSpark('Subscribe')}>{loading ? 'Subscribing...' : 'Subscribe'}{lastSpark === 'Subscribe' && <span className="ml-2 spark-anim"><Sparkles className="w-4 h-4 text-primary" /></span>}</Button>
                <Button variant="outline" onClick={() => setEmail('')}>Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Observer Workspace</CardTitle>
            <CardDescription>Access your observer workspace and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/workspaces')}>Open Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpenAccessSanctumDashboard;
