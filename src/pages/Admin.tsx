import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Users, Activity, Key, Building2, MessageSquare, Calendar, Handshake, Trash2, Pencil } from "lucide-react";

type ForumTopic = { id: string; title: string; content: string; user_id: string | null; created_at: string };
type EventItem = { id: string; title: string; description: string | null; date: string; location: string | null; user_id: string | null; created_at: string };
type Partnership = { id: string; name: string; sector: string; region: string; status: string | null; description: string | null; created_at: string };

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [forums, setForums] = useState<ForumTopic[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit dialogs
  const [editingForum, setEditingForum] = useState<ForumTopic | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!isAdmin) return;

      try {
        const [profilesRes, logsRes, orgsRes, subsRes, forumsRes, eventsRes, partnershipsRes] = await Promise.all([
          supabase.from('profiles').select('*, user_roles(role)'),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50),
          supabase.from('organizations').select('*, organization_members(count)'),
          supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(1000),
          supabase.from('forums').select('*').order('created_at', { ascending: false }).limit(200),
          supabase.from('events').select('*').order('date', { ascending: false }).limit(200),
          supabase.from('partnerships').select('*').order('created_at', { ascending: false }).limit(200),
        ]);

        setUsers(profilesRes.data || []);
        setAuditLogs(logsRes.data || []);
        setOrganizations(orgsRes.data || []);
        setSubscribers(subsRes.data || []);
        setForums(forumsRes.data || []);
        setEvents(eventsRes.data || []);
        setPartnerships(partnershipsRes.data || []);
      } catch (error: any) {
        toast({
          title: "Error loading admin data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Forum CRUD
  const deleteForum = async (id: string) => {
    const { error } = await supabase.from('forums').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setForums(prev => prev.filter(f => f.id !== id));
      toast({ title: "Deleted", description: "Forum topic deleted." });
    }
  };

  const updateForum = async () => {
    if (!editingForum) return;
    const { error } = await supabase.from('forums').update({ title: editingForum.title, content: editingForum.content }).eq('id', editingForum.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setForums(prev => prev.map(f => f.id === editingForum.id ? editingForum : f));
      setEditingForum(null);
      toast({ title: "Updated", description: "Forum topic updated." });
    }
  };

  // Event CRUD
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: "Deleted", description: "Event deleted." });
    }
  };

  const updateEvent = async () => {
    if (!editingEvent) return;
    const { error } = await supabase.from('events').update({ 
      title: editingEvent.title, 
      description: editingEvent.description,
      date: editingEvent.date,
      location: editingEvent.location
    }).eq('id', editingEvent.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? editingEvent : e));
      setEditingEvent(null);
      toast({ title: "Updated", description: "Event updated." });
    }
  };

  // Partnership CRUD
  const deletePartnership = async (id: string) => {
    const { error } = await supabase.from('partnerships').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPartnerships(prev => prev.filter(p => p.id !== id));
      toast({ title: "Deleted", description: "Partnership deleted." });
    }
  };

  const updatePartnership = async () => {
    if (!editingPartnership) return;
    const { error } = await supabase.from('partnerships').update({ 
      name: editingPartnership.name, 
      sector: editingPartnership.sector,
      region: editingPartnership.region,
      status: editingPartnership.status,
      description: editingPartnership.description
    }).eq('id', editingPartnership.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPartnerships(prev => prev.map(p => p.id === editingPartnership.id ? editingPartnership : p));
      setEditingPartnership(null);
      toast({ title: "Updated", description: "Partnership updated." });
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Forum Topics</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forums.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerships.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditLogs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forums" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          {/* Forums Tab */}
          <TabsContent value="forums" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Forum Topics Management</CardTitle>
                <CardDescription>Moderate and manage forum discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forums.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell className="font-medium">{topic.title}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">{topic.content}</TableCell>
                        <TableCell>{new Date(topic.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingForum(topic)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteForum(topic.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {forums.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No forum topics</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>Manage platform events and gatherings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.location || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingEvent(event)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {events.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No events</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partnerships Tab */}
          <TabsContent value="partnerships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Partnerships Management</CardTitle>
                <CardDescription>Manage partnership collaborations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerships.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.sector}</TableCell>
                        <TableCell>{p.region}</TableCell>
                        <TableCell><Badge variant="outline">{p.status || 'active'}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingPartnership(p)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deletePartnership(p.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {partnerships.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No partnerships</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell className="text-xs">{user.user_id?.substring(0, 12)}...</TableCell>
                        <TableCell>
                          {user.user_roles?.map((r: any) => (
                            <Badge key={r.role} variant="outline" className="mr-1">
                              {r.role}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>Manage all organizations and their members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.slug}</TableCell>
                        <TableCell>{org.organization_members?.[0]?.count || 0}</TableCell>
                        <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>View all system activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell><Badge>{log.action}</Badge></TableCell>
                        <TableCell>
                          {log.resource_type && <span className="text-sm text-muted-foreground">{log.resource_type}</span>}
                        </TableCell>
                        <TableCell className="text-sm">{log.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>Manage newsletter subscribers and exports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={async () => {
                    try {
                      const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
                      if (!data || data.length === 0) return;
                      const csvRows = [Object.keys(data[0]).join(',')];
                      data.forEach((row: any) => {
                        csvRows.push(Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
                      });
                      const csv = csvRows.join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'subscribers.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (e: any) {
                      toast({ title: 'Export failed', description: e.message, variant: 'destructive' });
                    }
                  }}>Export CSV</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.email}</TableCell>
                        <TableCell>{s.plan || '-'}</TableCell>
                        <TableCell>{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>{s.unsubscribed_at ? <Badge variant="secondary">Unsubscribed</Badge> : <Badge>Active</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Forum Dialog */}
      <Dialog open={!!editingForum} onOpenChange={() => setEditingForum(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Forum Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={editingForum?.title || ''} onChange={e => setEditingForum(prev => prev ? { ...prev, title: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea rows={4} value={editingForum?.content || ''} onChange={e => setEditingForum(prev => prev ? { ...prev, content: e.target.value } : null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingForum(null)}>Cancel</Button>
            <Button onClick={updateForum}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={editingEvent?.title || ''} onChange={e => setEditingEvent(prev => prev ? { ...prev, title: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input type="datetime-local" value={editingEvent?.date ? editingEvent.date.slice(0, 16) : ''} onChange={e => setEditingEvent(prev => prev ? { ...prev, date: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={editingEvent?.location || ''} onChange={e => setEditingEvent(prev => prev ? { ...prev, location: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea rows={3} value={editingEvent?.description || ''} onChange={e => setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>Cancel</Button>
            <Button onClick={updateEvent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Partnership Dialog */}
      <Dialog open={!!editingPartnership} onOpenChange={() => setEditingPartnership(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Partnership</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={editingPartnership?.name || ''} onChange={e => setEditingPartnership(prev => prev ? { ...prev, name: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Sector</label>
              <Input value={editingPartnership?.sector || ''} onChange={e => setEditingPartnership(prev => prev ? { ...prev, sector: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Region</label>
              <Input value={editingPartnership?.region || ''} onChange={e => setEditingPartnership(prev => prev ? { ...prev, region: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input value={editingPartnership?.status || ''} onChange={e => setEditingPartnership(prev => prev ? { ...prev, status: e.target.value } : null)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea rows={3} value={editingPartnership?.description || ''} onChange={e => setEditingPartnership(prev => prev ? { ...prev, description: e.target.value } : null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPartnership(null)}>Cancel</Button>
            <Button onClick={updatePartnership}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;