import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PendingRequestsBadge = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from('role_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (error) throw error;
        setPendingCount(count || 0);
      } catch (err) {
        console.error('Failed to fetch pending requests count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('role_requests_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'role_requests',
        },
        () => {
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/admin?tab=role-requests")}
          >
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {pendingCount > 9 ? '9+' : pendingCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {pendingCount === 0
              ? 'No pending role requests'
              : `${pendingCount} pending role request${pendingCount > 1 ? 's' : ''}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
