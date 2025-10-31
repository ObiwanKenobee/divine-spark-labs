import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              The Joseph-Marie Foundation
            </h3>
            <p className="text-primary-foreground/80 italic">
              "Intelligence Inspired by Heaven"
            </p>
            <p className="text-primary-foreground/70 leading-relaxed">
              Uniting faith, science, and innovation to serve humanity's higher calling.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>info@josephmariefoundation.org</span>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Serving communities worldwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} The Joseph-Marie Foundation for Divine Innovation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
