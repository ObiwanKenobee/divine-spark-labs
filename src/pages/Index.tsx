import Hero from "@/components/Hero";
import TrustLogos from "@/components/TrustLogos";
import Benefits from "@/components/Benefits";
import CorePillars from "@/components/CorePillars";
import Applications from "@/components/Applications";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import LossAversion from "@/components/LossAversion";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AIChat from "@/components/AIChat";
import ResearchAssistant from "@/components/ResearchAssistant";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";

const NewsletterModal = React.lazy(() => import("@/components/NewsletterModal"));

const Index = () => {
  const navigate = useNavigate();
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    try {
      const subscribed = localStorage.getItem('jmf_newsletter_subscribed');
      const shown = localStorage.getItem('jmf_newsletter_shown');
      if (subscribed) return; // already subscribed
      if (shown) return; // already shown this user
      const t = setTimeout(() => {
        setShowNewsletter(true);
        localStorage.setItem('jmf_newsletter_shown', '1');
      }, 3000);
      return () => clearTimeout(t);
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <TrustLogos />
      <Benefits />
      <CorePillars />
      <Applications />
      <Process />
      <Testimonials />
      <LossAversion />
      <FAQ />
      <CTA />
      <Footer />
      <AIChat />
      <ResearchAssistant />

      <Suspense fallback={null}>
        {showNewsletter && (
          <NewsletterModal open={showNewsletter} onClose={() => setShowNewsletter(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default Index;
