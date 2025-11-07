import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Community = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Community</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Join forums, events, and collaborative programs to engage with fellow practitioners.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold">Forums</h3>
          <p className="text-sm text-muted-foreground">Participate in discussions, Q&A, and working groups.</p>
          <div className="mt-4"><Button onClick={() => window.open('https://community.example.com', '_blank')}>Open Forum</Button></div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold">Events</h3>
          <p className="text-sm text-muted-foreground">Workshops, webinars, and fellowship opportunities.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Community;
