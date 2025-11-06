import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Lightbulb, Calendar, MessageSquare, Target } from "lucide-react";

export const FellowDashboard = () => {
  return (
    <>
      <div className="mb-12 animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Fellow Dashboard
        </h2>
        <p className="text-xl text-muted-foreground">
          Lead innovation projects and collaborate with the community
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Lightbulb className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Innovation Projects</CardTitle>
            <CardDescription>Lead and manage projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Projects
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Community Network</CardTitle>
            <CardDescription>Connect with innovators</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Join Network
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Award className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Achievements</CardTitle>
            <CardDescription>Track your impact & milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Badges
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Calendar className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Events & Webinars</CardTitle>
            <CardDescription>Workshops and training</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              View Calendar
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Mentorship</CardTitle>
            <CardDescription>Direct access to advisors</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Connect
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="group-hover:text-primary transition-colors">Goals & Roadmap</CardTitle>
            <CardDescription>Project planning & tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              Manage Goals
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
