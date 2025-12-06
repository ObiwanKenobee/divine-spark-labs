import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Building2, UserCircle, CheckCircle2, Sparkles } from "lucide-react";

type OnboardingStep = 1 | 2 | 3 | 4;

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Step 1: Tenant/Organization
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [dataResidency, setDataResidency] = useState("global");

  // Step 2: Role Selection
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Step 3: Consents
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [dataProcessingAccepted, setDataProcessingAccepted] = useState(false);

  // Step 4: Workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [dataClassification, setDataClassification] = useState<"public" | "restricted" | "sacred">("restricted");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);

    // Check if already onboarded
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, onboarding_step")
      .eq("user_id", user.id)
      .single();

    if (profile?.onboarding_completed) {
      navigate("/dashboard");
      return;
    }

    if (profile?.onboarding_step) {
      setCurrentStep(profile.onboarding_step as OnboardingStep);
    }
  };

  const saveProgress = async (step: number) => {
    await supabase
      .from("profiles")
      .update({ onboarding_step: step })
      .eq("user_id", user?.id);
  };

  const handleStep1 = async () => {
    if (!tenantName || !tenantSlug) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: tenantName,
          slug: tenantSlug,
          data_residency: dataResidency,
          created_by: user.id
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Add user as tenant member
      await supabase.from("tenant_members").insert({
        tenant_id: tenant.id,
        user_id: user.id,
        role: "owner"
      });

      // Audit log: tenant created via onboarding
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: tenant.id,
          actor_id: user.id,
          action: 'tenant.created.via_onboarding',
          meta: JSON.stringify({ tenantName, dataResidency }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to write audit log for tenant creation in onboarding', e);
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({ tenant_id: tenant.id })
        .eq("user_id", user.id);

      await saveProgress(2);
      setCurrentStep(2);

      toast({
        title: "Organization Created",
        description: "Your organization has been set up successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select your role",
        variant: "destructive"
      });
      return;
    }

    await saveProgress(3);
    setCurrentStep(3);
  };

  const handleStep3 = async () => {
    if (!termsAccepted || !privacyAccepted || !dataProcessingAccepted) {
      toast({
        title: "Consent Required",
        description: "Please accept all required consents to continue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      // Record consents
      const consentsToInsert = [
        { 
          user_id: user.id,
          tenant_id: profile?.tenant_id,
          consent_type: "terms_of_service" as const,
          consent_version: "1.0",
          consent_text: "I accept the Terms of Service",
          accepted: true,
          accepted_at: new Date().toISOString()
        },
        {
          user_id: user.id,
          tenant_id: profile?.tenant_id,
          consent_type: "privacy_policy" as const,
          consent_version: "1.0",
          consent_text: "I accept the Privacy Policy",
          accepted: true,
          accepted_at: new Date().toISOString()
        },
        {
          user_id: user.id,
          tenant_id: profile?.tenant_id,
          consent_type: "data_processing" as const,
          consent_version: "1.0",
          consent_text: "I consent to data processing",
          accepted: true,
          accepted_at: new Date().toISOString()
        }
      ];

      await supabase.from("onboarding_consents").insert(consentsToInsert);

      await saveProgress(4);
      setCurrentStep(4);
      
      toast({
        title: "Consents Recorded",
        description: "Your consent preferences have been saved"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStep4 = async () => {
    if (!workspaceName) {
      toast({
        title: "Workspace Name Required",
        description: "Please provide a workspace name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!profile?.tenant_id) {
        throw new Error("No tenant found");
      }

      // Create workspace directly
      const workspaceSlug = workspaceName.toLowerCase().replace(/\s+/g, '-');
      const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          tenant_id: profile.tenant_id,
          name: workspaceName,
          slug: workspaceSlug,
          description: workspaceDescription,
          data_classification: dataClassification,
          created_by: user.id,
          status: "active"
        })
        .select("id")
        .single();

      if (wsError) throw wsError;

      // Audit log: workspace provisioned via onboarding
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: profile?.tenant_id,
          workspace_id: workspace?.id || null,
          actor_id: user.id,
          action: 'workspace.provisioned.via_onboarding',
          meta: JSON.stringify({ name: workspaceName }),
          created_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Failed to write audit log for workspace provisioning in onboarding', e);
      }

      // Mark onboarding as complete
      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          onboarding_step: 4
        })
        .eq("user_id", user.id);

      toast({
        title: "Welcome Aboard!",
        description: "Your workspace has been provisioned successfully"
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Organization", icon: Building2 },
    { number: 2, title: "Role", icon: UserCircle },
    { number: 3, title: "Consents", icon: Shield },
    { number: 4, title: "Workspace", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Joseph-Marie Foundation</h1>
          <p className="text-muted-foreground">Let's set up your divine innovation workspace</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isComplete = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isComplete ? "bg-primary text-primary-foreground" :
                  isActive ? "bg-accent text-accent-foreground ring-2 ring-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {isComplete ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="tenantName">Organization Name *</Label>
                <Input
                  id="tenantName"
                  value={tenantName}
                  onChange={(e) => {
                    setTenantName(e.target.value);
                    setTenantSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="Aeon Nexus Initiative"
                />
              </div>
              <div>
                <Label htmlFor="tenantSlug">Organization Slug *</Label>
                <Input
                  id="tenantSlug"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  placeholder="aeon-nexus"
                />
              </div>
              <div>
                <Label htmlFor="dataResidency">Data Residency</Label>
                <Select value={dataResidency} onValueChange={setDataResidency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleStep1} disabled={loading} className="w-full">
                Continue
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <Label>Select Your Role *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {["fellow", "researcher", "project_lead", "observer"].map((role) => (
                    <Card
                      key={role}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedRole === role ? "ring-2 ring-primary bg-accent/50" : "hover:bg-accent/20"
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <h3 className="font-semibold capitalize">{role.replace('_', ' ')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role === "fellow" && "Core member with full access"}
                        {role === "researcher" && "Research and development focus"}
                        {role === "project_lead" && "Lead projects and teams"}
                        {role === "observer" && "View-only access"}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
              <Button onClick={handleStep2} disabled={loading} className="w-full">
                Continue
              </Button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I accept the Terms of Service *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      By using this platform, you agree to our terms and conditions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={privacyAccepted}
                    onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="privacy" className="cursor-pointer">
                      I accept the Privacy Policy *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      We protect your data with enterprise-grade security
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataProcessing"
                    checked={dataProcessingAccepted}
                    onCheckedChange={(checked) => setDataProcessingAccepted(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="dataProcessing" className="cursor-pointer">
                      I consent to data processing *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to process your data to provide our services
                    </p>
                  </div>
                </div>
              </div>
              <Button onClick={handleStep3} disabled={loading} className="w-full">
                Continue
              </Button>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div>
                <Label htmlFor="workspaceName">Workspace Name *</Label>
                <Input
                  id="workspaceName"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Divine Innovation Lab"
                />
              </div>
              <div>
                <Label htmlFor="workspaceDescription">Description</Label>
                <Textarea
                  id="workspaceDescription"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  placeholder="Describe your workspace purpose..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="dataClassification">Data Classification</Label>
                <Select value={dataClassification} onValueChange={(val) => setDataClassification(val as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Open access</SelectItem>
                    <SelectItem value="restricted">Restricted - Team only</SelectItem>
                    <SelectItem value="sacred">Sacred - Highest security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleStep4} disabled={loading} className="w-full">
                {loading ? "Provisioning Workspace..." : "Complete Setup"}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
