import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sampleOpenData = {
  councils: 3,
  advisoryCircles: 5,
  genderBalance: { female: 58, male: 40, nonbinary: 2 },
  ageBalance: { "0-24": 18, "25-39": 37, "40-59": 32, "60+": 13 },
};

const Mission = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Mission, Vision & Governance</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Radical transparency and rotating stewardship organized around councils, circles, and commons.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Org Chart</h2>
          <p className="text-sm text-muted-foreground mb-4">Rotational leadership across Stewardship Council, Ethics Circle, and Innovation Guilds.</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border p-3">Stewardship Council</div>
            <div className="rounded border p-3">Ethics Circle</div>
            <div className="rounded border p-3">Innovation Guilds</div>
            <div className="rounded border p-3">Advisory Network</div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Governance Dashboard</h2>
          <p className="text-sm text-muted-foreground">Inclusivity snapshot derived from open data.</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border p-3"><span className="font-medium">Councils:</span> {sampleOpenData.councils}</div>
            <div className="rounded border p-3"><span className="font-medium">Advisory Circles:</span> {sampleOpenData.advisoryCircles}</div>
            <div className="rounded border p-3"><span className="font-medium">Gender Balance:</span> {sampleOpenData.genderBalance.female}% women</div>
            <div className="rounded border p-3"><span className="font-medium">Age 25–39:</span> {sampleOpenData.ageBalance["25-39"]}%</div>
          </div>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Transparency • Open Data</h2>
        <p className="text-sm text-muted-foreground mb-4">We publish machine‑readable governance data with human‑readable summaries.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <pre className="text-xs bg-muted p-4 rounded border overflow-x-auto">{JSON.stringify(sampleOpenData, null, 2)}</pre>
          <div className="text-sm space-y-2">
            <div><span className="font-medium">Women representation:</span> {sampleOpenData.genderBalance.female}%</div>
            <div><span className="font-medium">Young innovators (0–24):</span> {sampleOpenData.ageBalance["0-24"]}%</div>
            <div><span className="font-medium">Senior sages (60+):</span> {sampleOpenData.ageBalance["60+"]}%</div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Mission;
