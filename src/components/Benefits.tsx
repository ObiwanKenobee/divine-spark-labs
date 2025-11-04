import { Card } from "@/components/ui/card";
import { Zap, Shield, Users, TrendingUp, Heart, Globe } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Accelerate Divine Innovation",
    description: "Transform ideas into reality 10x faster with faith-inspired frameworks and cutting-edge tools.",
  },
  {
    icon: Shield,
    title: "Ethical AI Governance",
    description: "Build with confidence knowing your innovations align with moral principles and human dignity.",
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Join 100,000+ innovators, researchers, and faith leaders reshaping technology's future.",
  },
  {
    icon: TrendingUp,
    title: "Measurable Impact",
    description: "Track your Moral GDP contributions and see your innovations serve humanity's higher calling.",
  },
  {
    icon: Heart,
    title: "Purpose-Driven Mission",
    description: "Every innovation serves a greater purpose—connecting technology with spiritual values.",
  },
  {
    icon: Globe,
    title: "Worldwide Influence",
    description: "Be part of a movement reshaping 50+ nations with ethical technology infrastructure.",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in fade-in duration-1000">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Why Choose Divine Innovation?
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlock unprecedented value when faith, science, and innovation converge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
