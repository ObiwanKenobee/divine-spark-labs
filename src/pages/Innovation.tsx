import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Innovation = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Innovation Cloud</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">The operational heart for projects, data, and knowledge flows.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Project Dashboard</h3>
          <p className="text-sm text-muted-foreground">Plan, fund, and track initiatives end‑to‑end with transparent milestones.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">AI Knowledge Graph</h3>
          <p className="text-sm text-muted-foreground">Automatically links similar projects, resources, and opportunities.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Impact Tracker</h3>
          <p className="text-sm text-muted-foreground">Real‑time analytics of reach, social value, and ecological regeneration.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Resource Exchange</h3>
          <p className="text-sm text-muted-foreground">Share tools, datasets, and funding access across the ecosystem.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Innovation;
