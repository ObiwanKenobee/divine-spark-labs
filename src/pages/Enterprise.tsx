import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Building2, Shield, Globe, Users, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Enterprise = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Building2,
      title: "Institutional Deployment",
      description: "Custom solutions for governments, universities, and faith tech labs",
      benefits: ["Multi-tenant architecture", "Custom branding", "Dedicated infrastructure"]
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Planetary-scale impact frameworks for nation-level implementation",
      benefits: ["50+ nation deployment", "Multi-language support", "Regulatory compliance"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade security and compliance frameworks",
      benefits: ["SOC 2 Type II certified", "End-to-end encryption", "Audit logging"]
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 civilization support team and strategic advisors",
      benefits: ["Dedicated account manager", "Custom SLA", "Priority response"]
    }
  ];

  const useCases = [
    {
      title: "Government Transformation",
      description: "Build autonomous sanctums for ethical governance systems",
      impact: "Nation-wide moral infrastructure"
    },
    {
      title: "University Integration",
      description: "Faith-aligned innovation labs and research frameworks",
      impact: "100,000+ trained innovators"
    },
    {
      title: "Global Coalitions",
      description: "Multi-nation collaboration on planetary challenges",
      impact: "Rebalance energy, ethics, economics"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Enterprise Solutions
              </h1>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate("/pricing")}>
                Pricing
              </Button>
              {user ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/auth")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Transform Institutions at Scale
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Enterprise-grade infrastructure for governments, universities, and global coalitions 
              building the future of faith-aligned innovation
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="group">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
                View Pricing
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "50+", label: "Nations Ready" },
              { value: "1B+", label: "Potential Impact" },
              { value: "100K+", label: "Trained Innovators" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <Card key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">{stat.value}</CardTitle>
                  <CardDescription className="text-base">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Capabilities</h3>
            <p className="text-xl text-muted-foreground">
              Built for scale, security, and civilization-level impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Use Cases</h3>
            <p className="text-xl text-muted-foreground">
              Real-world applications of divine innovation at scale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-1">Expected Impact:</p>
                    <p className="text-sm">{useCase.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workspace Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Enterprise Workspace</h3>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools for organizational transformation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Command Center", description: "Real-time monitoring and analytics" },
              { icon: Users, title: "Team Management", description: "Role-based access control" },
              { icon: Globe, title: "Global Deployment", description: "Multi-region orchestration" }
            ].map((tool, index) => (
              <Card 
                key={index}
                className="text-center transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => user ? navigate("/dashboard") : navigate("/auth")}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <tool.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => user ? navigate("/dashboard") : navigate("/auth")}>
              {user ? "Access Workspace" : "Sign Up for Access"}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Institution?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join governments, universities, and global coalitions building the future of ethical innovation
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
              View Enterprise Pricing
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Enterprise;
