import { Card } from "@/components/ui/card";
import { Lightbulb, Building2, Users2, Compass } from "lucide-react";

const applications = [
  {
    icon: Lightbulb,
    title: "Christian Think Tank",
    description: "Leading research on innovation ethics through the lens of faith.",
  },
  {
    icon: Building2,
    title: "Innovation Labs",
    description: "Funding faith-inspired laboratories where science meets spirituality.",
  },
  {
    icon: Users2,
    title: "Global Movement",
    description: "Linking divine inspiration to modern problem-solving worldwide.",
  },
  {
    icon: Compass,
    title: "Spiritual Framework",
    description: "Showing that progress can be sacred through projects like Harambee Net and EquiNexus.",
  },
];

const Applications = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Possible Applications
          </h2>
          <p className="text-lg text-muted-foreground">
            Envisioning how divine innovation transforms society.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {applications.map((app, index) => {
            const Icon = app.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-border bg-card group"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="p-4 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {app.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Applications;
