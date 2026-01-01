import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, History, UserPlus, UserMinus, Clock } from "lucide-react";
import { format } from "date-fns";

interface RoleHistoryEntry {
  id: string;
  action: string;
  resource_type: string | null;
  metadata: {
    role?: string;
    target_user_id?: string;
    expires_at?: string;
    reason?: string;
  } | null;
  created_at: string;
}

interface CurrentRole {
  role: string;
  expires_at: string | null;
  created_at: string;
}

export const UserRoleHistory = () => {
  const { toast } = useToast();
  const [history, setHistory] = useState<RoleHistoryEntry[]>([]);
  const [currentRoles, setCurrentRoles] = useState<CurrentRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch current roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role, expires_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (rolesError) throw rolesError;
      setCurrentRoles(rolesData || []);

      // Fetch role-related audit logs for this user
      const { data: logsData, error: logsError } = await supabase
        .from("audit_logs")
        .select("*")
        .or(`metadata->target_user_id.eq.${user.id},user_id.eq.${user.id}`)
        .in("action", [
          "role_assigned",
          "role_removed",
          "bulk_role_assigned",
          "role_request_approved",
          "role_request_rejected"
        ])
        .order("created_at", { ascending: false })
        .limit(50);

      if (logsError) throw logsError;
      
      // Map the data to the expected type
      const mappedHistory: RoleHistoryEntry[] = (logsData || []).map((log) => ({
        id: log.id,
        action: log.action,
        resource_type: log.resource_type,
        metadata: log.metadata as RoleHistoryEntry["metadata"],
        created_at: log.created_at,
      }));
      
      setHistory(mappedHistory);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error loading role history",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "role_assigned":
      case "bulk_role_assigned":
      case "role_request_approved":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "role_removed":
        return <UserMinus className="h-4 w-4 text-red-600" />;
      case "role_request_rejected":
        return <UserMinus className="h-4 w-4 text-amber-600" />;
      default:
        return <History className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionText = (entry: RoleHistoryEntry) => {
    const role = entry.metadata?.role || "Unknown";
    switch (entry.action) {
      case "role_assigned":
      case "bulk_role_assigned":
        return `${role} role was assigned to you`;
      case "role_removed":
        return `${role} role was removed`;
      case "role_request_approved":
        return `Your request for ${role} role was approved`;
      case "role_request_rejected":
        return `Your request for ${role} role was rejected`;
      default:
        return entry.action;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "role_assigned":
      case "bulk_role_assigned":
      case "role_request_approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Assigned</Badge>;
      case "role_removed":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Removed</Badge>;
      case "role_request_rejected":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Role History
            </CardTitle>
            <CardDescription>View your past role assignments and changes</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Roles Section */}
        {currentRoles.length > 0 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Current Roles</h4>
            <div className="flex flex-wrap gap-2">
              {currentRoles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Badge variant="default">
                    {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                  </Badge>
                  {role.expires_at && (
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires {format(new Date(role.expires_at), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No role change history found.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{getActionText(entry)}</span>
                    {getActionBadge(entry.action)}
                  </div>
                  {entry.metadata?.expires_at && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expired/Expires: {format(new Date(entry.metadata.expires_at), "MMM d, yyyy")}
                    </p>
                  )}
                  {entry.metadata?.reason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Reason: {entry.metadata.reason}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(entry.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
