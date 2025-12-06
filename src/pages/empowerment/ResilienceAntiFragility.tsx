import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ResilienceAntiFragility = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Resilience & Anti-Fragility Architecture</h1>
          <p className="text-xl text-muted-foreground">Sanctity in Suffering</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Suffering is not a curse, but raw material for greatness.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Reframes</h3>
            <p className="text-sm">Adversity becomes the forge of character and spiritual depth.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Anti-fragility and leadership endurance through adversity.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Blessed Be Pain", "Way of the Cross", "Stations of the Cross"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Turning Adversity Into</h2>
          <div className="space-y-4">
            {[
              { title: "Entrepreneurial Grit", desc: "Persistence and problem-solving through difficulty" },
              { title: "Community Resilience", desc: "Shared strength through mutual suffering" },
              { title: "Leadership Endurance", desc: "The capacity to lead through crisis" },
              { title: "Spiritual Renewal", desc: "Deepening faith and purpose through trial" },
              { title: "Social Healing Systems", desc: "Transforming pain into community care" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Resilience Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Anti-Fragility Leadership Academy", desc: "Building strength through adversity" },
              { title: "Community Healing Circles", desc: "Collective processing of suffering" },
              { title: "Grit & Purpose Coaching", desc: "Finding meaning in life's challenges" }
            ].map((program) => (
              <div key={program.title} className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{program.desc}</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <ul className="space-y-2 text-sm">
            <li>• Suffering and meaning guide</li>
            <li>• Resilience building practices</li>
            <li>• Crisis leadership frameworks</li>
            <li>• Post-trauma growth resources</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResilienceAntiFragility;
