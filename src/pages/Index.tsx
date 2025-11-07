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
import Header from "@/components/Header";
import AIChat from "@/components/AIChat";
import ResearchAssistant from "@/components/ResearchAssistant";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
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
      <AIChat />
      <ResearchAssistant />
    </div>
  );
};

export default Index;
