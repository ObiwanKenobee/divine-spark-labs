import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import CorePillars from "@/components/CorePillars";
import Applications from "@/components/Applications";
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
            <div className="text-white font-bold text-xl">JMF</div>
            <div className="flex gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/pricing")}>
                Pricing
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
      <Hero />
      <Mission />
      <CorePillars />
      <Applications />
      <Footer />
    </div>
  );
};

export default Index;
