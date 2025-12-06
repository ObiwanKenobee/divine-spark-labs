import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CompassionCare = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Compassion & Care Model</h1>
          <p className="text-xl text-muted-foreground">Marian Devotion</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Mary is the model of compassion, generosity, courage, and feminine genius.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Marian Qualities</h3>
            <p className="text-sm">Deep intelligence through pondering, humble strength, and radical care.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Women and family empowerment through dignity and support.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Holy Rosary", "Il Santo Rosario", "Points of Meditation about Our Lady", "Novena for a Happy and Faithful Marriage"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Marian Virtues Model</h2>
          <div className="space-y-4">
            {[
              { title: "Compassion", desc: "Radical care for the vulnerable and suffering" },
              { title: "Generosity", desc: "Open-handed giving and vulnerability" },
              { title: "Courage", desc: "Strength in faith despite uncertainty" },
              { title: "Feminine Genius", desc: "Unique gifts of the feminine in service" },
              { title: "Deep Intelligence", desc: "Wisdom through contemplation and pondering" }
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
              { title: "Motherhood Support Systems", desc: "Holistic care for mothers and families" },
              { title: "Marriage Strengthening", desc: "Forming couples for lasting love" },
              { title: "Women-Led Innovation Labs", desc: "Women as agents of change and creativity" },
              { title: "Intergenerational Care Programs", desc: "Building wisdom-passing relationships" },
              { title: "Trauma Healing Circles", desc: "Compassionate recovery and restoration" }
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
            <li>• Marian virtues meditation guide</li>
            <li>• Women leadership development curriculum</li>
            <li>• Family strengthening programs</li>
            <li>• Feminine wisdom reflection tools</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompassionCare;
