import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const IntergenerationalEngine = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Intergenerational Innovation Engine</h1>
          <p className="text-xl text-muted-foreground">The Family as a Civilization</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Families are factories of society—the fundamental unit of change.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">Family formation is the key to lasting social transformation.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Generational wealth and moral literacy for long-term flourishing.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Novena for a Happy and Faithful Marriage", "Holy Rosary"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Developing Frameworks For</h2>
          <div className="space-y-4">
            {[
              { title: "Youth Formation", desc: "Developing character and purpose in young people" },
              { title: "Fatherhood Restoration", desc: "Healing and empowering fathers" },
              { title: "Marriage Stability", desc: "Building lasting, fruitful partnerships" },
              { title: "Generational Wealth", desc: "Passing on both resources and values" },
              { title: "Moral Literacy", desc: "Teaching virtue and ethical reasoning" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Family Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Youth Leadership Academy", desc: "Character and purpose formation for young people" },
              { title: "Fatherhood Institute", desc: "Restoring the father's role and identity" },
              { title: "Marriage & Family Formation", desc: "Preparing couples for lifelong commitment" },
              { title: "Generational Mentor Program", desc: "Passing wisdom and values across generations" },
              { title: "Moral Literacy Curriculum", desc: "Teaching virtue and ethical living" }
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
            <li>• Family formation guide</li>
            <li>• Youth development curriculum</li>
            <li>• Marriage preparation materials</li>
            <li>• Generational wealth planning tools</li>
            <li>• Virtue education resources</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IntergenerationalEngine;
