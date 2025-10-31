import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import CorePillars from "@/components/CorePillars";
import Applications from "@/components/Applications";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Mission />
      <CorePillars />
      <Applications />
      <Footer />
    </main>
  );
};

export default Index;
