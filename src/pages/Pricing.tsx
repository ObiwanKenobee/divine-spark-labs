import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Open Access Sanctum",
      price: "$0 - $100",
      description: "Free or minimal cost for educational, ethical access",
      impact: "Knowledge democratization for 1 billion+ minds",
      features: [
        "Access to core pillars content",
        "Community forum access",
        "Educational resources",
        "Basic ethical frameworks",
        "Monthly newsletter"
      ]
    },
    {
      name: "Innovator Tier",
      price: "$500 - $5,000",
      period: "/year",
      description: "For creators, researchers, and faith-aligned innovators",
      impact: "100,000+ innovators trained in moral design",
      features: [
        "All Sanctum features",
        "Premium research papers",
        "Innovation toolkit & frameworks",
        "Monthly webinars & workshops",
        "Direct mentorship access",
        "Faith-tech collaboration network"
      ],
      popular: true
    },
    {
      name: "Institutional Harmony",
      price: "$50K - $500K",
      period: "/deployment",
      description: "For governments, universities, faith tech labs",
      impact: "Institutional moral infrastructure across 50+ nations",
      features: [
        "All Innovator features",
        "Custom deployment solutions",
        "Organization-wide licensing",
        "Dedicated technical support",
        "Governance framework integration",
        "White-label moral design tools"
      ]
    },
    {
      name: "Civilization Architect",
      price: "$1M - $100M+",
      description: "For nations or global coalitions building autonomous sanctums",
      impact: "Rebalance planetary systems — energy, ethics, economics",
      features: [
        "All Institutional features",
        "Global coalition partnership",
        "Autonomous sanctum development",
        "Planetary-scale impact frameworks",
        "24/7 dedicated civilization support",
        "Co-creation of moral infrastructure"
      ],
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              The Joseph-Marie Foundation
            </h1>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Moral GDP — The Gross Divine Potential
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your tier to transform faith, science, and innovation into planetary-scale impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in ${
                plan.popular ? 'border-primary shadow-elegant' : ''
              } ${plan.featured ? 'border-secondary shadow-glow' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Ultimate Impact
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[3rem]">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-semibold text-primary mb-1">Expected Impact:</p>
                  <p className="text-sm">{plan.impact}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full transition-all duration-300 hover:scale-105" 
                  variant={plan.popular || plan.featured ? "default" : "outline"}
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;