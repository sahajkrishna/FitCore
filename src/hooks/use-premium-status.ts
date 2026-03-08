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
        .select("id, status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
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
