import React, { useState } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewsletterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const subscribe = async () => {
    if (!validateEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    setLoading(true);
    try {
      // naive local subscription: persist email locally. In production, replace with API call.
      localStorage.setItem("jmf_newsletter_subscribed", email);
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Subscribed", description: "Thank you — we've added you to the newsletter." });
      onClose();
    } catch (e) {
      toast({ title: "Subscription failed", description: "Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const navTo = (path: string) => {
    setIsNavigating(true);
    // Keep modal open while showing a tiny loader to simulate lazy navigation
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
      onClose();
    }, 600);
  };

  return (
    <Modal open={open} onClose={onClose} title="Join our Newsletter">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Receive updates, research briefings, and invitations to programs. Unsubscribe anytime.</p>

        <div className="flex gap-2">
          <Input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={subscribe} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </Button>
        </div>

        <div className="pt-3 border-t">
          <div className="text-sm text-muted-foreground mb-2">Quick Explore</div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => navTo('/about')}>
              About
            </Button>
            <Button variant="ghost" onClick={() => navTo('/mission')}>
              Mission
            </Button>
            <Button variant="ghost" onClick={() => navTo('/women')}>
              Women
            </Button>
            <Button variant="ghost" onClick={() => navTo('/labs')}>
              Labs
            </Button>
          </div>
        </div>

        {isNavigating && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Navigating…
          </div>
        )}

        <div className="pt-4 text-xs text-muted-foreground">We respect your privacy. Your email will only be used for Foundation updates.</div>
      </div>
    </Modal>
  );
}
