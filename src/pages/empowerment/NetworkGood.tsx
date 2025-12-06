import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NetworkGood = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <Button variant="ghost" onClick={() => navigate("/empowerment")} className="mb-6">
            ← Back to Framework
          </Button>
          <h1 className="text-5xl font-bold mb-4">Network-of-Good Architecture</h1>
          <p className="text-xl text-muted-foreground">Apostolate of Friendship</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Core Principle</h3>
            <p className="text-sm">Real change happens through personal connection and friendship.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">Escrivá Teaching</h3>
            <p className="text-sm">Apostolate is fundamentally relational—person to person, heart to heart.</p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-2">JMF Outcome</h3>
            <p className="text-sm">Community empowerment through social capital and networks.</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Conversations", "Furrow", "The Way of the Cross"].map((source) => (
              <div key={source} className="bg-card border rounded-lg p-4">
                <p className="font-semibold">{source}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Designs Around</h2>
          <div className="space-y-4">
            {[
              { title: "Community-Driven Innovation", desc: "Collective problem-solving through relationship" },
              { title: "Social Capital Building", desc: "Strengthening networks of trust and mutual aid" },
              { title: "Mentorship Chains", desc: "Passing on wisdom and opportunity through personal connection" },
              { title: "Leadership Circles", desc: "Development through peer accountability and support" },
              { title: "Family-Centered Empowerment", desc: "Family as the foundational unit of social change" }
            ].map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">JMF Network Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "JMF Friendship & Influence Networks", desc: "Structured but organic networks of mutual support" },
              { title: "Circle Mentorship Grids", desc: "Peer mentorship and leadership development" },
              { title: "Regional Apostolate Leaders", desc: "Community leaders trained in relational change" }
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
            <li>• Building relational networks guide</li>
            <li>• Circle formation protocols</li>
            <li>• Mentorship curriculum</li>
            <li>• Community impact measurement tools</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkGood;
