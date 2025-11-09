import { Button } from "@/components/ui/button";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import PaymentSelector from "@/components/PaymentSelector";
const InquiryModal = React.lazy(() => import('@/components/InquiryModal'));

const Pricing = () => {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [sparkLast, setSparkLast] = useState<string>('');

  const plans = [
    {
      slug: "sanctum",
      name: "Open Access Sanctum",
      price: "$0 - $200",
      description: "Free or minimal cost for educational, ethical access",
      impact: "Knowledge democratization for 1 billion+ minds",
      features: [
        "Access to core pillars content",
        "Community forum access",
        "Educational resources",
        "Basic ethical frameworks",
        "Monthly newsletter",
        "Observer workspace access"
      ]
    },
    {
      slug: "innovator",
      name: "Innovator Tier",
      price: "$1,000 - $10,000",
      period: "/year",
      description: "For creators, researchers, and faith-aligned innovators",
      impact: "100,000+ innovators trained in moral design",
      features: [
        "All Sanctum features",
        "Premium research papers",
        "Innovation toolkit & frameworks",
        "Monthly webinars & workshops",
        "Direct mentorship access",
        "Faith-tech collaboration network",
        "Fellow workspace privileges",
        "Project lead capabilities"
      ],
      popular: true
    },
    {
      slug: "institutional",
      name: "Institutional Harmony",
      price: "$100K - $1M",
      period: "/deployment",
      description: "For governments, universities, faith tech labs",
      impact: "Institutional moral infrastructure across 50+ nations",
      features: [
        "All Innovator features",
        "Custom deployment solutions",
        "Multi-tenant organization licensing",
        "Dedicated technical support",
        "Governance framework integration",
        "White-label moral design tools",
        "Admin workspace management",
        "Dedicated enhanced authentication",
        "Enterprise SSO integration",
        "Compliance & audit logging"
      ]
    },
    {
      slug: "civilization",
      name: "Civilization Architect",
      price: "$2M - $200M+",
      description: "For nations or global coalitions building autonomous sanctums",
      impact: "Rebalance planetary systems — energy, ethics, economics",
      features: [
        "All Institutional features",
        "Global coalition partnership",
        "Autonomous sanctum development",
        "Planetary-scale impact frameworks",
        "24/7 dedicated civilization support",
        "Co-creation of moral infrastructure",
        "Owner-level workspace control",
        "Custom infrastructure deployment",
        "Strategic advisory board access"
      ],
      featured: true
    }
  ];

  const [inquiryPlan, setInquiryPlan] = useState<any | null>(null);

  const handleGetStarted = (plan: { slug: string }) => {
    // For institutional and civilization plans, open sales inquiry modal
    if (plan.slug === 'institutional' || plan.slug === 'civilization') {
      setInquiryPlan(plan);
      return;
    }

    const linkKey = `VITE_PAYMENT_LINK_${plan.slug.toUpperCase()}` as keyof ImportMetaEnv;
    const paymentLink = import.meta.env[linkKey as any] as string | undefined;

    localStorage.setItem("pendingPlan", plan.slug);

    if (paymentLink && paymentLink.startsWith("http")) {
      window.location.href = paymentLink;
      return;
    }

    navigate(`/auth?plan=${encodeURIComponent(plan.slug)}`);
  };

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
                (plan as any).popular ? 'border-primary shadow-elegant' : ''
              } ${(plan as any).featured ? 'border-secondary shadow-glow' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {(plan as any).popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              {(plan as any).featured && (
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
                  {(plan as any).period && <span className="text-muted-foreground text-sm">{(plan as any).period}</span>}
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-semibold text-primary mb-1">Expected Impact:</p>
                  <p className="text-sm">{plan.impact}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {(plan as any).features.map((feature: string, featureIndex: number) => (
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
                  variant={(plan as any).popular || (plan as any).featured ? "default" : "outline"}
                  onClick={() => {
                    setSparkLast(plan.slug);
                    setActivePlan(plan as any);
                    setTimeout(() => setSparkLast(''), 900);
                  }}
                >
                  <span className="flex items-center justify-center gap-2 w-full">
                    Get Started
                    {sparkLast === plan.slug && (
                      <span className="spark-anim inline-block">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </span>
                    )}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {activePlan && (
            <PaymentSelector plan={activePlan} onClose={() => setActivePlan(null)} />
          )}
          {inquiryPlan && (
            <React.Suspense fallback={null}>
              {/* Lazy load InquiryModal to keep bundle small */}
              <InquiryModal plan={inquiryPlan} onClose={() => setInquiryPlan(null)} />
            </React.Suspense>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
