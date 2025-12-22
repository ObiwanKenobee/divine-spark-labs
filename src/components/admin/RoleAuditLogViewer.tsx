import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, X, RefreshCw, UserPlus, UserMinus, Users } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/admin/AdminTableControls";
import { format } from "date-fns";

interface RoleAuditLog {
  id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  user_id: string | null;
  metadata: {
    target_user_id?: string;
    target_user_name?: string;
    target_user_email?: string;
    role?: string;
    assigned_by?: string;
    assigned_by_name?: string;
    bulk_count?: number;
  } | null;
  created_at: string;
}

export function RoleAuditLogViewer() {
  const [logs, setLogs] = useState<RoleAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .in("action", ["role_assigned", "role_removed", "bulk_role_assigned"])
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs((data as RoleAuditLog[]) || []);
    } catch (error) {
      console.error("Error fetching role audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const roles = useMemo(() => {
    const roleSet = new Set<string>();
    logs.forEach((log) => {
      if (log.metadata?.role) {
        roleSet.add(log.metadata.role);
      }
    });
    return Array.from(roleSet);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search === "" ||
        log.metadata?.target_user_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.metadata?.target_user_email?.toLowerCase().includes(search.toLowerCase()) ||
        log.metadata?.assigned_by_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.metadata?.role?.toLowerCase().includes(search.toLowerCase());

      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesRole = roleFilter === "all" || log.metadata?.role === roleFilter;

      return matchesSearch && matchesAction && matchesRole;
    });
  }, [logs, search, actionFilter, roleFilter]);

  const pagination = usePagination({ data: filteredLogs, itemsPerPage: 20 });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "role_assigned":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <UserPlus className="h-3 w-3 mr-1" />
            Assigned
          </Badge>
        );
      case "role_removed":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <UserMinus className="h-3 w-3 mr-1" />
            Removed
          </Badge>
        );
      case "bulk_role_assigned":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Users className="h-3 w-3 mr-1" />
            Bulk Assigned
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getRoleBadge = (role: string | undefined) => {
    if (!role) return null;
    const colors: Record<string, string> = {
      admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      member: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      viewer: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };
    return (
      <Badge className={colors[role] || "bg-gray-500/10 text-gray-600 border-gray-500/20"}>
        {role}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Role Change History</CardTitle>
            <CardDescription>View all role assignments and removals</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or admin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearch("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="role_assigned">Assigned</SelectItem>
              <SelectItem value="role_removed">Removed</SelectItem>
              <SelectItem value="bulk_role_assigned">Bulk Assigned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredLogs.length} of {logs.length} entries
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No role change logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagination.paginatedData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>{getRoleBadge(log.metadata?.role)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {log.metadata?.target_user_name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {log.metadata?.target_user_email || log.metadata?.target_user_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {log.metadata?.assigned_by_name || log.metadata?.assigned_by || "System"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.action === "bulk_role_assigned" && log.metadata?.bulk_count
                            ? `${log.metadata.bulk_count} users affected`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={filteredLogs.length}
              onPageChange={pagination.setCurrentPage}
              onItemsPerPageChange={pagination.setItemsPerPage}
              goToFirstPage={pagination.goToFirstPage}
              goToLastPage={pagination.goToLastPage}
              goToNextPage={pagination.goToNextPage}
              goToPrevPage={pagination.goToPrevPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
