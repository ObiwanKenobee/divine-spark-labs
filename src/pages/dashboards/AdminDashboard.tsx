import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings, BarChart3, Database, FileKey } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Admin Control Center
        </h2>
        <p className="text-xl text-muted-foreground">
          Manage organization, workspaces, and system administration
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate("/organizations")}>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Organizations</CardTitle>
            <CardDescription>Manage tenants & members</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Orgs
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate("/workspaces")}>
          <CardHeader>
            <Database className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Workspaces</CardTitle>
            <CardDescription>Workspace orchestration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Workspaces
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate("/admin")}>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">System Admin</CardTitle>
            <CardDescription>Advanced administration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Admin Panel
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Analytics</CardTitle>
            <CardDescription>Platform metrics & insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Metrics
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Settings className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Configuration</CardTitle>
            <CardDescription>System settings & policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <FileKey className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Audit Logs</CardTitle>
            <CardDescription>Security & compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
