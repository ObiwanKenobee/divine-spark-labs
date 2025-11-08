import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Labs = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Age‑Group Innovation Labs</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Programs tailored to developmental stages with shared tools, forums, and wisdom companions.</p>
      </header>

      <section id="0-14" className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">0–14 • Foundation Learners</h2>
        <p className="text-sm text-muted-foreground">Gamified learning, storytelling, and creativity labs that kindle wonder and care.</p>
      </section>
      
      <section id="15-24" className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">15–24 • Emerging Innovators</h2>
        <p className="text-sm text-muted-foreground">Challenges, scholarships, hackathons, and peer communities to launch bold ideas.</p>
      </section>

      <section id="25-39" className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">25–39 • Builders</h2>
        <p className="text-sm text-muted-foreground">Startup accelerators, applied research, and an AI project manager for execution.</p>
      </section>

      <section id="40-59" className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">40–59 • Strategic Guardians</h2>
        <p className="text-sm text-muted-foreground">Governance labs, mentorship dashboards, and cross‑sector coordination.</p>
      </section>

      <section id="60-plus" className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">60+ • Sages</h2>
        <p className="text-sm text-muted-foreground">Digital heritage archives, storytelling podcasts, and active mentorship spaces.</p>
      </section>
    </main>
    <Footer />
  </div>
);

export default Labs;
