import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes the Joseph-Marie Foundation different from other innovation platforms?",
    answer: "We uniquely unite faith, science, and innovation as a moral pursuit. Unlike purely technical platforms, we provide frameworks that ensure technology serves humanity's higher calling while maintaining cutting-edge capabilities. Our Moral GDP metrics measure true value, not just financial returns.",
  },
  {
    question: "Do I need to be religious to participate?",
    answer: "No. While we're inspired by faith traditions, our framework welcomes all who believe technology should serve human dignity and ethical principles. Our community includes people of all backgrounds united by the desire to build responsibly.",
  },
  {
    question: "How does the pricing work?",
    answer: "We offer four tiers designed for different scales of impact: Open Access Sanctum (free-$100) for individuals, Innovator Tier ($500-$5,000/year) for creators and researchers, Institutional Harmony ($50,000-$500,000) for organizations, and Civilization Architect ($1M-$100M+) for transformative national initiatives.",
  },
  {
    question: "What is 'Moral GDP' and how is it measured?",
    answer: "Moral GDP (Gross Divine Potential) measures innovation's true value to humanity beyond financial metrics. We track impact on human dignity, ethical governance, sustainability, education, and community transformation. Each tier includes specific measurement frameworks and reporting tools.",
  },
  {
    question: "Can I upgrade or downgrade my tier?",
    answer: "Yes, absolutely. Start with Open Access Sanctum to explore, then upgrade as your projects grow. Organizations can scale between tiers based on their evolving needs. We make transitions seamless with no penalties.",
  },
  {
    question: "What kind of support and resources do I get?",
    answer: "All members access our research library, ethical frameworks, and community forums. Higher tiers include direct mentorship, institutional partnerships, custom deployment support, and dedicated innovation labs. We provide both technical resources and spiritual guidance.",
  },
  {
    question: "How do you ensure innovations remain ethical?",
    answer: "Every project is guided by our Core Pillars framework—Theology of Innovation, Ethical Technology, Education & Mentorship, and Sacred Sustainability. We provide ethics review processes, peer accountability, and continuous education to ensure innovations serve human dignity.",
  },
  {
    question: "Is there a trial period or money-back guarantee?",
    answer: "Our Open Access Sanctum tier is free or minimal cost, serving as an extended trial. Paid tiers include a 30-day satisfaction guarantee. If our framework doesn't align with your mission, we'll refund your investment completely.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about divine innovation.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-card-foreground hover:text-accent hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-6 bg-accent/5 border border-accent/20 rounded-xl">
          <p className="text-foreground font-medium mb-2">
            Still have questions?
          </p>
          <p className="text-muted-foreground">
            Reach out to our team at{" "}
            <a
              href="mailto:info@josephmariefoundation.org"
              className="text-accent hover:underline font-medium"
            >
              info@josephmariefoundation.org
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
