import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface RecommendedWorkout {
  name: string;
  category: string;
  difficulty: string;
  duration: string;
  calories: string;
  description: string;
}

const ALL_WORKOUTS: RecommendedWorkout[] = [
  // Strength
  { name: "Barbell Squat", category: "strength", difficulty: "Intermediate", duration: "45 min", calories: "300", description: "Build lower body power with barbell squats targeting quads, glutes, and core." },
  { name: "Bench Press", category: "strength", difficulty: "Intermediate", duration: "40 min", calories: "250", description: "Classic chest builder focusing on pectorals, shoulders, and triceps." },
  { name: "Deadlift", category: "strength", difficulty: "Advanced", duration: "50 min", calories: "350", description: "Full-body compound movement for posterior chain strength." },
  { name: "Pull-ups", category: "strength", difficulty: "Intermediate", duration: "30 min", calories: "200", description: "Upper body pull exercise targeting lats, biceps, and grip strength." },
  { name: "Overhead Press", category: "strength", difficulty: "Intermediate", duration: "35 min", calories: "220", description: "Shoulder-dominant press building deltoid and upper body strength." },
  { name: "Lunges", category: "strength", difficulty: "Beginner", duration: "30 min", calories: "200", description: "Unilateral leg exercise improving balance and lower body strength." },
  // Cardio
  { name: "Running", category: "cardio", difficulty: "Beginner", duration: "30 min", calories: "300", description: "Steady-state run to build aerobic endurance and burn calories." },
  { name: "HIIT", category: "cardio", difficulty: "Advanced", duration: "25 min", calories: "400", description: "High-intensity intervals for maximum calorie burn and cardiovascular fitness." },
  { name: "Cycling", category: "cardio", difficulty: "Beginner", duration: "40 min", calories: "350", description: "Low-impact cardio session for endurance and leg conditioning." },
  { name: "Jump Rope", category: "cardio", difficulty: "Intermediate", duration: "20 min", calories: "280", description: "Full-body cardio improving coordination, agility, and stamina." },
  { name: "Swimming", category: "cardio", difficulty: "Intermediate", duration: "45 min", calories: "400", description: "Total body workout that's easy on joints with great cardio benefits." },
  { name: "Rowing", category: "cardio", difficulty: "Intermediate", duration: "30 min", calories: "320", description: "Full-body cardio engaging legs, back, and arms simultaneously." },
  // Flexibility
  { name: "Yoga", category: "flexibility", difficulty: "Beginner", duration: "45 min", calories: "150", description: "Improve flexibility, balance, and mindfulness through yoga poses." },
  { name: "Dynamic Stretching", category: "flexibility", difficulty: "Beginner", duration: "20 min", calories: "100", description: "Active stretches to warm up muscles and improve range of motion." },
  { name: "Pilates", category: "flexibility", difficulty: "Intermediate", duration: "40 min", calories: "200", description: "Core-focused workout improving posture, flexibility, and stability." },
  { name: "Foam Rolling", category: "flexibility", difficulty: "Beginner", duration: "20 min", calories: "80", description: "Self-myofascial release for muscle recovery and mobility." },
];

export const useRecommendedWorkout = () => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<RecommendedWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Pick a random one for non-authenticated state
      setWorkout(ALL_WORKOUTS[Math.floor(Math.random() * ALL_WORKOUTS.length)]);
      setLoading(false);
      return;
    }

    const recommend = async () => {
      const { data } = await supabase
        .from("workout_progress")
        .select("workout_name, category")
        .eq("user_id", user.id)
        .order("date_completed", { ascending: false })
        .limit(20);

      const recentNames = new Set(data?.map((d) => d.workout_name) || []);
      const categoryCounts: Record<string, number> = {};
      data?.forEach((d) => {
        categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
      });

      // Find least-done category
      const allCats = ["strength", "cardio", "flexibility"];
      const leastDoneCategory = allCats.sort(
        (a, b) => (categoryCounts[a] || 0) - (categoryCounts[b] || 0)
      )[0];

      // Prefer workouts from least-done category that haven't been done recently
      let candidates = ALL_WORKOUTS.filter(
        (w) => w.category === leastDoneCategory && !recentNames.has(w.name)
      );

      if (candidates.length === 0) {
        candidates = ALL_WORKOUTS.filter((w) => !recentNames.has(w.name));
      }
      if (candidates.length === 0) {
        candidates = ALL_WORKOUTS;
      }

      // Use day of year as seed for consistent daily recommendation
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      setWorkout(candidates[dayOfYear % candidates.length]);
      setLoading(false);
    };

    recommend();
  }, [user]);

  return { workout, loading };
};
