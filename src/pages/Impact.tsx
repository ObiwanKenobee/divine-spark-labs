import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Impact = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Impact</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">How our work translates to real-world outcomes — case studies, metrics, and partnerships.</p>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Case Studies</h3>
          <p className="text-sm text-muted-foreground">Examples of deployments that improved governance and civic wellbeing.</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">Metrics</h3>
          <p className="text-sm text-muted-foreground">KPIs, moral GDP indicators, and evaluation methods.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Impact;
