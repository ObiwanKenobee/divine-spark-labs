import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Faith = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Faith & Philosophy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Spiritual intelligence at the heart of humane innovation.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Theology of Innovation</h3>
          <p className="text-sm text-muted-foreground">Joseph & Mary as archetypes of courage, contemplation, and care.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Interdisciplinary Forum</h3>
          <p className="text-sm text-muted-foreground">Dialogue among scientists, ethicists, artists, and faith leaders.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Contemplation Tools</h3>
          <p className="text-sm text-muted-foreground">AI‑guided meditations and scripture‑linked reflections.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Faith;
