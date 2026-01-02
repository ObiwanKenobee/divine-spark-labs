import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Permission = 'full' | 'limited' | 'none';

interface PermissionItem {
  feature: string;
  category: string;
  admin: Permission;
  member: Permission;
  viewer: Permission;
}

const permissions: PermissionItem[] = [
  // User Management
  { feature: 'View all users', category: 'User Management', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'Assign/remove roles', category: 'User Management', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'Process role requests', category: 'User Management', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'View role audit logs', category: 'User Management', admin: 'full', member: 'none', viewer: 'none' },
  
  // Content Management
  { feature: 'Create content', category: 'Content Management', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Edit own content', category: 'Content Management', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Edit all content', category: 'Content Management', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'Delete content', category: 'Content Management', admin: 'full', member: 'limited', viewer: 'none' },
  { feature: 'View content', category: 'Content Management', admin: 'full', member: 'full', viewer: 'full' },
  
  // Organizations & Workspaces
  { feature: 'Create organizations', category: 'Organizations', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Manage all organizations', category: 'Organizations', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'Create workspaces', category: 'Organizations', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Manage workspace members', category: 'Organizations', admin: 'full', member: 'limited', viewer: 'none' },
  
  // Events & Programs
  { feature: 'Create events', category: 'Events & Programs', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Manage all events', category: 'Events & Programs', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'Join programs', category: 'Events & Programs', admin: 'full', member: 'full', viewer: 'full' },
  { feature: 'Manage programs', category: 'Events & Programs', admin: 'full', member: 'none', viewer: 'none' },
  
  // Forums & Community
  { feature: 'Create forum topics', category: 'Community', admin: 'full', member: 'full', viewer: 'none' },
  { feature: 'Moderate forums', category: 'Community', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'View partnerships', category: 'Community', admin: 'full', member: 'full', viewer: 'full' },
  { feature: 'Create partnerships', category: 'Community', admin: 'full', member: 'full', viewer: 'none' },
  
  // Research & Fellowships
  { feature: 'Access research assistant', category: 'Research', admin: 'full', member: 'full', viewer: 'limited' },
  { feature: 'Apply for fellowships', category: 'Research', admin: 'full', member: 'full', viewer: 'full' },
  { feature: 'Manage fellowships', category: 'Research', admin: 'full', member: 'none', viewer: 'none' },
  
  // System & Admin
  { feature: 'Access admin dashboard', category: 'System', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'View audit logs', category: 'System', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'System configuration', category: 'System', admin: 'full', member: 'none', viewer: 'none' },
  { feature: 'View analytics', category: 'System', admin: 'full', member: 'limited', viewer: 'none' },
];

const PermissionIcon = ({ permission }: { permission: Permission }) => {
  switch (permission) {
    case 'full':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'limited':
      return <Minus className="h-4 w-4 text-amber-500" />;
    case 'none':
      return <X className="h-4 w-4 text-muted-foreground/40" />;
  }
};

const PermissionBadge = ({ permission }: { permission: Permission }) => {
  switch (permission) {
    case 'full':
      return <Badge variant="default" className="bg-green-600">Full Access</Badge>;
    case 'limited':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700">Limited</Badge>;
    case 'none':
      return <Badge variant="outline" className="text-muted-foreground">No Access</Badge>;
  }
};

export const RolePermissionsMatrix = () => {
  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions Matrix</CardTitle>
        <CardDescription>
          Overview of what each role can access across the application
        </CardDescription>
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Full Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">Limited Access</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">No Access</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Feature</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Member</TableHead>
                <TableHead className="text-center">Viewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <>
                  <TableRow key={category} className="bg-muted/30">
                    <TableCell colSpan={4} className="font-semibold text-primary">
                      {category}
                    </TableCell>
                  </TableRow>
                  {permissions
                    .filter((p) => p.category === category)
                    .map((perm) => (
                      <TableRow key={perm.feature}>
                        <TableCell className="pl-6">{perm.feature}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <PermissionIcon permission={perm.admin} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <PermissionIcon permission={perm.member} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <PermissionIcon permission={perm.viewer} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
