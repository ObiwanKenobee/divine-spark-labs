import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Solutions = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Solutions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Products and solutions offered by the Foundation.</p>
      </div>

      <div id="discernment-api" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Discernment API</CardTitle>
            <CardDescription>Automated alignment and moral analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Machine-assisted discernment for developers and policymakers.</p>
          </CardContent>
        </Card>
      </div>

      <div id="wisdomgraph" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Wisdom Graph</CardTitle>
            <CardDescription>Curated ethical knowledge graph</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Interlinked doctrines, research, and governance artifacts.</p>
          </CardContent>
        </Card>
      </div>

      <div id="impact-cloud" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Impact Cloud</CardTitle>
            <CardDescription>Deployment, telemetry and compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tools for measuring, auditing, and reporting impact.</p>
          </CardContent>
        </Card>
      </div>

      <div id="ethicsops" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>EthicsOps</CardTitle>
            <CardDescription>Operationalizing ethical practices at scale</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Automated processes, checklists, and role-based governance.</p>
          </CardContent>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default Solutions;
