import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Explore = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Explore</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Discover the Foundation's layers: Programs, Labs, Research, Partnerships, and more.</p>
      </div>

      <section className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold">Public Layer</h3>
          <p className="text-sm text-muted-foreground mt-2">Inspire and onboard visitors: Home, About, Vision, Programs, Stories</p>
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => (window.location.href = "/about")}>About</Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/mission")}>Mission</Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold">Engagement Layer</h3>
          <p className="text-sm text-muted-foreground mt-2">Interact, learn, and participate: Labs, Mentorship, Community, Events</p>
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => (window.location.href = "/labs")}>Labs</Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/mentorship")}>Mentorship</Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold">Operational Layer</h3>
          <p className="text-sm text-muted-foreground mt-2">Manage the ecosystem: Admin, Governance, AI Tools, Data Analytics</p>
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => (window.location.href = "/platform")}>Platform</Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/innovation")}>Innovation Cloud</Button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold">Intelligence Layer (AI)</h3>
          <p className="text-sm text-muted-foreground mt-2">Adaptive learning, Knowledge Graph, Mentor Graph, Impact Forecasting.</p>
          <div className="mt-4">
            <Button onClick={() => (window.location.href = '/learning')}>Learning Hub</Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold">Transparency & Ethics</h3>
          <p className="text-sm text-muted-foreground mt-2">Governance, open data, compliance, and ethical review processes.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => (window.location.href = '/legal')}>Legal & Transparency</Button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Explore;
