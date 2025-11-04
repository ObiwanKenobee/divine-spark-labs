import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const risks = [
  {
    icon: TrendingDown,
    title: "Falling Behind the Innovation Curve",
    description: "While you wait, 100,000+ innovators are already building the future with ethical AI frameworks.",
  },
  {
    icon: Clock,
    title: "Missing the Divine Innovation Movement",
    description: "50+ nations are already implementing moral technology infrastructure. Don't let your organization be left behind.",
  },
  {
    icon: Users,
    title: "Losing Competitive Advantage",
    description: "Early adopters are gaining 10-year advantages in ethical innovation. Every day of delay increases the gap.",
  },
];

const LossAversion = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-destructive/5 to-background border-y border-destructive/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 backdrop-blur-sm mb-4">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Don't Get Left Behind</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            The Cost of Waiting
          </h2>
          <p className="text-lg text-muted-foreground">
            While innovation accelerates globally, inaction becomes increasingly expensive.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {risks.map((risk, index) => {
            const Icon = risk.icon;
            return (
              <Card
                key={index}
                className="p-6 border-destructive/20 bg-card hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-destructive/10 text-destructive">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {risk.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {risk.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border-2 border-accent/30 shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join the Movement Today
            </h3>
            <p className="text-muted-foreground mb-6">
              Start with our Open Access Sanctum tier—free access to transform your approach to innovation. Upgrade anytime as your divine calling grows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="divine"
                size="lg"
                onClick={() => navigate("/auth")}
                className="group"
              >
                Get Started Free
                <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/pricing")}
              >
                View All Tiers
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Access in 60 seconds • Join 100,000+ innovators
          </p>
        </div>
      </div>
    </section>
  );
};

export default LossAversion;
