import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-divine-innovation.jpg";
import { useState } from "react";
import Modal from "@/components/Modal";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);
  const { toast } = useToast();

  const handleExplore = () => {
    // micro-interaction: small spark animation + toast + open modal
    setSparkKey((k) => k + 1);
    toast({ title: 'Mission Snapshot', description: 'We unite faith, science & innovation to build ethical technologies that serve human dignity.' });
    setOpen(true);
  };

  const handleLearnMore = () => {
    // gentle CTA micro-interaction
    toast({ title: 'Learn More', description: 'Explore our programs, research, and opportunities to collaborate.' });
    // Navigate or scroll to mission section if present
    const el = document.getElementById('mission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/85 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-3xl sm:max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Intelligence Inspired by Heaven</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            The Joseph-Marie Foundation for Divine Innovation
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Uniting faith, science, and innovation as a moral and spiritual pursuit — ensuring technology serves humanity's higher calling.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-3">
            <Button variant="divine" size="lg" className="group" onClick={handleExplore} aria-haspopup="dialog">
              Explore Our Mission
              <span key={sparkKey} className="ml-2 inline-block spark-anim">
                <Sparkles className="w-4 h-4 text-accent" />
              </span>
            </Button>
            <Button variant="hero" size="lg" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />

      <Modal open={open} onClose={() => setOpen(false)} title="Our Mission">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">The Joseph-Marie Foundation champions a sacred synthesis of faith and technology. We curate resources, research, and communities to build ethical AI and sustainable innovation.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Research & publications on moral design</li>
            <li>Educational curricula and toolkits</li>
            <li>Community forums for practitioners</li>
            <li>Fellowships, mentorships, and collaborative projects</li>
          </ul>
          <div className="flex gap-3 pt-3">
            <Button onClick={() => { window.location.href = '/pricing'; }}>Join a Tier</Button>
            <Button variant="outline" onClick={() => { setOpen(false); }}>Close</Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Hero;
