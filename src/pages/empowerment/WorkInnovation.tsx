import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WorkInnovation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Work-as-Innovation Doctrine</h1>
          <p className="text-xl text-muted-foreground">Vocation of Daily Work</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Holiness is found in ordinary work, done extraordinarily well.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">Every human activity becomes a pathway to sanctity and excellence.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Economic empowerment through dignified, innovative labor.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["The Way", "Furrow", "The Forge", "Friends of God", "Passionately Loving the World", "Christ is Passing By"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Work Becomes</h2>
          <div className="space-y-4">
            {[
              { title: "Source of Dignity", desc: "Work restores and affirms human worth" },
              { title: "Platform for Innovation", desc: "Ordinary work becomes extraordinary through excellence" },
              { title: "Training Ground for Excellence", desc: "Mastery and skill development" },
              { title: "Generator of Economic Uplift", desc: "Sustainable prosperity and self-sufficiency" },
              { title: "Spiritual Act of Service", desc: "Work as offering and contribution to the world" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Empowerment Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "JMF Work Innovation Labs", desc: "Craft → Tech → Entrepreneurship pathways" },
              { title: "The Forge Accelerator", desc: "Talent → Mastery → Purpose development" },
              { title: "Workplace Sanctity Skills", desc: "Discipline, attention, and stewardship training" }
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
            <li>• Work innovation curriculum materials</li>
            <li>• Case studies of workplace transformation</li>
            <li>• Excellence in ordinary work guide</li>
            <li>• Spiritual approach to professional development</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WorkInnovation;
