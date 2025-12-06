import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuietIntelligence = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Quiet Intelligence & Strategic Thinking</h1>
          <p className="text-xl text-muted-foreground">Contemplation in Action</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Deep reflection precedes effective action.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">Contemplation is not escape from the world—it's the source of wise action.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Strategic clarity and value-based leadership.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Christ is Passing By", "Conversations"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Building Habits Of</h2>
          <div className="space-y-4">
            {[
              { title: "Deep Work", desc: "Focused, uninterrupted time for meaningful thinking" },
              { title: "Silent Strategic Thinking", desc: "Reflection away from distraction" },
              { title: "Value-Based Decision Processes", desc: "Choices rooted in core principles" },
              { title: "Contemplative Leadership", desc: "Leadership flowing from spiritual depth" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Contemplation Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Contemplative Leadership Workshops", desc: "Integrating reflection and action" },
              { title: "Strategic Thinking Retreats", desc: "Deep work on organizational strategy" },
              { title: "Daily Practice Curriculum", desc: "Building contemplation into everyday life" }
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
            <li>• Contemplative prayer practices</li>
            <li>• Strategic thinking frameworks</li>
            <li>• Deep work scheduling guide</li>
            <li>• Leadership reflection journals</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuietIntelligence;
