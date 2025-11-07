import React from "react";

type Plan = { slug: string; name: string };

const PROVIDERS = ["mpesa", "paystack", "paypal", "crypto"] as const;

export default function PaymentSelector({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const handleProvider = (provider: string) => {
    const envKeySpecific = `VITE_${provider.toUpperCase()}_LINK_${plan.slug.toUpperCase()}`;
    const envKeyGeneric = `VITE_PAYMENT_LINK_${plan.slug.toUpperCase()}`;

    // Use (window as any).importMetaShim in environments where import.meta is not available at runtime;
    // but Vite exposes import.meta.env at build time. We access it via (import.meta as any).env
    const env = (import.meta as any).env || {};
    const specific = env[envKeySpecific];
    const generic = env[envKeyGeneric];

    // Persist pending plan/provider for post-payment provisioning
    try {
      localStorage.setItem("pendingPlan", plan.slug);
      localStorage.setItem("pendingProvider", provider);
    } catch (e) {
      // ignore storage errors
    }

    const target = specific || generic;
    if (target && typeof target === "string") {
      // If the target looks like a payment link, redirect
      if (target.startsWith("http")) {
        window.location.href = target;
        return;
      }
    }

    // Fallback: route to auth with plan and provider params
    const authUrl = `/auth?plan=${encodeURIComponent(plan.slug)}&provider=${encodeURIComponent(provider)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-card rounded-lg border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Purchase {plan.name}</h3>
          <button className="text-muted-foreground" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">Choose your preferred payment method. You will be redirected to a hosted checkout flow.</p>

        <div className="grid grid-cols-2 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              onClick={() => handleProvider(p)}
              className="py-3 px-4 rounded-md bg-background border hover:shadow-sm"
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>If you do not have a hosted payment link configured, you'll be routed to sign up and complete provisioning after payment is confirmed.</p>
        </div>
      </div>
    </div>
  );
}
