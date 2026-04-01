import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPremium = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, subscription_status, subscription_end_date")
        .eq("user_id", user.id)
        .eq("subscription_status", "active")
        .gte("subscription_end_date", new Date().toISOString())
        .order("subscription_start_date", { ascending: false })
        .limit(1);

      setIsPremium(!error && !!data && data.length > 0);
    } catch {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkPremium();
  }, [checkPremium]);

  return { isPremium, loading, refetch: checkPremium };
};
