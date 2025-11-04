import Hero from "@/components/Hero";
import TrustLogos from "@/components/TrustLogos";
import Benefits from "@/components/Benefits";
import CorePillars from "@/components/CorePillars";
import Applications from "@/components/Applications";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import LossAversion from "@/components/LossAversion";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground font-bold text-xl">JMF</div>
            <div className="flex gap-4">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/enterprise")}>
                Enterprise
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/pricing")}>
                Pricing
              </Button>
              <Button variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
      <Hero />
      <TrustLogos />
      <Benefits />
      <CorePillars />
      <Applications />
      <Process />
      <Testimonials />
      <LossAversion />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
