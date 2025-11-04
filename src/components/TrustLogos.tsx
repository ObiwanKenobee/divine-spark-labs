const TrustLogos = () => {
  const partners = [
    { name: "Global Faith Alliance", width: "140px" },
    { name: "Innovation Council", width: "160px" },
    { name: "Sacred Tech Lab", width: "150px" },
    { name: "Ethical AI Foundation", width: "180px" },
    { name: "Divine Research Institute", width: "190px" },
  ];

  return (
    <section className="py-16 px-6 bg-muted/30 border-y border-border">
      <div className="container mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
          Trusted by Leading Organizations in Faith & Innovation
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="h-12 flex items-center justify-center transition-opacity hover:opacity-100 duration-300"
              style={{ width: partner.width }}
            >
              <div className="text-muted-foreground font-semibold text-sm text-center">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
