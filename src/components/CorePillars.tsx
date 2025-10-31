import { Card } from "@/components/ui/card";
import { BookOpen, Shield, Users, Leaf } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "Theology of Innovation",
    description: "Research how faith and creativity intersect.",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Ethical Technology",
    description: "Ensure AI, biotech, and design serve human dignity.",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Education & Mentorship",
    description: "Train innovators to build with conscience.",
    color: "text-accent",
  },
  {
    icon: Leaf,
    title: "Sacred Sustainability",
    description: "Align invention with stewardship of Earth.",
    color: "text-accent",
  },
];

const CorePillars = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Core Pillars
          </h2>
          <p className="text-lg text-muted-foreground">
            Four foundational principles guiding our mission to unite innovation with purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={index}
                className="group p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-accent/10 ${pillar.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
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

export default CorePillars;
