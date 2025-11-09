import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function Frameworks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Ethical Frameworks</h1>
        <p className="text-muted-foreground mb-6">Basic ethical frameworks and templates to guide projects.</p>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold">Project Ethics Template</h3>
            <p className="text-sm text-muted-foreground mt-2">A checklist to evaluate project alignment with moral principles.</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold">Governance Templates</h3>
            <p className="text-sm text-muted-foreground mt-2">Templates for board governance and oversight policies.</p>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
