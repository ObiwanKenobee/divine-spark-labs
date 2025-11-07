import Header from "@/components/Header";

const HeaderDemo = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Enterprise Header Demo</h1>
        <p className="text-muted-foreground">This page demonstrates the enterprise header with solutions menu and CTAs.</p>
      </main>
    </div>
  );
};

export default HeaderDemo;
