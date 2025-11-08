import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Women = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Women’s Empowerment • Mary Initiative</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Female‑led innovation pathways, fellowships, and investment collaborations.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Mary Magdalene Path</h3>
          <p className="text-sm text-muted-foreground">Fellowships nurturing spiritual intelligence, leadership, and product courage.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Joanna Investment Collective</h3>
          <p className="text-sm text-muted-foreground">Women‑led capital syndicates backing regenerative ventures.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Innovation Map</h3>
          <p className="text-sm text-muted-foreground">A curated view of women pioneers and projects across regions.</p>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Personal Transformation Journaling</h2>
        <p className="text-sm text-muted-foreground">A reflective practice blending discernment prompts and project milestones. Entries can inform mentorship matching and wellbeing insights.</p>
      </section>
    </main>
    <Footer />
  </div>
);

export default Women;
