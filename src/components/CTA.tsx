import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Free access to get started",
  "Join 100,000+ global innovators",
  "Ethical AI frameworks & tools",
  "Measure your Moral GDP impact",
];

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-primary/95 to-primary relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Transform Innovation Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Ready to Build Technology That Serves Humanity?
          </h2>

          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Join the global movement uniting faith, science, and innovation. Start your journey of divine innovation in less than 60 seconds.
          </p>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-primary-foreground/90"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              variant="divine"
              size="lg"
              onClick={() => navigate("/auth")}
              className="group text-lg px-8 py-6 bg-accent hover:bg-accent/90"
            >
              Start Free Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pricing")}
              className="text-lg px-8 py-6 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              View Pricing Tiers
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/70 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
