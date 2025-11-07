import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import PaymentSelector from "@/components/PaymentSelector";

const features = [
  "All Sanctum features",
  "Premium research papers",
  "Innovation toolkit & frameworks",
  "Monthly webinars & workshops",
  "Direct mentorship access",
  "Faith-tech collaboration network",
  "Fellow workspace privileges",
  "Project lead capabilities",
];

const Innovator = () => {
  const [activePlan, setActivePlan] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Innovator Tier</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">For creators, researchers, and faith-aligned innovators — $1,000 - $10,000 / year</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What's included</CardTitle>
              <CardDescription>Tools, mentorship, and workspace privileges to accelerate moral design</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Button className="w-full" variant="default" onClick={() => setActivePlan({ slug: 'innovator', name: 'Innovator Tier' })}>
                  Purchase Innovator — $1,000 - $10,000 / year
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Impact</CardTitle>
              <CardDescription>100,000+ innovators trained in moral design</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Join a cohort of creators and researchers building faith-aligned technology. Gain access to exclusive research, toolkits, and mentorship that helps scale projects ethically.</p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold">Why Innovator?</h4>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground">
                  <li>Priority access to pilot programs and grants</li>
                  <li>Connection to fellow innovators and project leads</li>
                  <li>Specialized training on moral design practices</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">After purchase you'll be redirected to sign in / sign up to complete onboarding and provision your Fellow workspace. If you already have an account, sign in to access your innovator dashboard immediately after payment confirmation.</p>
        </div>
      </main>

      <Footer />

      {activePlan && <PaymentSelector plan={activePlan} onClose={() => setActivePlan(null)} />}
    </div>
  );
};

export default Innovator;
