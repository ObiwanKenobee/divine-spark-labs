import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AutoReloader from "@/components/AutoReloader";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Organizations from "./pages/Organizations";
import Enterprise from "./pages/Enterprise";
import Onboarding from "./pages/Onboarding";
import Workspaces from "./pages/Workspaces";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import PaymentStatus from "./pages/PaymentStatus";
import HeaderDemo from "./pages/HeaderDemo";
import FooterDemo from "./pages/FooterDemo";
import Platform from "./pages/Platform";
import Impact from "./pages/Impact";
import Ethics from "./pages/Ethics";
import Community from "./pages/Community";
import Solutions from "./pages/Solutions";
import Innovator from "./pages/Innovator";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Women from "./pages/Women";
import Labs from "./pages/Labs";
import Mentorship from "./pages/Mentorship";
import Innovation from "./pages/Innovation";
import Learning from "./pages/Learning";
import Faith from "./pages/Faith";
import Partnerships from "./pages/Partnerships";
import Legal from "./pages/Legal";
import Explore from "./pages/Explore";
import Forums from "./pages/Forums";
import Events from "./pages/Events";
import Programs from "./pages/Programs";
import AiBacklink from "./pages/AiBacklink";
import Deployments from "./pages/Deployments";
import Matchmaking from "./pages/Matchmaking";
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AutoReloader />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
            <Route path="/payment/status" element={<PaymentStatus />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/ethics" element={<Ethics />} />
            <Route path="/community" element={<Community />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/events" element={<Events />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/innovator" element={<Innovator />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/women" element={<Women />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/innovation" element={<Innovation />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/faith" element={<Faith />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/header-demo" element={<HeaderDemo />} />
            <Route path="/footer-demo" element={<FooterDemo />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/ai-backlink" element={<AiBacklink />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
