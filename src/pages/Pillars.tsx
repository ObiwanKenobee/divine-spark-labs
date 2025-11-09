import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function Pillars() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Core Pillars</h1>
        <p className="text-muted-foreground mb-6">Explore the core pillars content: spiritual intelligence, regenerative leadership, moral design, and impact practice.</p>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold">Spiritual Intelligence</h3>
            <p className="text-sm text-muted-foreground mt-2">Foundational teachings and practices to cultivate discernment.</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold">Regenerative Leadership</h3>
            <p className="text-sm text-muted-foreground mt-2">Approaches for leading teams and institutions with stewardship.</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold">Moral Design</h3>
            <p className="text-sm text-muted-foreground mt-2">Principles and frameworks for building ethically aligned products.</p>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
