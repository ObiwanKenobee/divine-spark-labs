import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Educational Resources</h1>
        <p className="text-muted-foreground mb-6">Curated learning paths, courses, and open materials for learners.</p>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold">Beginner Track</h3>
            <p className="text-sm text-muted-foreground mt-2">Introductory materials for newcomers to moral design.</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold">Research & Papers</h3>
            <p className="text-sm text-muted-foreground mt-2">Selected research and case studies for deeper study.</p>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
