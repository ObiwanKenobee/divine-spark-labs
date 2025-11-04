import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { BookOpen, Users, Lightbulb, Award, Shield, Building2, Key } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              The Joseph-Marie Foundation
            </h1>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Welcome to Your Dashboard
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Access your resources and continue your journey of divine innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">Resources</CardTitle>
              <CardDescription>Access research papers and materials</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                Browse Library
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">Community</CardTitle>
              <CardDescription>Connect with fellow innovators</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                Join Forums
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">Projects</CardTitle>
              <CardDescription>Your innovation projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                View Projects
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">Achievements</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                View Badges
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">Organizations</CardTitle>
              <CardDescription>Manage your teams</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" onClick={() => navigate("/organizations")}>
                View Organizations
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <Key className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="group-hover:text-primary transition-colors">API Access</CardTitle>
              <CardDescription>Integration keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                Manage Keys
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Begin your journey with these essential steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer hover:-translate-x-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your interests and innovation goals
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer hover:-translate-x-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Explore Our Core Pillars</h3>
                <p className="text-sm text-muted-foreground">
                  Dive into theology, ethics, education, and sustainability
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer hover:-translate-x-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Join a Community Project</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate with others on meaningful innovations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;