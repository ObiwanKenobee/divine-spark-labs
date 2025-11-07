import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('status');
    const p = params.get('plan') || localStorage.getItem('pendingPlan');
    const prov = params.get('provider') || localStorage.getItem('pendingProvider');
    setStatus(s || (p ? 'unknown' : null));
    setPlan(p);
    setProvider(prov);
  }, []);

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No payment activity found.</p>
          <Button onClick={() => navigate('/pricing')}>Back to Pricing</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-card rounded-lg border">
        <h2 className="text-2xl font-semibold mb-2">Payment Status</h2>
        <p className="mb-4 text-sm text-muted-foreground">Status: <strong>{status}</strong></p>
        {plan && <p className="mb-2">Plan: <strong>{plan}</strong></p>}
        {provider && <p className="mb-4">Provider: <strong>{provider}</strong></p>}

        {status === 'success' || status === 'paid' ? (
          <div className="space-y-3">
            <p className="text-sm">Your payment was received. If you already have an account, sign in to continue. If not, please sign up to complete onboarding and access your workspace.</p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/auth')}>Sign In / Sign Up</Button>
              <Button variant="outline" onClick={() => navigate('/pricing')}>Back to Pricing</Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm">We could not confirm your payment. If you believe this is an error, contact support with your transaction details.</p>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => navigate('/pricing')}>Retry Purchase</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
