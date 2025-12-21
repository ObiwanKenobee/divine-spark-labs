import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/admin/AdminTableControls";
import { Search, X, Shield, Plus, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type UserRole = { id: string; user_id: string; role: AppRole; created_at: string };
type UserWithRoles = {
  id: string;
  user_id: string;
  full_name: string | null;
  created_at: string;
  user_roles: UserRole[];
};

const AVAILABLE_ROLES: AppRole[] = ["admin", "member", "viewer"];

export const RoleManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Dialog states
  const [addRoleDialog, setAddRoleDialog] = useState<{ open: boolean; user: UserWithRoles | null }>({ open: false, user: null });
  const [removeRoleDialog, setRemoveRoleDialog] = useState<{ open: boolean; userId: string; roleId: string; roleName: string; userName: string } | null>(null);
  const [bulkRoleDialog, setBulkRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>("member");
  const [bulkSelectedRole, setBulkSelectedRole] = useState<AppRole>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async () => {
    try {
      // Fetch profiles and roles separately since there's no direct FK relation
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, user_id, full_name, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("id, user_id, role, created_at"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const roles = rolesRes.data || [];
      const usersWithRoles: UserWithRoles[] = (profilesRes.data || []).map((profile) => ({
        ...profile,
        user_roles: roles.filter((r) => r.user_id === profile.user_id) as UserRole[],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole =
        roleFilter === "all" ||
        user.user_roles.some((r) => r.role === roleFilter);
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const pagination = usePagination({ data: filteredUsers });

  // Audit logging helper
  const logRoleChange = async (action: string, targetUserId: string, role: string) => {
    try {
      await supabase.from("audit_logs").insert({
        action,
        resource_type: "user_role",
        resource_id: targetUserId,
        metadata: { role, target_user_id: targetUserId },
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  };

  const addRole = async () => {
    if (!addRoleDialog.user) return;
    
    // Check if user already has this role
    if (addRoleDialog.user.user_roles.some((r) => r.role === selectedRole)) {
      toast({
        title: "Role exists",
        description: "User already has this role.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: addRoleDialog.user.user_id, role: selectedRole })
        .select()
        .single();

      if (error) throw error;

      // Log the role assignment
      await logRoleChange("role_assigned", addRoleDialog.user.user_id, selectedRole);

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === addRoleDialog.user!.user_id
            ? { ...u, user_roles: [...u.user_roles, data as UserRole] }
            : u
        )
      );

      toast({ title: "Role added", description: `${selectedRole} role assigned successfully.` });
      setAddRoleDialog({ open: false, user: null });
    } catch (error: any) {
      toast({
        title: "Error adding role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const bulkAssignRole = async () => {
    if (selectedUsers.size === 0) return;
    
    setIsSubmitting(true);
    const userIds = Array.from(selectedUsers);
    let successCount = 0;
    let skipCount = 0;

    try {
      for (const userId of userIds) {
        const user = users.find((u) => u.user_id === userId);
        if (!user) continue;
        
        // Skip if user already has this role
        if (user.user_roles.some((r) => r.role === bulkSelectedRole)) {
          skipCount++;
          continue;
        }

        const { data, error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: bulkSelectedRole })
          .select()
          .single();

        if (!error && data) {
          await logRoleChange("role_assigned_bulk", userId, bulkSelectedRole);
          
          setUsers((prev) =>
            prev.map((u) =>
              u.user_id === userId
                ? { ...u, user_roles: [...u.user_roles, data as UserRole] }
                : u
            )
          );
          successCount++;
        }
      }

      toast({
        title: "Bulk assignment complete",
        description: `${successCount} roles assigned${skipCount > 0 ? `, ${skipCount} skipped (already had role)` : ""}.`,
      });
      setBulkRoleDialog(false);
      setSelectedUsers(new Set());
    } catch (error: any) {
      toast({
        title: "Error in bulk assignment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRemoveRole = async () => {
    if (!removeRoleDialog) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", removeRoleDialog.roleId);

      if (error) throw error;

      // Log the role removal
      await logRoleChange("role_removed", removeRoleDialog.userId, removeRoleDialog.roleName);

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === removeRoleDialog.userId
            ? { ...u, user_roles: u.user_roles.filter((r) => r.id !== removeRoleDialog.roleId) }
            : u
        )
      );

      toast({ title: "Role removed", description: `${removeRoleDialog.roleName} role removed successfully.` });
      setRemoveRoleDialog(null);
    } catch (error: any) {
      toast({
        title: "Error removing role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const selectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(pagination.paginatedData.map((u) => u.user_id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const getAvailableRolesForUser = (user: UserWithRoles): AppRole[] => {
    const existingRoles = user.user_roles.map((r) => r.role);
    return AVAILABLE_ROLES.filter((role) => !existingRoles.includes(role));
  };

  const getRoleBadgeVariant = (role: AppRole): "default" | "secondary" | "outline" => {
    switch (role) {
      case "admin":
        return "default";
      case "member":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">Loading role management...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Management
          </CardTitle>
          <CardDescription>Assign or remove user roles to control access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredUsers.length} of {users.length}
            </span>
            {selectedUsers.size > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setBulkRoleDialog(true)}
              >
                <Users className="h-4 w-4 mr-1" />
                Bulk Assign ({selectedUsers.size})
              </Button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={pagination.paginatedData.length > 0 && pagination.paginatedData.every((u) => selectedUsers.has(u.user_id))}
                    onCheckedChange={selectAllUsers}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Current Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedData.map((user) => (
                <TableRow key={user.id} className={selectedUsers.has(user.user_id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.user_id)}
                      onCheckedChange={() => toggleUserSelection(user.user_id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                  <TableCell className="text-xs font-mono">{user.user_id.substring(0, 12)}...</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.user_roles.length > 0 ? (
                        user.user_roles.map((r) => (
                          <Badge
                            key={r.id}
                            variant={getRoleBadgeVariant(r.role)}
                            className="flex items-center gap-1"
                          >
                            {r.role}
                            <button
                              onClick={() => setRemoveRoleDialog({ 
                                open: true, 
                                userId: user.user_id, 
                                roleId: r.id, 
                                roleName: r.role,
                                userName: user.full_name || "this user"
                              })}
                              className="ml-1 hover:text-destructive"
                              title="Remove role"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const available = getAvailableRolesForUser(user);
                        if (available.length > 0) {
                          setSelectedRole(available[0]);
                        }
                        setAddRoleDialog({ open: true, user });
                      }}
                      disabled={getAvailableRolesForUser(user).length === 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pagination.paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={filteredUsers.length}
            onPageChange={pagination.setCurrentPage}
            onItemsPerPageChange={pagination.setItemsPerPage}
            goToFirstPage={pagination.goToFirstPage}
            goToLastPage={pagination.goToLastPage}
            goToNextPage={pagination.goToNextPage}
            goToPrevPage={pagination.goToPrevPage}
          />
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialog.open} onOpenChange={(open) => setAddRoleDialog({ open, user: open ? addRoleDialog.user : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              Assign a new role to {addRoleDialog.user?.full_name || "this user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Role</label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {addRoleDialog.user &&
                    getAvailableRolesForUser(addRoleDialog.user).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Role descriptions:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Admin:</strong> Full access to all features and admin panel</li>
                <li><strong>Member:</strong> Standard access to platform features</li>
                <li><strong>Viewer:</strong> Read-only access to content</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={addRole} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Role Confirmation Dialog */}
      <AlertDialog open={!!removeRoleDialog} onOpenChange={(open) => !open && setRemoveRoleDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the <strong>{removeRoleDialog?.roleName}</strong> role from <strong>{removeRoleDialog?.userName}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveRole} 
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Removing..." : "Remove Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Role Assignment Dialog */}
      <Dialog open={bulkRoleDialog} onOpenChange={setBulkRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Role Assignment</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUsers.size} selected user{selectedUsers.size !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Role to Assign</label>
              <Select value={bulkSelectedRole} onValueChange={(v) => setBulkSelectedRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Users who already have this role will be skipped.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={bulkAssignRole} disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : `Assign to ${selectedUsers.size} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
