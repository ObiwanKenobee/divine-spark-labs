import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, BarChart3, Heart, FileText, TrendingUp, Eye } from "lucide-react";

export const DonorDashboard = () => {
  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Impact Dashboard
        </h2>
        <p className="text-xl text-muted-foreground">
          Track your contributions and see the transformational impact
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <DollarSign className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Giving Portfolio</CardTitle>
            <CardDescription>Your contributions & allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Portfolio
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Impact Metrics</CardTitle>
            <CardDescription>Real-time impact measurement</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Impact
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Heart className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Funded Projects</CardTitle>
            <CardDescription>Projects you're supporting</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Projects
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Impact Reports</CardTitle>
            <CardDescription>Detailed progress updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Read Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Analytics</CardTitle>
            <CardDescription>Donation trends & insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Eye className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Transparency</CardTitle>
            <CardDescription>Fund allocation tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Breakdown
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
