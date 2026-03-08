import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Dumbbell, Heart, StretchHorizontal, Clock, Flame, BarChart3, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  {
    name: "Strength",
    key: "strength",
    icon: Dumbbell,
    color: "bg-accent/10 text-accent",
    exercises: [
      { name: "Barbell Squat", muscle: "Legs", level: "Intermediate", duration: "45 min", calories: "320" },
      { name: "Bench Press", muscle: "Chest", level: "Intermediate", duration: "40 min", calories: "280" },
      { name: "Deadlift", muscle: "Back", level: "Advanced", duration: "50 min", calories: "350" },
      { name: "Overhead Press", muscle: "Shoulders", level: "Beginner", duration: "30 min", calories: "200" },
      { name: "Pull-Ups", muscle: "Back", level: "Intermediate", duration: "20 min", calories: "180" },
      { name: "Lunges", muscle: "Legs", level: "Beginner", duration: "25 min", calories: "220" },
    ],
  },
  {
    name: "Cardio",
    key: "cardio",
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
    exercises: [
      { name: "Running (5K)", muscle: "Full Body", level: "Beginner", duration: "30 min", calories: "350" },
      { name: "Jump Rope", muscle: "Full Body", level: "Beginner", duration: "20 min", calories: "280" },
      { name: "Cycling", muscle: "Legs", level: "Beginner", duration: "45 min", calories: "400" },
      { name: "HIIT Circuit", muscle: "Full Body", level: "Intermediate", duration: "25 min", calories: "380" },
      { name: "Swimming", muscle: "Full Body", level: "Intermediate", duration: "40 min", calories: "420" },
      { name: "Rowing", muscle: "Upper Body", level: "Intermediate", duration: "30 min", calories: "300" },
    ],
  },
  {
    name: "Flexibility",
    key: "flexibility",
    icon: StretchHorizontal,
    color: "bg-success/10 text-success",
    exercises: [
      { name: "Yoga Flow", muscle: "Full Body", level: "Beginner", duration: "45 min", calories: "150" },
      { name: "Dynamic Stretching", muscle: "Full Body", level: "Beginner", duration: "15 min", calories: "80" },
      { name: "Pilates Core", muscle: "Core", level: "Intermediate", duration: "40 min", calories: "200" },
      { name: "Foam Rolling", muscle: "Full Body", level: "Beginner", duration: "20 min", calories: "60" },
      { name: "Mobility Drills", muscle: "Joints", level: "Beginner", duration: "25 min", calories: "100" },
      { name: "Tai Chi", muscle: "Full Body", level: "Beginner", duration: "30 min", calories: "120" },
    ],
  },
];

const levelColor = (l: string) =>
  l === "Beginner" ? "bg-success/10 text-success border-success/20" : l === "Intermediate" ? "bg-accent/10 text-accent border-accent/20" : "bg-destructive/10 text-destructive border-destructive/20";

const Workouts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [loadingWorkout, setLoadingWorkout] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    supabase
      .from("workout_progress")
      .select("workout_name")
      .eq("user_id", user.id)
      .gte("date_completed", today.toISOString())
      .then(({ data }) => {
        if (data) setCompletedToday(new Set(data.map((d) => d.workout_name)));
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.exercises.map((ex) => {
                const done = completedToday.has(ex.name);
                const isLoading = loadingWorkout === ex.name;
                return (
                  <div key={ex.name} className={`group rounded-xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 ${done ? "ring-2 ring-success/40" : ""}`}>
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading text-base font-bold text-primary">{ex.name}</h3>
                      <Badge variant="outline" className={`text-xs ${levelColor(ex.level)}`}>{ex.level}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{ex.muscle}</p>
                    <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ex.duration}</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{ex.calories} cal</span>
                      <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{ex.level}</span>
                    </div>
                    <Button
                      variant={done ? "success" : "coral"}
                      size="sm"
                      className="w-full mt-4"
                      disabled={done || isLoading}
                      onClick={() => markComplete(ex.name, cat.key, ex.duration, ex.calories)}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : "Mark Complete"}
                    </Button>
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
