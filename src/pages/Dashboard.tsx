import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Shield } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { ResearcherDashboard } from "./dashboards/ResearcherDashboard";
import { FellowDashboard } from "./dashboards/FellowDashboard";
import { DonorDashboard } from "./dashboards/DonorDashboard";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { InstitutionalDashboard } from "./dashboards/InstitutionalDashboard";
import { ObserverDashboard } from "./dashboards/ObserverDashboard";
import OpenAccessSanctumDashboard from "./dashboards/OpenAccessSanctumDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [tenantPlan, setTenantPlan] = useState<string | null>(null);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Fetch user's workspace role from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.tenant_id) {
        // get tenant billing plan
        try {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('billing_plan')
            .eq('id', profile.tenant_id)
            .maybeSingle();

          if (tenant && tenant.billing_plan) {
            setTenantPlan(tenant.billing_plan as string);
          }
        } catch (e) {
          console.warn('Failed to fetch tenant plan', e);
        }

        // Get user's highest workspace role
        const { data: workspaceData } = await supabase
          .from('workspace_members')
          .select('role, workspaces!inner(tenant_id)')
          .eq('user_id', session.user.id)
          .eq('workspaces.tenant_id', profile.tenant_id)
          .order('role', { ascending: true })
          .limit(1);

        if (workspaceData && workspaceData.length > 0) {
          setUserRole(workspaceData[0].role);
        }
      }

      setLoading(false);
    };

    fetchUserProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => {
          fetchUserProfile();
        }, 0);
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
        {isAdmin && <AdminDashboard />}
        {!isAdmin && tenantPlan === 'sanctum' && <OpenAccessSanctumDashboard />}
        {!isAdmin && userRole === 'owner' && <InstitutionalDashboard />}
        {!isAdmin && userRole === 'admin' && <InstitutionalDashboard />}
        {!isAdmin && userRole === 'lead' && <FellowDashboard />}
        {!isAdmin && userRole === 'fellow' && <FellowDashboard />}
        {!isAdmin && userRole === 'observer' && <ObserverDashboard />}
        {!isAdmin && !userRole && <ObserverDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
