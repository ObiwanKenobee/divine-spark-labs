import { Mail, MapPin, Globe, Users, FileText, Zap } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  const site = "https://josephmariefoundation.org";

  const regionLink = (region: string) => `${site}?region=${encodeURIComponent(region)}`;

  return (
    <footer className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">The Joseph-Marie Foundation</h3>
            <p className="text-primary-foreground/80 italic">"Intelligence Inspired by Heaven"</p>
            <p className="text-primary-foreground/70 leading-relaxed">Uniting faith, science, and innovation to serve humanity's higher calling.</p>
            <div className="flex items-center gap-3 mt-4">
              <Mail className="w-5 h-5" />
              <a href="mailto:info@josephmariefoundation.org" className="underline">info@josephmariefoundation.org</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Backlink Innovation Flywheel</h4>
            <ul className="text-sm text-primary-foreground/80 space-y-2">
              <li><strong>Discovery:</strong> AI identifies high-authority partners (universities, policy hubs, NGOs, labs).</li>
              <li><strong>Content Syndication:</strong> Publish co-authored research, journals, and dashboards for editorial backlinks.</li>
              <li><strong>Engagement:</strong> Impact storytelling to generate organic citations and social signals.</li>
              <li><strong>Data Feedback:</strong> Capture backlink analytics for predictive ROI and RevOps.</li>
              <li><strong>Reinforcement:</strong> Reward high-value partners through recognition & gamification.</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <a href="/reports" target="_blank" rel="noopener noreferrer" className="text-sm underline">Reports & DOIs</a>
              <a href="/hackathons" target="_blank" rel="noopener noreferrer" className="text-sm underline">Innovation Challenges</a>
              <a href="/partners" target="_blank" rel="noopener noreferrer" className="text-sm underline">Ecosystem Partners</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Regional Hubs & Partnerships</h4>
            <p className="text-sm text-primary-foreground/80">Regenerative funnel: Kenya → Jerusalem → Global — building local credibility and compounding authority.</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <a href={regionLink('Kenya')} className="p-2 rounded bg-primary/10 text-sm inline-block text-center">Kenya Hub</a>
              <a href={regionLink('Jerusalem')} className="p-2 rounded bg-primary/10 text-sm inline-block text-center">Jerusalem Hub</a>
              <a href={regionLink('Jamaica')} className="p-2 rounded bg-primary/10 text-sm inline-block text-center">Jamaica Hub</a>
              <a href={regionLink('Global')} className="p-2 rounded bg-primary/10 text-sm inline-block text-center">Global Map</a>
              <a href="/diaspora" className="p-2 rounded bg-primary/10 text-sm inline-block text-center">Diaspora Bridges</a>
            </div>

            <div className="mt-3">
              <a href="mailto:partners@josephmariefoundation.org?subject=Partnership%20Inquiry" className="text-sm underline">Partner with us</a>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-6xl mx-auto p-6 bg-primary/5 rounded border border-primary-foreground/10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h5 className="font-semibold">Impact Graph Backlinks</h5>
              <p className="text-sm text-primary-foreground/80">Structured, open-access nodes (program pages, reports, DOIs) that interlink regional projects and partners to build transparent authority.</p>
            </div>
            <div className="flex gap-2">
              <a href="/impact-graph" className="px-4 py-2 rounded bg-secondary text-secondary-foreground">Explore Impact Graph</a>
              <a href="/ai-backlink" className="px-4 py-2 rounded border border-border">AI Backlink Tools</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {year} The Joseph-Marie Foundation for Divine Innovation. All rights reserved.</p>
          <p className="mt-2 text-xs">Core RevOps: Cross-domain Revenue Intelligence · Relational SEO · AI Attribution Models</p>
        </div>

        {/* Structured data for SEO and trust signals */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "The Joseph-Marie Foundation",
          "url": "${site}",
          "sameAs": ["https://twitter.com/josephmariefnd","https://www.linkedin.com/company/josephmariefoundation"],
          "description": "Faith, science, and innovation for planetary impact. Backlink innovation, AI intelligence, and regional hubs (Kenya, Jamaica).",
          "contactPoint": [{"@type": "ContactPoint","telephone": "","contactType": "customer support","email": "info@josephmariefoundation.org"}]
        }`}</script>
      </div>
    </footer>
  );
};

export default Footer;
