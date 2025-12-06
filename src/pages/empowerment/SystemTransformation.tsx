import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SystemTransformation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Transforming Systems from Within</h1>
          <p className="text-xl text-muted-foreground">Love for the World</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">The world is not an obstacle—it's the terrain where transformation happens.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá's Innovation</h3>
            <p className="text-sm">A theological revolution: embrace the world as the place of sanctification.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Institutional transformation and ethical systemic change.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Passionately Loving the World"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Develops Systems For</h2>
          <div className="space-y-4">
            {[
              { title: "Ethical Entrepreneurship", desc: "Business as force for good and human dignity" },
              { title: "Industry-Wide Transformation", desc: "Systemic change in how work is conducted" },
              { title: "Public Leadership Training", desc: "Leaders with integrity and vision" },
              { title: "Ethical AI & Tech Governance", desc: "Technology aligned with human flourishing" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF System Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Ethics in Business Accelerator", desc: "Ethical entrepreneurship and social enterprise" },
              { title: "Public Leadership Institute", desc: "Training leaders for institutional transformation" },
              { title: "AI Governance Council", desc: "Ethical frameworks for emerging technology" }
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
            <li>• Ethical business frameworks</li>
            <li>• Systemic change methodologies</li>
            <li>• Public leadership competencies</li>
            <li>• Technology ethics guidelines</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SystemTransformation;
