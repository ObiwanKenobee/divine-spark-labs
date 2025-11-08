import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Mentorship = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Mentorship & Collaboration</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Pairing across generations and domains with shared workspaces and feedback loops.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Mentor Graph</h3>
          <p className="text-sm text-muted-foreground">Recommendations based on learning style, goals, and integrity signals.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Collaboration Spaces</h3>
          <p className="text-sm text-muted-foreground">Messaging, task boards, and document co‑authoring for project teams.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Wisdom Tokens</h3>
          <p className="text-sm text-muted-foreground">Mentors earn tokens for impact; mentees build reputation through reciprocity.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Mentorship;
