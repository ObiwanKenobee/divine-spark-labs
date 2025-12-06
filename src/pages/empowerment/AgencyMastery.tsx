import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AgencyMastery = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Agency & Self-Mastery Framework</h1>
          <p className="text-xl text-muted-foreground">Interior Freedom</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Interior freedom is the ability to choose the good despite pressure.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">True freedom comes from aligning your will with truth and goodness.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Mental resilience and decision-making confidence.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Friends of God", "Furrow", "The Forge", "Conversations"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">People Gain</h2>
          <div className="space-y-4">
            {[
              { title: "Emotional Strength", desc: "Resilience in face of adversity" },
              { title: "Decision-Making Confidence", desc: "Clarity in choosing aligned with values" },
              { title: "Consistency", desc: "Coherence between beliefs and actions" },
              { title: "Resilience", desc: "Bouncing back from setbacks" },
              { title: "Moral Clarity", desc: "Clear ethical framework for life choices" }
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
              { title: "JMF Self-Mastery Curriculum", desc: "Deep work on interior freedom and agency" },
              { title: "Resilience & Inner Fortitude Workshops", desc: "Building emotional strength and character" },
              { title: "Character Formation Certificates", desc: "Structured programs in moral and personal development" }
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
            <li>• Interior freedom principles guide</li>
            <li>• Self-mastery daily practices</li>
            <li>• Decision-making frameworks</li>
            <li>• Character development assessments</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AgencyMastery;
