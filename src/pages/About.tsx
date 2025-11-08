import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">About • The Foundation Story</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">A living movement at the intersection of faith, science, and humane technology.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">The Joseph‑Marie Narrative</h2>
          <p className="text-sm text-muted-foreground">We draw from the creative courage of Joseph and the contemplative wisdom of Mary to shape technologies that protect dignity, elevate conscience, and regenerate the world. Our narrative unites invention with interior life: building systems that listen, learn, and heal.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Founders & Leadership</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><span className="font-medium text-foreground">Executive Steward:</span> guides mission fidelity and cross‑disciplinary synthesis.</li>
            <li><span className="font-medium text-foreground">Chief Ethicist:</span> leads moral risk reviews and human‑centered design standards.</li>
            <li><span className="font-medium text-foreground">Director of Labs:</span> orchestrates age‑group innovation programs across regions.</li>
            <li><span className="font-medium text-foreground">Mentorship Chair:</span> mobilizes global mentor networks and wisdom exchanges.</li>
          </ul>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Timeline • From Vision → Impact</h2>
        <ol className="relative border-l pl-6 space-y-6">
          <li>
            <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
            <div className="text-sm"><span className="font-medium">Inception:</span> discernment frameworks for ethical AI and governance.</div>
          </li>
          <li>
            <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
            <div className="text-sm"><span className="font-medium">Programs:</span> pilots in women’s empowerment, mentorship, and public interest tech.</div>
          </li>
          <li>
            <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
            <div className="text-sm"><span className="font-medium">Expansion:</span> cross‑regional innovation labs and shared impact dashboards.</div>
          </li>
        </ol>
      </section>

      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">The Foundation as a Living System</h2>
        <p className="text-sm text-muted-foreground">We operate as an ecosystem: communities, tools, and data woven into a shared moral compass. Every program strengthens capacity for wise action—from local mentorship to global knowledge infrastructures.</p>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
