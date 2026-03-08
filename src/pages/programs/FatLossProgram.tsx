import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Flame, ArrowLeft, Loader2, Dumbbell, Zap, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import fatLossImg from "@/assets/programs/fat-loss.jpg";

const weeks = [
  {
    week: 1,
    title: "Foundation Week",
    workouts: [
      { day: "Monday", name: "HIIT Cardio Blast", duration: "30 min", calories: "350", icon: Heart },
      { day: "Tuesday", name: "Upper Body Circuit", duration: "35 min", calories: "280", icon: Dumbbell },
      { day: "Wednesday", name: "Active Recovery Walk", duration: "20 min", calories: "120", icon: Heart },
      { day: "Thursday", name: "Lower Body Burn", duration: "40 min", calories: "320", icon: Dumbbell },
      { day: "Friday", name: "Full Body HIIT", duration: "30 min", calories: "380", icon: Zap },
      { day: "Saturday", name: "Core & Cardio", duration: "25 min", calories: "250", icon: Heart },
    ],
  },
  {
    week: 2,
    title: "Ramp Up",
    workouts: [
      { day: "Monday", name: "Tabata Intervals", duration: "25 min", calories: "320", icon: Zap },
      { day: "Tuesday", name: "Push-Pull Circuit", duration: "40 min", calories: "300", icon: Dumbbell },
      { day: "Wednesday", name: "Steady-State Cardio", duration: "35 min", calories: "280", icon: Heart },
      { day: "Thursday", name: "Metabolic Legs", duration: "40 min", calories: "360", icon: Dumbbell },
      { day: "Friday", name: "AMRAP Challenge", duration: "30 min", calories: "400", icon: Zap },
      { day: "Saturday", name: "Yoga & Stretch", duration: "30 min", calories: "100", icon: Heart },
    ],
  },
  {
    week: 3,
    title: "Peak Intensity",
    workouts: [
      { day: "Monday", name: "Sprint Intervals", duration: "25 min", calories: "380", icon: Zap },
      { day: "Tuesday", name: "Superset Upper Body", duration: "40 min", calories: "320", icon: Dumbbell },
      { day: "Wednesday", name: "Recovery Cardio", duration: "25 min", calories: "150", icon: Heart },
      { day: "Thursday", name: "Plyometric Legs", duration: "35 min", calories: "400", icon: Zap },
      { day: "Friday", name: "Full Body Burner", duration: "35 min", calories: "420", icon: Zap },
      { day: "Saturday", name: "Core Finisher", duration: "20 min", calories: "180", icon: Dumbbell },
    ],
  },
  {
    week: 4,
    title: "Final Push",
    workouts: [
      { day: "Monday", name: "HIIT Max Effort", duration: "30 min", calories: "420", icon: Zap },
      { day: "Tuesday", name: "Total Body Strength", duration: "45 min", calories: "380", icon: Dumbbell },
      { day: "Wednesday", name: "Incline Walk", duration: "30 min", calories: "200", icon: Heart },
      { day: "Thursday", name: "Leg Day Finisher", duration: "40 min", calories: "380", icon: Dumbbell },
      { day: "Friday", name: "The Grand Finale", duration: "35 min", calories: "450", icon: Zap },
      { day: "Saturday", name: "Celebration Stretch", duration: "25 min", calories: "100", icon: Heart },
    ],
  },
];

const FatLossProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("workout_progress")
      .select("workout_name")
      .eq("user_id", user.id)
      .eq("category", "fat-loss-program")
      .then(({ data }) => {
        if (data) setCompleted(new Set(data.map((d) => d.workout_name)));
      });
  }, [user]);

  const markComplete = async (name: string, duration: string, calories: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to track progress.", variant: "destructive" });
      return;
    }
    setLoading(name);
    const { error } = await supabase.from("workout_progress").insert({
      user_id: user.id,
      workout_name: name,
      category: "fat-loss-program",
      duration,
      calories,
    });
    setLoading(null);
    if (error) {
      toast({ title: "Error", description: "Could not log workout.", variant: "destructive" });
    } else {
      setCompleted((prev) => new Set(prev).add(name));
      toast({ title: "Workout completed! 🔥", description: `${name} marked as done.` });
    }
  };

  const totalWorkouts = weeks.reduce((a, w) => a + w.workouts.length, 0);
  const completedCount = weeks.reduce(
    (a, w) => a + w.workouts.filter((wo) => completed.has(wo.name)).length,
    0
  );
  const progress = totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <img src={fatLossImg} alt="Fat Loss Program" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/10 backdrop-blur-sm">Intermediate</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 4 Weeks
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Fat Loss Program</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            A 4-week high-intensity program combining HIIT, strength circuits, and active recovery to maximize fat burn and build lean muscle.
          </p>

          {/* Progress bar */}
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm text-primary-foreground/60 mb-2">
              <span>{completedCount} of {totalWorkouts} workouts completed</span>
              <span className="font-bold text-accent">{progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-primary-foreground/10">
              <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Weekly plan */}
      <section className="container py-12 md:py-16">
        {/* Week tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {weeks.map((w, i) => {
            const weekCompleted = w.workouts.filter((wo) => completed.has(wo.name)).length;
            const allDone = weekCompleted === w.workouts.length;
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(i)}
                className={`flex-shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeWeek === i
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                <span className="block">Week {w.week}</span>
                <span className={`block text-xs mt-0.5 ${activeWeek === i ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                  {allDone ? "✓ Complete" : `${weekCompleted}/${w.workouts.length}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active week */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-2">
            Week {weeks[activeWeek].week}: {weeks[activeWeek].title}
          </h2>
          <p className="text-muted-foreground mb-8">Complete each workout to progress through the program.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeks[activeWeek].workouts.map((wo) => {
              const done = completed.has(wo.name);
              const isLoading = loading === wo.name;
              const IconComp = wo.icon;

              return (
                <div
                  key={wo.name}
                  className={`group overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${done ? "ring-2 ring-success/40" : ""}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${done ? "bg-success/10" : "bg-accent/10"}`}>
                          {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <IconComp className="h-5 w-5 text-accent" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{wo.day}</p>
                          <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{wo.duration}</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{wo.calories} cal</span>
                    </div>

                    <Button
                      variant={done ? "success" : "coral"}
                      size="sm"
                      className="mt-4 w-full gap-1"
                      disabled={done || isLoading}
                      onClick={() => markComplete(wo.name, wo.duration, wo.calories)}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : done ? (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</>
                      ) : (
                        <><Circle className="h-3.5 w-3.5" /> Mark Complete</>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FatLossProgram;
