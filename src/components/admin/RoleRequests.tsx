import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/admin/AdminTableControls";
import { Search, X, Check, XCircle, Clock, RefreshCw, Send } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleRequest {
  id: string;
  user_id: string;
  requested_role: string;
  reason: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

const AVAILABLE_ROLES: AppRole[] = ["admin", "member", "viewer"];

export const RoleRequestsAdmin = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; request: RoleRequest | null; action: "approve" | "reject" }>({ 
    open: false, 
    request: null, 
    action: "approve" 
  });
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from("role_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch user profiles for names
      const userIds = [...new Set(requestsData?.map((r) => r.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profilesMap = new Map(
        profilesData?.map((p) => [p.user_id, { name: p.full_name, email: p.email }]) || []
      );

      const enrichedRequests: RoleRequest[] = (requestsData || []).map((r) => ({
        ...r,
        user_name: profilesMap.get(r.user_id)?.name || "Unknown",
        user_email: profilesMap.get(r.user_id)?.email || "",
      }));

      setRequests(enrichedRequests);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requested_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const pagination = usePagination({ data: filteredRequests, itemsPerPage: 10 });

  const handleReview = async () => {
    if (!reviewDialog.request) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newStatus = reviewDialog.action === "approve" ? "approved" : "rejected";

      // Update the request status
      const { error: updateError } = await supabase
        .from("role_requests")
        .update({
          status: newStatus,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null,
        })
        .eq("id", reviewDialog.request.id);

      if (updateError) throw updateError;

      // If approved, assign the role
      if (reviewDialog.action === "approve") {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: reviewDialog.request.user_id,
            role: reviewDialog.request.requested_role as AppRole,
          });

        if (roleError && !roleError.message.includes("duplicate")) {
          throw roleError;
        }

        // Log the approval
        await supabase.from("audit_logs").insert({
          action: "role_request_approved",
          resource_type: "role_request",
          resource_id: reviewDialog.request.id,
          metadata: {
            target_user_id: reviewDialog.request.user_id,
            role: reviewDialog.request.requested_role,
          },
        });
      } else {
        // Log the rejection
        await supabase.from("audit_logs").insert({
          action: "role_request_rejected",
          resource_type: "role_request",
          resource_id: reviewDialog.request.id,
          metadata: {
            target_user_id: reviewDialog.request.user_id,
            role: reviewDialog.request.requested_role,
            reason: reviewNotes,
          },
        });
      }

      toast({
        title: reviewDialog.action === "approve" ? "Request Approved" : "Request Rejected",
        description: `The role request has been ${newStatus}.`,
      });

      setReviewDialog({ open: false, request: null, action: "approve" });
      setReviewNotes("");
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error processing request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Role Requests
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingCount} pending</Badge>
              )}
            </CardTitle>
            <CardDescription>Review and approve user role requests</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
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
              placeholder="Search requests..."
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredRequests.length} of {requests.length}
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
                    <TableHead>User</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No role requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagination.paginatedData.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{req.user_name}</span>
                            <span className="text-xs text-muted-foreground">{req.user_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {req.requested_role.charAt(0).toUpperCase() + req.requested_role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={req.reason}>
                          {req.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(req.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {req.status === "pending" ? (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => setReviewDialog({ open: true, request: req, action: "approve" })}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setReviewDialog({ open: true, request: req, action: "reject" })}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {req.reviewed_at && format(new Date(req.reviewed_at), "MMM d")}
                            </span>
                          )}
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
              totalItems={filteredRequests.length}
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

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => !open && setReviewDialog({ open: false, request: null, action: "approve" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === "approve" ? "Approve" : "Reject"} Role Request
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.action === "approve"
                ? `Approve ${reviewDialog.request?.user_name}'s request for the ${reviewDialog.request?.requested_role} role?`
                : `Reject ${reviewDialog.request?.user_name}'s request for the ${reviewDialog.request?.requested_role} role?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">User's Reason</label>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {reviewDialog.request?.reason}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Review Notes {reviewDialog.action === "reject" && "(recommended)"}
              </label>
              <Textarea
                placeholder={
                  reviewDialog.action === "approve"
                    ? "Optional notes..."
                    : "Explain why the request was rejected..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog({ open: false, request: null, action: "approve" })}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={isSubmitting}
              variant={reviewDialog.action === "approve" ? "default" : "destructive"}
            >
              {isSubmitting
                ? "Processing..."
                : reviewDialog.action === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// User-facing component for requesting roles
export const RoleRequestForm = () => {
  const { toast } = useToast();
  const [myRequests, setMyRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>("member");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myCurrentRoles, setMyCurrentRoles] = useState<string[]>([]);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [requestsRes, rolesRes] = await Promise.all([
        supabase
          .from("role_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);

      if (requestsRes.error) throw requestsRes.error;
      setMyRequests(requestsRes.data || []);
      setMyCurrentRoles(rolesRes.data?.map((r) => r.role) || []);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const availableRoles = AVAILABLE_ROLES.filter(
    (role) =>
      !myCurrentRoles.includes(role) &&
      !myRequests.some((r) => r.requested_role === role && r.status === "pending")
  );

  const submitRequest = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for your request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("role_requests").insert({
        user_id: user.id,
        requested_role: selectedRole,
        reason: reason.trim(),
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your role request has been submitted for review.",
      });

      setShowForm(false);
      setReason("");
      fetchMyRequests();
    } catch (error: any) {
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <CardTitle>Role Requests</CardTitle>
            <CardDescription>Request additional roles or view your request history</CardDescription>
          </div>
          {availableRoles.length > 0 && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Send className="h-4 w-4 mr-2" />
              Request Role
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">New Role Request</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Role</label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Why do you need this role?</label>
                <Textarea
                  placeholder="Explain why you need this role and how you plan to use it..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={submitRequest} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {myRequests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            You haven't made any role requests yet.
          </p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">
                      {req.requested_role.charAt(0).toUpperCase() + req.requested_role.slice(1)}
                    </Badge>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{req.reason}</p>
                  {req.review_notes && req.status === "rejected" && (
                    <p className="text-sm text-red-600 mt-1">Reason: {req.review_notes}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(req.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        )}

        {myCurrentRoles.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Your Current Roles</h4>
            <div className="flex gap-2">
              {myCurrentRoles.map((role) => (
                <Badge key={role} variant="default">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
