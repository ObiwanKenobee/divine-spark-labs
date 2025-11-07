import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Organizations from "./pages/Organizations";
import Enterprise from "./pages/Enterprise";
import Onboarding from "./pages/Onboarding";
import Workspaces from "./pages/Workspaces";
import PaymentStatus from "./pages/PaymentStatus";
import HeaderDemo from "./pages/HeaderDemo";
import FooterDemo from "./pages/FooterDemo";
import Platform from "./pages/Platform";
import Impact from "./pages/Impact";
import Ethics from "./pages/Ethics";
import Community from "./pages/Community";
import Solutions from "./pages/Solutions";
import Innovator from "./pages/Innovator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/payment/status" element={<PaymentStatus />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/ethics" element={<Ethics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/header-demo" element={<HeaderDemo />} />
          <Route path="/footer-demo" element={<FooterDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
