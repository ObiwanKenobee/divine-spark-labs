import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Briefcase, LogOut, Shield, Clock, Database } from "lucide-react";

export default function Workspaces() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  
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

    // Get user's tenant
    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single();

    if (profile?.tenant_id) {
      setTenantId(profile.tenant_id);
      fetchWorkspaces(user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchWorkspaces = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select(`
          *,
          workspace_members!inner(role)
        `)
        .eq("workspace_members.user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkspaces(data || []);
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

  const createWorkspace = async () => {
    if (!workspaceName) {
      toast({
        title: "Name Required",
        description: "Please enter a workspace name",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("provision-workspace", {
        body: {
          tenantId: tenantId,
          name: workspaceName,
          slug: workspaceName.toLowerCase().replace(/\s+/g, '-'),
          description: workspaceDescription,
          dataClassification: dataClassification
        }
      });

      if (error) throw error;

      toast({
        title: "Workspace Created",
        description: "Your workspace has been provisioned successfully"
      });

      setDialogOpen(false);
      setWorkspaceName("");
      setWorkspaceDescription("");
      setDataClassification("restricted");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchWorkspaces(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading workspaces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Your Workspaces</h2>
            <p className="text-muted-foreground">Manage and access your divine innovation spaces</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Set up a new workspace for your projects and team collaboration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Divine Innovation Lab"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    placeholder="Describe your workspace purpose..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="classification">Data Classification</Label>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createWorkspace} disabled={creating}>
                  {creating ? "Creating..." : "Create Workspace"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workspace.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  workspace.status === 'provisioning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                }`}>
                  {workspace.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{workspace.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {workspace.description || "No description"}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{workspace.data_classification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span>{workspace.resource_quota?.storage_gb || 100} GB Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Created {new Date(workspace.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                Open Workspace
              </Button>
            </Card>
          ))}

          {workspaces.length === 0 && (
            <Card className="p-8 col-span-full text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Workspaces Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first workspace to start building divine innovations
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
