import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Ethics Researcher",
    organization: "Stanford University",
    content: "The Joseph-Marie Foundation has revolutionized how we approach ethical AI development. Their framework unites cutting-edge technology with timeless moral principles.",
    rating: 5,
  },
  {
    name: "Father Michael Torres",
    role: "Director of Innovation",
    organization: "Global Faith Alliance",
    content: "Finally, a platform where faith leaders and technologists can collaborate meaningfully. The impact on our community has been transformative.",
    rating: 5,
  },
  {
    name: "Prof. James Williams",
    role: "Innovation Lab Director",
    organization: "MIT Sacred Tech Lab",
    content: "The Moral GDP framework provides the metrics we've been missing. We can now measure innovation's true value to humanity.",
    rating: 5,
  },
  {
    name: "Dr. Amara Okonkwo",
    role: "Chief Technology Officer",
    organization: "African Development Institute",
    content: "This isn't just another tech platform—it's a movement. Our nation's innovation landscape has been forever changed for the better.",
    rating: 5,
  },
  {
    name: "Rabbi David Goldstein",
    role: "Technology Ethics Advisor",
    organization: "Interfaith Innovation Council",
    content: "The foundation's approach to uniting diverse faith traditions with modern innovation is unprecedented and deeply needed in our world.",
    rating: 5,
  },
  {
    name: "Dr. Maria Santos",
    role: "Bioethics Professor",
    organization: "Oxford University",
    content: "Their educational programs have trained a new generation of innovators who truly understand that technology must serve human dignity above all else.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Trusted by Global Leaders
          </h2>
          <p className="text-lg text-muted-foreground">
            See how innovators, faith leaders, and institutions are transforming the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card relative"
            >
              <div className="space-y-4">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-accent font-medium">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
