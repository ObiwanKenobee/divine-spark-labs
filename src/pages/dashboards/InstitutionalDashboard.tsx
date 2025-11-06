import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Shield, Users, FileText, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InstitutionalDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Institutional Command Center
        </h2>
        <p className="text-xl text-muted-foreground">
          Enterprise-grade tools for institutional transformation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate("/organizations")}>
          <CardHeader>
            <Building2 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Organization</CardTitle>
            <CardDescription>Multi-tenant management</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Org
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate("/workspaces")}>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Workspaces</CardTitle>
            <CardDescription>Project orchestration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Workspaces
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Team Management</CardTitle>
            <CardDescription>Role-based access control</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Teams
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Global Deployment</CardTitle>
            <CardDescription>Multi-region orchestration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Deployment
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Security & Compliance</CardTitle>
            <CardDescription>Enterprise governance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Security
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Reports & Analytics</CardTitle>
            <CardDescription>Institutional metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
