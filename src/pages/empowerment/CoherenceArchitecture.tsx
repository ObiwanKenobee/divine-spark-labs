import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CoherenceArchitecture = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Coherence Architecture</h1>
          <p className="text-xl text-muted-foreground">Unity of Life</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Ethical, spiritual, and professional life must be ONE integrated whole.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Vision</h3>
            <p className="text-sm">No separation between the sacred and the secular—all of life is unified.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Integrated ethical leadership and authentic human flourishing.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["The Way", "Furrow", "The Forge"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Creating Programs That Unify</h2>
          <div className="space-y-4">
            {[
              { title: "Values + Leadership", desc: "Leadership rooted in core principles" },
              { title: "Faith + Innovation", desc: "Spiritual foundation for creative work" },
              { title: "Work + Purpose", desc: "Meaningful labor aligned with calling" },
              { title: "Family + Mission", desc: "Home as source and support of purpose" },
              { title: "Service + Ambition", desc: "Excellence pursued for the good of others" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Integration Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Unified Life Curriculum", desc: "Integrating all dimensions of human development" },
              { title: "Values-Based Leadership Certification", desc: "Leadership development with ethical depth" },
              { title: "Holistic Flourishing Workshops", desc: "Building coherence across life dimensions" }
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
            <li>• Unity of life reflection guide</li>
            <li>• Integrated values assessment</li>
            <li>• Coherence in decision-making framework</li>
            <li>• Authentic leadership development tools</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoherenceArchitecture;
