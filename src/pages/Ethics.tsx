import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Ethics = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Ethics</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Our ethical frameworks, governance playbooks, and research on moral design.</p>
      </div>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold">Frameworks</h3>
          <p className="text-sm text-muted-foreground">Principles and templates for ethical system design.</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold">Governance</h3>
          <p className="text-sm text-muted-foreground">Policies, audit guidance, and compliance tooling.</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold">Research</h3>
          <p className="text-sm text-muted-foreground">Academic and applied research on moral AI.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Ethics;
