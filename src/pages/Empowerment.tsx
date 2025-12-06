import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Empowerment = () => {
  const navigate = useNavigate();

  const frameworks = [
    {
      id: "work-innovation",
      title: "Work-as-Innovation Doctrine",
      subtitle: "Vocation of Daily Work",
      description: "Holiness is found in ordinary work, done extraordinarily well.",
      icon: "🔧"
    },
    {
      id: "agency-mastery",
      title: "Agency & Self-Mastery Framework",
      subtitle: "Interior Freedom",
      description: "The ability to choose the good despite pressure.",
      icon: "💪"
    },
    {
      id: "identity-worth",
      title: "Identity & Human Worth Engine",
      subtitle: "Divine Filiation",
      description: "You are a beloved child of God with infinite dignity.",
      icon: "👑"
    },
    {
      id: "network-good",
      title: "Network-of-Good Architecture",
      subtitle: "Apostolate of Friendship",
      description: "Real change happens through personal connection and friendship.",
      icon: "🤝"
    },
    {
      id: "system-transformation",
      title: "Transforming Systems from Within",
      subtitle: "Love for the World",
      description: "The world is not an obstacle—it's the terrain where transformation happens.",
      icon: "🌍"
    },
    {
      id: "compassion-care",
      title: "Compassion & Care Model",
      subtitle: "Marian Devotion",
      description: "Empower women and families through compassion and generosity.",
      icon: "❤️"
    },
    {
      id: "resilience-antifrailty",
      title: "Resilience & Anti-Fragility Architecture",
      subtitle: "Sanctity in Suffering",
      description: "Turn adversity into entrepreneurial grit and community resilience.",
      icon: "🛡️"
    },
    {
      id: "quiet-intelligence",
      title: "Quiet Intelligence & Strategic Thinking",
      subtitle: "Contemplation in Action",
      description: "Deep reflection precedes effective action.",
      icon: "🧠"
    },
    {
      id: "intergenerational-engine",
      title: "Intergenerational Innovation Engine",
      subtitle: "The Family as a Civilization",
      description: "Families are factories of society.",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      id: "coherence-architecture",
      title: "Coherence Architecture",
      subtitle: "Unity of Life",
      description: "Ethical, spiritual, and professional life must be ONE integrated whole.",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">JMF Empowerment Framework</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-2">
            Turning spirituality into systems, innovation, and human flourishing
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Based on the teachings of Josemaría Escrivá, these 10 pillars guide our empowerment programs
          </p>
        </header>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {frameworks.map((framework) => (
            <div
              key={framework.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/empowerment/${framework.id}`)}
            >
              <div className="text-4xl mb-4">{framework.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{framework.title}</h3>
              <p className="text-sm text-accent font-semibold mb-2">{framework.subtitle}</p>
              <p className="text-sm text-muted-foreground mb-4">{framework.description}</p>
              <Button variant="ghost" className="w-full justify-start">
                Explore Framework →
              </Button>
            </div>
          ))}
        </section>

        <section className="bg-muted rounded-lg p-8 mt-16">
          <h2 className="text-3xl font-bold mb-6">About This Framework</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Inspired by Josemaría Escrivá</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These frameworks synthesize the spiritual and practical teachings of Josemaría Escrivá, founder of Opus Dei, with modern empowerment practices.
              </p>
              <p className="text-sm text-muted-foreground">
                Each pillar draws from primary sources including The Way, Furrow, The Forge, Friends of God, and Conversations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">JMF Translation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We translate these timeless principles into practical programs that empower individuals and communities.
              </p>
              <p className="text-sm text-muted-foreground">
                From economic empowerment to mental resilience, family restoration to institutional transformation—each framework creates pathways to human flourishing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Empowerment;
