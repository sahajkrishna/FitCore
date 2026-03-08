import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Flame, ArrowLeft, Loader2, Zap, Heart, Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import challengeImg from "@/assets/programs/30-day-challenge.jpg";

const days = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const workoutPool = [
    { name: `Day ${dayNum}: Full Body Blast`, duration: "25 min", calories: "300", icon: Zap },
    { name: `Day ${dayNum}: Cardio Rush`, duration: "20 min", calories: "280", icon: Heart },
    { name: `Day ${dayNum}: Strength Circuit`, duration: "30 min", calories: "320", icon: Dumbbell },
    { name: `Day ${dayNum}: Core Crusher`, duration: "20 min", calories: "200", icon: Zap },
    { name: `Day ${dayNum}: HIIT Express`, duration: "15 min", calories: "250", icon: Heart },
    { name: `Day ${dayNum}: Power Endurance`, duration: "30 min", calories: "350", icon: Dumbbell },
    { name: `Day ${dayNum}: Active Recovery`, duration: "20 min", calories: "120", icon: Heart },
  ];
  return workoutPool[i % workoutPool.length];
});

// Group into weeks
const weeks = [
  { week: 1, title: "Getting Started", workouts: days.slice(0, 7) },
  { week: 2, title: "Building Momentum", workouts: days.slice(7, 14) },
  { week: 3, title: "Pushing Limits", workouts: days.slice(14, 21) },
  { week: 4, title: "Finish Strong", workouts: days.slice(21, 30) },
];

const ThirtyDayChallenge = () => {
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
      .eq("category", "30-day-challenge")
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
      category: "30-day-challenge",
      duration,
      calories,
    });
    setLoading(null);
    if (error) {
      toast({ title: "Error", description: "Could not log workout.", variant: "destructive" });
    } else {
      setCompleted((prev) => new Set(prev).add(name));
      toast({ title: "Day completed! 🎯", description: `${name} marked as done.` });
    }
  };

  const totalWorkouts = 30;
  const completedCount = days.filter((d) => completed.has(d.name)).length;
  const progress = Math.round((completedCount / totalWorkouts) * 100);

  return (
    <Layout>
      <section className="relative overflow-hidden bg-primary">
        <img src={challengeImg} alt="30 Day Challenge" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-success/40 text-success bg-success/10 backdrop-blur-sm">Beginner</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 30 Days
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">30 Day Fitness Challenge</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            One workout every day for 30 days. Build the habit, build the body. No equipment needed — just show up.
          </p>
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm text-primary-foreground/60 mb-2">
              <span>{completedCount} of {totalWorkouts} days completed</span>
              <span className="font-bold text-accent">{progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-primary-foreground/10">
              <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {/* Day completion grid overview */}
        <div className="mb-10 rounded-xl bg-card p-5 shadow-card">
          <h3 className="font-heading text-sm font-bold text-primary mb-3">Progress Tracker</h3>
          <div className="flex flex-wrap gap-1.5">
            {days.map((d, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  completed.has(d.name)
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {weeks.map((w, i) => {
            const weekCompleted = w.workouts.filter((wo) => completed.has(wo.name)).length;
            const allDone = weekCompleted === w.workouts.length;
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(i)}
                className={`flex-shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeWeek === i ? "bg-primary text-primary-foreground shadow-card" : "bg-card text-muted-foreground hover:bg-secondary"
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

        <div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-2">
            Week {weeks[activeWeek].week}: {weeks[activeWeek].title}
          </h2>
          <p className="text-muted-foreground mb-8">Complete one workout every day — no excuses!</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeks[activeWeek].workouts.map((wo) => {
              const done = completed.has(wo.name);
              const isLoading = loading === wo.name;
              const IconComp = wo.icon;
              return (
                <div key={wo.name} className={`group overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${done ? "ring-2 ring-success/40" : ""}`}>
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${done ? "bg-success/10" : "bg-accent/10"}`}>
                        {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <IconComp className="h-5 w-5 text-accent" />}
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{wo.duration}</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{wo.calories} cal</span>
                    </div>
                    <Button variant={done ? "success" : "coral"} size="sm" className="mt-4 w-full gap-1" disabled={done || isLoading} onClick={() => markComplete(wo.name, wo.duration, wo.calories)}>
                      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : done ? <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</> : <><Circle className="h-3.5 w-3.5" /> Mark Complete</>}
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

export default ThirtyDayChallenge;
