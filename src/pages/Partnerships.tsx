import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Partnerships = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Partnerships & Investment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Scaling capital and collaboration with transparency and shared outcomes.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Partnership Map</h3>
          <p className="text-sm text-muted-foreground">View collaborations by sector and region to identify synergy.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Proposal Portal</h3>
          <p className="text-sm text-muted-foreground">Submit ideas, track reviews, and monitor funding status.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Investment Matchmaking</h3>
          <p className="text-sm text-muted-foreground">Align investors and causes via shared values and measurable impact.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Partnerships;
