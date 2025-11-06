import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Microscope, TrendingUp, Database, Share2 } from "lucide-react";

export const ResearcherDashboard = () => {
  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Research Hub
        </h2>
        <p className="text-xl text-muted-foreground">
          Access your research projects, datasets, and collaborative studies
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Microscope className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Active Research</CardTitle>
            <CardDescription>Your ongoing research projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Projects
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Database className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Datasets</CardTitle>
            <CardDescription>Research data and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Browse Data
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Publications</CardTitle>
            <CardDescription>Your research papers & reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Papers
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Share2 className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Collaborations</CardTitle>
            <CardDescription>Team research & partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Teams
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Impact Metrics</CardTitle>
            <CardDescription>Research impact & citations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Knowledge Base</CardTitle>
            <CardDescription>Research library & resources</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Explore Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
