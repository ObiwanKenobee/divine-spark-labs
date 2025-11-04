import { ArrowRight, UserPlus, BookOpen, Rocket, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Join the Movement",
    description: "Create your account and choose the tier that matches your divine calling.",
  },
  {
    icon: BookOpen,
    title: "Access Resources",
    description: "Unlock research, frameworks, and tools designed for ethical innovation.",
  },
  {
    icon: Rocket,
    title: "Build & Innovate",
    description: "Create solutions that serve humanity with our support and global community.",
  },
  {
    icon: Award,
    title: "Track Your Impact",
    description: "Measure your Moral GDP and watch your innovations transform the world.",
  },
];

const Process = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Your Journey to Divine Innovation
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple, powerful path from inspiration to global impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="text-center space-y-4 group">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="p-4 rounded-xl bg-accent/10 text-accent inline-flex group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-accent/30">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
