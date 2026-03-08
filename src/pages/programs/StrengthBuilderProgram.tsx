import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Flame, ArrowLeft, Loader2, Dumbbell, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import strengthImg from "@/assets/programs/strength-builder.jpg";

const weeks = [
  {
    week: 1,
    title: "Foundation Phase",
    workouts: [
      { day: "Monday", name: "SB: Bench Press Basics", duration: "45 min", calories: "280", icon: Dumbbell },
      { day: "Tuesday", name: "SB: Squat Foundation", duration: "50 min", calories: "320", icon: Dumbbell },
      { day: "Thursday", name: "SB: Deadlift Form", duration: "45 min", calories: "300", icon: Dumbbell },
      { day: "Friday", name: "SB: Overhead Press", duration: "40 min", calories: "250", icon: Dumbbell },
      { day: "Saturday", name: "SB: Accessory Work A", duration: "35 min", calories: "200", icon: Zap },
    ],
  },
  {
    week: 2,
    title: "Volume Phase",
    workouts: [
      { day: "Monday", name: "SB: Bench 4×8", duration: "50 min", calories: "300", icon: Dumbbell },
      { day: "Tuesday", name: "SB: Squat 4×8", duration: "55 min", calories: "350", icon: Dumbbell },
      { day: "Thursday", name: "SB: Deadlift 3×8", duration: "50 min", calories: "340", icon: Dumbbell },
      { day: "Friday", name: "SB: Press 4×8", duration: "45 min", calories: "270", icon: Dumbbell },
      { day: "Saturday", name: "SB: Accessory Work B", duration: "40 min", calories: "230", icon: Zap },
    ],
  },
  {
    week: 3,
    title: "Strength Phase",
    workouts: [
      { day: "Monday", name: "SB: Bench 5×5", duration: "55 min", calories: "320", icon: Dumbbell },
      { day: "Tuesday", name: "SB: Squat 5×5", duration: "60 min", calories: "380", icon: Dumbbell },
      { day: "Thursday", name: "SB: Deadlift 5×3", duration: "55 min", calories: "360", icon: Dumbbell },
      { day: "Friday", name: "SB: Press 5×5", duration: "50 min", calories: "290", icon: Dumbbell },
      { day: "Saturday", name: "SB: Accessory Work C", duration: "40 min", calories: "240", icon: Zap },
    ],
  },
  {
    week: 4,
    title: "Peak Phase",
    workouts: [
      { day: "Monday", name: "SB: Bench Max Test", duration: "60 min", calories: "350", icon: Zap },
      { day: "Tuesday", name: "SB: Squat Max Test", duration: "60 min", calories: "400", icon: Zap },
      { day: "Thursday", name: "SB: Deadlift Max Test", duration: "55 min", calories: "380", icon: Zap },
      { day: "Friday", name: "SB: Press Max Test", duration: "50 min", calories: "310", icon: Zap },
      { day: "Saturday", name: "SB: Deload & Recovery", duration: "30 min", calories: "150", icon: Dumbbell },
    ],
  },
];

const StrengthBuilderProgram = () => {
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
      .eq("category", "strength-builder-program")
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
      category: "strength-builder-program",
      duration,
      calories,
    });
    setLoading(null);
    if (error) {
      toast({ title: "Error", description: "Could not log workout.", variant: "destructive" });
    } else {
      setCompleted((prev) => new Set(prev).add(name));
      toast({ title: "Workout completed! 💪", description: `${name} marked as done.` });
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
      <section className="relative overflow-hidden bg-primary">
        <img src={strengthImg} alt="Strength Builder" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/10 backdrop-blur-sm">Advanced</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 12 Weeks (4-week cycle shown)
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Strength Builder</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            A progressive overload program focused on the big four compound lifts. Build raw strength through periodized training phases.
          </p>
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

      <section className="container py-12 md:py-16">
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
          <p className="text-muted-foreground mb-8">Focus on progressive overload — add weight each week.</p>

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
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{wo.day}</p>
                        <h3 className="font-heading text-base font-bold text-primary">{wo.name.replace("SB: ", "")}</h3>
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

export default StrengthBuilderProgram;
