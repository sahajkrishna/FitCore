import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    const checkPremium = async () => {
      const { data, error } = await supabase
        .from("subscriptions" as any)
        .select("id, subscription_status, subscription_end_date")
        .eq("user_id", user.id)
        .eq("subscription_status", "active")
        .gte("subscription_end_date", new Date().toISOString())
        .order("subscription_start_date", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
      setLoading(false);
    };

    checkPremium();
  }, [user]);

  return { isPremium, loading };
};
