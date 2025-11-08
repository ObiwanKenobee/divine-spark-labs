import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Legal = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Legal, Ethics & Transparency</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Policies that reinforce trust, accountability, and public good.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Data Governance</h3>
          <p className="text-sm text-muted-foreground">Privacy by design, rights of access, and auditability.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">AI Ethics</h3>
          <p className="text-sm text-muted-foreground">Alignment with UN SDGs, ESG practices, and African AI frameworks.</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Transparency</h3>
          <p className="text-sm text-muted-foreground">Open impact data, downloadable CSVs, and public feedback channels.</p>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Compliance</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>GDPR data rights and consent mechanisms</li>
          <li>Security reviews and independent audits</li>
          <li>Impact disclosure and sustainability reporting</li>
        </ul>
      </section>
    </main>
    <Footer />
  </div>
);

export default Legal;
