import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const IdentityWorth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Identity & Human Worth Engine</h1>
          <p className="text-xl text-muted-foreground">Divine Filiation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">You are a beloved child of God with infinite dignity.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">This divine identity becomes the root of confidence, ambition, and service.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Restored dignity and elevated self-perception.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Friends of God", "Christ is Passing By"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Builds Foundations For</h2>
          <div className="space-y-4">
            {[
              { title: "Restored Dignity", desc: "Recognition of inherent human worth" },
              { title: "Elevated Self-Perception", desc: "Seeing yourself through divine lens" },
              { title: "Mental Health Healing", desc: "Addressing shame and building confidence" },
              { title: "Empowerment Rooted in Identity", desc: "Action flowing from secure identity" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Identity Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Divine Filiation Foundation", desc: "Understanding your infinite worth and identity" },
              { title: "Confidence & Purpose Workshops", desc: "Building self-perception aligned with truth" },
              { title: "Community Dignity Programs", desc: "Collective lifting of human worth" }
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
            <li>• Divine filiation meditation guide</li>
            <li>• Identity affirmation practices</li>
            <li>• Self-worth assessment tools</li>
            <li>• Spiritual formation resources</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IdentityWorth;
