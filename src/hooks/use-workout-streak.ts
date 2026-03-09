import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STREAK_MESSAGES = [
  { min: 1, max: 2, message: "🔥 You're on a {n} day streak! Great start!" },
  { min: 3, max: 4, message: "🔥 You're on a {n} day streak! Keep it up!" },
  { min: 5, max: 6, message: "🔥 You're on a {n} day streak! Keep going!" },
  { min: 7, max: 13, message: "🔥 {n} day streak! You're on fire!" },
  { min: 14, max: 29, message: "💪 {n} day streak! Unstoppable!" },
  { min: 30, max: Infinity, message: "🏆 {n} day streak! Legendary consistency!" },
];

export const useWorkoutStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setStreak(0);
      setLoading(false);
      return;
    }

    const computeStreak = async () => {
      const { data, error } = await supabase
        .from("workout_progress")
        .select("date_completed")
        .eq("user_id", user.id)
        .order("date_completed", { ascending: false });

      if (error || !data || data.length === 0) {
        setStreak(0);
        setLoading(false);
        return;
      }

      // Get unique dates (normalized to day)
      const uniqueDates = new Set<string>();
      data.forEach((entry) => {
        const d = new Date(entry.date_completed);
        uniqueDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      });

      const sortedDates = Array.from(uniqueDates)
        .map((s) => {
          const [y, m, d] = s.split("-").map(Number);
          return new Date(y, m, d);
        })
        .sort((a, b) => b.getTime() - a.getTime());

      // Count consecutive days starting from today or yesterday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const firstDate = sortedDates[0];
      firstDate.setHours(0, 0, 0, 0);

      // Streak must include today or yesterday
      if (firstDate.getTime() !== today.getTime() && firstDate.getTime() !== yesterday.getTime()) {
        setStreak(0);
        setLoading(false);
        return;
      }

      let count = 1;
      let current = sortedDates[0];

      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(current);
        prev.setDate(prev.getDate() - 1);
        prev.setHours(0, 0, 0, 0);
        sortedDates[i].setHours(0, 0, 0, 0);

        if (sortedDates[i].getTime() === prev.getTime()) {
          count++;
          current = sortedDates[i];
        } else {
          break;
        }
      }

      setStreak(count);

      const msgTemplate = STREAK_MESSAGES.find((m) => count >= m.min && count <= m.max);
      if (msgTemplate) {
        setMessage(msgTemplate.message.replace("{n}", String(count)));
      }

      setLoading(false);
    };

    computeStreak();
  }, [user]);

  return { streak, loading, message };
};
