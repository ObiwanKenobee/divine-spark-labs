const Mission = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Purpose
          </h2>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground">
              To unite <span className="font-semibold text-foreground">faith</span>, 
              {" "}<span className="font-semibold text-foreground">science</span>, and 
              {" "}<span className="font-semibold text-foreground">innovation</span> as a moral 
              and spiritual pursuit — ensuring that technology serves humanity's higher calling.
            </p>
          </div>

          <div className="pt-8 grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">Faith</div>
              <p className="text-sm text-muted-foreground">
                Grounded in divine wisdom
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">Science</div>
              <p className="text-sm text-muted-foreground">
                Driven by rigorous inquiry
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">Innovation</div>
              <p className="text-sm text-muted-foreground">
                Creating a better tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
