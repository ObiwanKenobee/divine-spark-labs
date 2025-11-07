import Footer from "@/components/Footer";

const FooterDemo = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Footer Demo</h1>
        <p className="text-muted-foreground">This page demonstrates the enterprise footer content.</p>
      </main>
      <Footer />
    </div>
  );
};

export default FooterDemo;
