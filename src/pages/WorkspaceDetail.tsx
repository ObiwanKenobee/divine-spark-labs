import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Database, Users, Clock } from 'lucide-react';

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchWorkspace();
    fetchLogs();
  }, [id]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('workspaces').select('*').eq('id', id).maybeSingle();
      setWorkspace(data || null);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await supabase.from('audit_logs').select('*').eq('workspace_id', id).order('created_at', { ascending: false }).limit(50);
      setAuditLogs(data || []);
    } catch (e) {
      console.debug('Failed to fetch audit logs', e);
    }
  };

  const provisionInfra = async () => {
    if (!workspace) return;
    try {
      const { error } = await supabase.functions.invoke('deploy-infrastructure', { body: { workspaceId: workspace.id } });
      if (error) throw error;
      toast({ title: 'Deployment started', description: 'Infrastructure provisioning has been triggered.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading workspace...</p></div>;
  if (!workspace) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Workspace not found</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/workspaces')}>Back to Workspaces</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-sm text-muted-foreground mb-4">{workspace.description || 'No description'}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> <span>{workspace.data_classification}</span></div>
              <div className="flex items-center gap-2"><Database className="w-4 h-4" /> <span>{workspace.resource_quota?.storage_gb || 100} GB storage</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>Created {new Date(workspace.created_at).toLocaleString()}</span></div>
            </div>

            <div className="mt-4 space-y-2">
              <Button onClick={provisionInfra}>Provision Infrastructure</Button>
              <Button variant="outline" onClick={() => navigate(`/workspaces/${workspace.id}/sso`)}>Manage SSO</Button>
              <Button variant="ghost" onClick={() => navigate(`/workspaces/${workspace.id}/members`)}>Manage Members</Button>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* placeholder: fetch members */}
                <div className="p-3 border rounded">Owner: {workspace.created_by}</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auditLogs.length === 0 && <p className="text-sm text-muted-foreground">No logs found</p>}
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2 border rounded bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-xs text-muted-foreground">{log.meta}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
