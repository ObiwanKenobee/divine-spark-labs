import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const PLAN_TO_ROLE: Record<string, "observer" | "fellow" | "project_lead" | "admin" | "owner"> = {
  sanctum: "observer",
  innovator: "fellow",
  institutional: "admin",
  civilization: "owner",
};

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  // Optional enterprise onboarding fields collected at signup
  const [enterpriseOnboard, setEnterpriseOnboard] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [billingContact, setBillingContact] = useState("");
  const [legalContact, setLegalContact] = useState("");
  const [slaTier, setSlaTier] = useState("");
  const [ssoRequested, setSsoRequested] = useState(false);

  const getPendingPlan = () => {
    const urlPlan = new URLSearchParams(window.location.search).get("plan");
    return urlPlan || localStorage.getItem("pendingPlan");
  };

  const clearPendingPlan = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("plan")) {
      params.delete("plan");
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    }
    localStorage.removeItem("pendingPlan");
  };

  const provisionForPlan = async (activeSession: Session, plan: string) => {
    const user = activeSession.user;
    const role = PLAN_TO_ROLE[plan];
    if (!role) return;

    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "member";
    const tenantName = `${displayName}'s ${plan} space`;
    const tenantSlug = slugify(`${displayName}-${plan}-${Date.now()}`);

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id, tenant_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let tenantId = existingProfile?.tenant_id || null;

    if (!tenantId) {
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: tenantName,
          slug: tenantSlug,
          created_by: user.id,
          billing_plan: plan,
        })
        .select("id")
        .single();
      if (tenantError) throw tenantError;
      tenantId = tenant.id;

      // Audit log: tenant created
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: tenantId,
          actor_id: user.id,
          action: 'tenant.created',
          meta: JSON.stringify({ plan }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to insert audit log for tenant creation', e);
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ user_id: user.id, tenant_id: tenantId, onboarding_completed: true })
        .eq("user_id", user.id);
      if (profileError) throw profileError;
    } else {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);
    }

    const workspaceName = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Workspace`;
    const workspaceSlug = slugify(`${plan}-${displayName}-${Date.now()}`);

    const { data: existingWs } = await supabase
      .from("workspaces")
      .select("id")
      .eq("tenant_id", tenantId as string)
      .limit(1);

    let workspaceId: string | null = null;
    if (existingWs && existingWs.length > 0) {
      workspaceId = existingWs[0].id;
    } else {
      const { data: ws, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          name: workspaceName,
          slug: workspaceSlug,
          tenant_id: tenantId as string,
          created_by: user.id,
          status: "active",
        })
        .select("id")
        .single();
      if (wsError) throw wsError;
      workspaceId = ws.id;

      // Audit log: workspace provisioned
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: tenantId,
          workspace_id: workspaceId,
          actor_id: user.id,
          action: 'workspace.provisioned',
          meta: JSON.stringify({ workspace: workspaceName }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to insert audit log for workspace provisioning', e);
      }
    }

    const { data: memberRows } = await supabase
      .from("workspace_members")
      .select("id, role")
      .eq("workspace_id", workspaceId as string)
      .eq("user_id", user.id)
      .limit(1);

    if (!memberRows || memberRows.length === 0) {
      const { error: addMemberErr } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: workspaceId as string, user_id: user.id, role });
      if (addMemberErr) throw addMemberErr;

      // Audit log: member added
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: tenantId,
          workspace_id: workspaceId,
          actor_id: user.id,
          action: 'workspace.member_added',
          meta: JSON.stringify({ role }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to insert audit log for member addition', e);
      }
    } else if (memberRows[0].role !== role) {
      await supabase
        .from("workspace_members")
        .update({ role })
        .eq("id", memberRows[0].id);

      try {
        await supabase.from('audit_logs').insert({
          tenant_id: tenantId,
          workspace_id: workspaceId,
          actor_id: user.id,
          action: 'workspace.member_role_updated',
          meta: JSON.stringify({ from: memberRows[0].role, to: role }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to insert audit log for member role update', e);
      }
    }

    clearPendingPlan();
  };

  useEffect(() => {
    // If redirected after payment, store status for UI
    try {
      const params = new URLSearchParams(window.location.search);
      const paid = params.get('paid') || params.get('status');
      if (paid) {
        const paidLabel = (paid === 'true' || paid === 'success' || paid === 'paid') ? 'success' : paid;
        localStorage.setItem('lastPaymentStatus', paidLabel);
      }
    } catch (e) {
      console.warn('Could not parse payment status from URL', e);
    }

    const handlePostAuth = async (activeSession: Session) => {
      const pendingPlan = getPendingPlan();
      if (pendingPlan) {
        try {
          await provisionForPlan(activeSession, pendingPlan);
          navigate("/dashboard");
          return;
        } catch (e: any) {
          toast({ title: "Setup error", description: e.message, variant: "destructive" });
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', activeSession.user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sess) => {
        setSession(sess);
        if (sess) {
          setTimeout(() => {
            handlePostAuth(sess);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setTimeout(() => {
          handlePostAuth(session);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      // If enterprise onboarding requested, create a request record so the ops team can follow up
      if (enterpriseOnboard) {
        try {
          await supabase.from('enterprise_onboarding_requests').insert({
            user_email: email,
            user_full_name: fullName,
            org_name: orgName || null,
            org_type: orgType || null,
            billing_contact: billingContact || null,
            legal_contact: legalContact || null,
            sla_tier: slaTier || null,
            sso_requested: ssoRequested || false,
            status: 'pending',
            created_at: new Date().toISOString()
          });

          // Audit log for enterprise request
          try {
            await supabase.from('audit_logs').insert({
              tenant_id: null,
              actor_id: null,
              action: 'enterprise_onboarding.requested',
              meta: JSON.stringify({ email, orgName, orgType, slaTier }),
              created_at: new Date().toISOString()
            });
          } catch (e) {
            console.warn('Failed to write audit log for enterprise request', e);
          }

          toast({
            title: 'Enterprise onboarding requested',
            description: 'Our team will reach out to you to complete onboarding and SSO setup.',
          });
        } catch (e: any) {
          console.warn('Failed to create enterprise onboarding request', e);
        }
      } else {
        toast({
          title: "Account created successfully!",
          description: "You can now sign in to access the platform.",
        });
      }

      setEmail("");
      setPassword("");
      setFullName("");
      setOrgName("");
      setOrgType("");
      setBillingContact("");
      setLegalContact("");
      setSlaTier("");
      setEnterpriseOnboard(false);
      setSsoRequested(false);
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            The Joseph-Marie Foundation
          </h1>
          <p className="text-muted-foreground">Intelligence Inspired by Heaven</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={enterpriseOnboard} onChange={(e) => setEnterpriseOnboard(e.target.checked)} />
                      <span className="text-sm">Request enterprise onboarding / SSO</span>
                    </label>
                  </div>

                  {enterpriseOnboard && (
                    <div className="space-y-3 p-3 bg-muted/50 rounded border border-border">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Example University" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgType">Organization Type</Label>
                        <Input id="orgType" value={orgType} onChange={(e) => setOrgType(e.target.value)} placeholder="Government / University / Faith Lab" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="billingContact">Billing Contact Email</Label>
                          <Input id="billingContact" value={billingContact} onChange={(e) => setBillingContact(e.target.value)} placeholder="billing@org.com" />
                        </div>
                        <div>
                          <Label htmlFor="legalContact">Legal Contact Email</Label>
                          <Input id="legalContact" value={legalContact} onChange={(e) => setLegalContact(e.target.value)} placeholder="legal@org.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slaTier">SLA Tier</Label>
                        <Input id="slaTier" value={slaTier} onChange={(e) => setSlaTier(e.target.value)} placeholder="Gold / Platinum / Enterprise" />
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={ssoRequested} onChange={(e) => setSsoRequested(e.target.checked)} />
                          <span className="text-sm">I want to set up SAML / OIDC SSO for my organization</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
