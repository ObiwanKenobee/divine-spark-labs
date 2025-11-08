import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Learning = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Learning & Research Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Adaptive courses, open knowledge, and peer‑reviewed submissions.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Adaptive AI Courses</h3>
          <p className="text-sm text-muted-foreground">Innovation ethics, design for dignity, and regenerative thinking.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">AI + Ancestry Modules</h3>
          <p className="text-sm text-muted-foreground">Connecting ancient wisdom traditions to modern invention.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Open Research Library</h3>
          <p className="text-sm text-muted-foreground">Curated papers and datasets with community reviews.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Learning;
