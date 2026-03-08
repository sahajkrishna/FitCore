import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Dumbbell, Heart, StretchHorizontal, Clock, Flame, CheckCircle2, Loader2, Bookmark, BookmarkCheck, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/use-premium-status";

// Exercise images
import imgBarbellSquat from "@/assets/exercises/barbell-squat.jpg";
import imgBenchPress from "@/assets/exercises/bench-press.jpg";
import imgDeadlift from "@/assets/exercises/deadlift.jpg";
import imgOverheadPress from "@/assets/exercises/overhead-press.jpg";
import imgPullUps from "@/assets/exercises/pull-ups.jpg";
import imgLunges from "@/assets/exercises/lunges.jpg";
import imgRunning from "@/assets/exercises/running.jpg";
import imgJumpRope from "@/assets/exercises/jump-rope.jpg";
import imgCycling from "@/assets/exercises/cycling.jpg";
import imgHiit from "@/assets/exercises/hiit.jpg";
import imgSwimming from "@/assets/exercises/swimming.jpg";
import imgRowing from "@/assets/exercises/rowing.jpg";
import imgYoga from "@/assets/exercises/yoga.jpg";
import imgDynamicStretching from "@/assets/exercises/dynamic-stretching.jpg";
import imgPilates from "@/assets/exercises/pilates.jpg";
import imgFoamRolling from "@/assets/exercises/foam-rolling.jpg";
import imgMobilityDrills from "@/assets/exercises/mobility-drills.jpg";
import imgTaiChi from "@/assets/exercises/tai-chi.jpg";

const categories = [
  {
    name: "Strength Training",
    key: "strength",
    icon: Dumbbell,
    color: "bg-accent/10 text-accent",
    badgeColor: "border-accent/30 text-accent",
    exercises: [
      { name: "Barbell Squat", muscle: "Legs", level: "Intermediate", duration: "45 min", calories: "320", image: imgBarbellSquat },
      { name: "Bench Press", muscle: "Chest", level: "Intermediate", duration: "40 min", calories: "280", image: imgBenchPress },
      { name: "Deadlift", muscle: "Back", level: "Advanced", duration: "50 min", calories: "350", image: imgDeadlift, premium: true },
      { name: "Overhead Press", muscle: "Shoulders", level: "Beginner", duration: "30 min", calories: "200", image: imgOverheadPress },
      { name: "Pull-Ups", muscle: "Back", level: "Intermediate", duration: "20 min", calories: "180", image: imgPullUps },
      { name: "Lunges", muscle: "Legs", level: "Beginner", duration: "25 min", calories: "220", image: imgLunges },
    ],
  },
  {
    name: "Cardio Workouts",
    key: "cardio",
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
    badgeColor: "border-destructive/30 text-destructive",
    exercises: [
      { name: "Running (5K)", muscle: "Full Body", level: "Beginner", duration: "30 min", calories: "350", image: imgRunning },
      { name: "Jump Rope", muscle: "Full Body", level: "Beginner", duration: "20 min", calories: "280", image: imgJumpRope },
      { name: "Cycling", muscle: "Legs", level: "Beginner", duration: "45 min", calories: "400", image: imgCycling },
      { name: "HIIT Circuit", muscle: "Full Body", level: "Intermediate", duration: "25 min", calories: "380", image: imgHiit },
      { name: "Swimming", muscle: "Full Body", level: "Intermediate", duration: "40 min", calories: "420", image: imgSwimming, premium: true },
      { name: "Rowing", muscle: "Upper Body", level: "Intermediate", duration: "30 min", calories: "300", image: imgRowing, premium: true },
    ],
  },
  {
    name: "Flexibility & Mobility",
    key: "flexibility",
    icon: StretchHorizontal,
    color: "bg-success/10 text-success",
    badgeColor: "border-success/30 text-success",
    exercises: [
      { name: "Yoga Flow", muscle: "Full Body", level: "Beginner", duration: "45 min", calories: "150", image: imgYoga },
      { name: "Dynamic Stretching", muscle: "Full Body", level: "Beginner", duration: "15 min", calories: "80", image: imgDynamicStretching },
      { name: "Pilates Core", muscle: "Core", level: "Intermediate", duration: "40 min", calories: "200", image: imgPilates },
      { name: "Foam Rolling", muscle: "Full Body", level: "Beginner", duration: "20 min", calories: "60", image: imgFoamRolling },
      { name: "Mobility Drills", muscle: "Joints", level: "Beginner", duration: "25 min", calories: "100", image: imgMobilityDrills },
      { name: "Tai Chi", muscle: "Full Body", level: "Beginner", duration: "30 min", calories: "120", image: imgTaiChi, premium: true },
    ],
  },
];

const levelColor = (l: string) =>
  l === "Beginner" ? "bg-success/10 text-success border-success/20" : l === "Intermediate" ? "bg-accent/10 text-accent border-accent/20" : "bg-destructive/10 text-destructive border-destructive/20";

const Workouts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium } = usePremiumStatus();
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [savedWorkouts, setSavedWorkouts] = useState<Set<string>>(new Set());
  const [loadingWorkout, setLoadingWorkout] = useState<string | null>(null);
  const [savingWorkout, setSavingWorkout] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Promise.all([
      supabase
        .from("workout_progress")
        .select("workout_name")
        .eq("user_id", user.id)
        .gte("date_completed", today.toISOString()),
      supabase
        .from("saved_workouts")
        .select("workout_name")
        .eq("user_id", user.id),
    ]).then(([completedRes, savedRes]) => {
      if (completedRes.data) setCompletedToday(new Set(completedRes.data.map((d) => d.workout_name)));
      if (savedRes.data) setSavedWorkouts(new Set(savedRes.data.map((d) => d.workout_name)));
    });
  }, [user]);

  const markComplete = async (workoutName: string, category: string, duration: string, calories: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to track your workouts.", variant: "destructive" });
      return;
    }
    setLoadingWorkout(workoutName);
    const { error } = await supabase.from("workout_progress").insert({
      user_id: user.id,
      workout_name: workoutName,
      category,
      duration,
      calories,
    });
    setLoadingWorkout(null);
    if (error) {
      toast({ title: "Error", description: "Could not log workout.", variant: "destructive" });
    } else {
      setCompletedToday((prev) => new Set(prev).add(workoutName));
      toast({ title: "Workout logged! 💪", description: `${workoutName} marked as completed.` });
    }
  };

  const toggleSave = async (workoutName: string, category: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save workouts.", variant: "destructive" });
      return;
    }
    setSavingWorkout(workoutName);
    const isSaved = savedWorkouts.has(workoutName);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_workouts")
        .delete()
        .eq("user_id", user.id)
        .eq("workout_name", workoutName);
      setSavingWorkout(null);
      if (!error) {
        setSavedWorkouts((prev) => {
          const next = new Set(prev);
          next.delete(workoutName);
          return next;
        });
        toast({ title: "Removed", description: `${workoutName} removed from saved workouts.` });
      }
    } else {
      const { error } = await supabase.from("saved_workouts").insert({
        user_id: user.id,
        workout_name: workoutName,
        category,
      });
      setSavingWorkout(null);
      if (!error) {
        setSavedWorkouts((prev) => new Set(prev).add(workoutName));
        toast({ title: "Saved! 🔖", description: `${workoutName} added to your saved workouts.` });
      }
    }
  };

  return (
    <Layout>
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h1 className="font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Workout Library</h1>
          <p className="mt-4 max-w-lg text-primary-foreground/70">Browse our curated collection of exercises organized by category. Perfect for all fitness levels.</p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        {categories.map((cat) => (
          <div key={cat.name} className="mb-16 last:mb-0">
            <div className="flex items-center gap-3 mb-8">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color}`}>
                <cat.icon className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">{cat.name}</h2>
              <Badge variant="secondary" className="ml-2">{cat.exercises.length} exercises</Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.exercises.map((ex) => {
                const isLocked = ex.premium && !isPremium;
                const done = completedToday.has(ex.name);
                const saved = savedWorkouts.has(ex.name);
                const isLoading = loadingWorkout === ex.name;
                const isSaving = savingWorkout === ex.name;

                return (
                  <div
                    key={ex.name}
                    className={`group overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${done ? "ring-2 ring-success/40" : ""} ${isLocked ? "opacity-80" : ""}`}
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                      {/* Level badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className={`text-xs backdrop-blur-sm bg-card/60 ${levelColor(ex.level)}`}>
                          {ex.level}
                        </Badge>
                      </div>
                      {/* Premium badge */}
                      {ex.premium && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className="text-[10px] backdrop-blur-sm bg-card/60 border-accent/30 text-accent gap-0.5">
                            <Lock className="h-2.5 w-2.5" /> Premium
                          </Badge>
                        </div>
                      )}
                      {/* Category badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="outline" className={`text-[10px] backdrop-blur-sm bg-card/60 ${cat.badgeColor}`}>
                          <cat.icon className="h-2.5 w-2.5 mr-0.5" /> {cat.name}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-heading text-base font-bold text-foreground">{ex.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{ex.muscle}</p>

                      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ex.duration}</span>
                        <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{ex.calories} cal</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        {isLocked ? (
                          <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                            <a href="/pricing"><Lock className="h-3 w-3" /> Upgrade to Unlock</a>
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant={done ? "success" : "coral"}
                              size="sm"
                              className="flex-1 gap-1"
                              disabled={done || isLoading}
                              onClick={() => markComplete(ex.name, cat.key, ex.duration, ex.calories)}
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : done ? (
                                <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</>
                              ) : (
                                <><Play className="h-3.5 w-3.5" /> Start Workout</>
                              )}
                            </Button>
                            <Button
                              variant={saved ? "secondary" : "outline"}
                              size="sm"
                              className="gap-1"
                              disabled={isSaving}
                              onClick={() => toggleSave(ex.name, cat.key)}
                            >
                              {isSaving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : saved ? (
                                <><BookmarkCheck className="h-3.5 w-3.5 text-accent" /> Saved</>
                              ) : (
                                <><Bookmark className="h-3.5 w-3.5" /> Save</>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default Workouts;
