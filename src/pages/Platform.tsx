import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Platform = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Platform</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Overview of the Joseph‑Marie Foundation platform: APIs, datasets, and tools for ethical innovation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Discernment API</CardTitle>
              <CardDescription>Semantic judgments and alignment guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Programmatic access to moral reasoning primitives and policy checks.</p>
              <div className="mt-4"><Button onClick={() => window.location.href = '/auth'}>Get API Access</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wisdom Graph</CardTitle>
              <CardDescription>Knowledge graph of ethical sources</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Interconnected doctrines, case studies, and governance templates.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Cloud</CardTitle>
              <CardDescription>Deployment & analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Metrics, dashboards, and compliance tooling for institutional deployments.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Platform;
