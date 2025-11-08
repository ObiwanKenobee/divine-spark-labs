import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Crown, Users, Settings, ServerCog, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CivilizationDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
          Civilization Architect Command
        </h2>
        <p className="text-xl text-muted-foreground">
          Planetary-scale tools for coalition governance and autonomous sanctum deployment
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate('/organizations')}>
          <CardHeader>
            <Crown className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Coalition</CardTitle>
            <CardDescription>Global coalition partnership</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full">
              Manage Coalition
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate('/workspaces')}>
          <CardHeader>
            <Users className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Sanctum Workspaces</CardTitle>
            <CardDescription>Autonomous sanctum development</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full">
              View Sanctums
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Globe className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Planetary Frameworks</CardTitle>
            <CardDescription>Impact frameworks for energy, ethics, economics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full">
              View Frameworks
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <ServerCog className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Infrastructure</CardTitle>
            <CardDescription>Custom infrastructure deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Provision Infrastructure
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <LifeBuoy className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Support</CardTitle>
            <CardDescription>24/7 dedicated civilization support</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Settings className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-secondary transition-colors">Governance</CardTitle>
            <CardDescription>Strategic advisory and governance tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Governance
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
