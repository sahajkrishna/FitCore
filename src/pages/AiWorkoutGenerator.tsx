import { useState, useEffect, useRef } from "react";
import {
  Sparkles, Dumbbell, Flame, Zap, Target, Calendar, TrendingUp,
  Loader2, Clock, Coffee, Trophy, ChevronDown, ChevronUp, Save, Check, PartyPopper,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import FloatingFitnessIcons from "@/components/FloatingFitnessIcons";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  isRestDay: boolean;
  focus: string;
  duration: string;
  motivationalTip: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  title: string;
  summary: string;
  days: WorkoutDay[];
}

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", icon: Target, desc: "New to fitness" },
  { value: "intermediate", label: "Intermediate", icon: TrendingUp, desc: "Some experience" },
  { value: "advanced", label: "Advanced", icon: Zap, desc: "Seasoned athlete" },
];

const LOADING_MESSAGES = [
  "Building your personalized workout...",
  "Analyzing your fitness goals...",
  "Selecting the best exercises for you...",
  "Crafting your weekly schedule...",
  "Adding rest days for recovery...",
  "Almost there — finalizing your plan...",
];

const DAY_COLORS: Record<string, string> = {
  Monday: "from-accent/20 to-accent/5",
  Tuesday: "from-primary/20 to-primary/5",
  Wednesday: "from-success/20 to-success/5",
  Thursday: "from-accent/20 to-accent/5",
  Friday: "from-primary/20 to-primary/5",
  Saturday: "from-success/20 to-success/5",
  Sunday: "from-muted/40 to-muted/10",
};

const DayCard = ({ day, index }: { day: WorkoutDay; index: number }) => {
  const [expanded, setExpanded] = useState(!day.isRestDay);
  const gradient = DAY_COLORS[day.day] || "from-muted/20 to-muted/5";

  return (
    <Card
      className="overflow-hidden border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 animate-scale-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left bg-gradient-to-r ${gradient}`}
      >
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            {day.isRestDay ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Coffee className="h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Dumbbell className="h-5 w-5 text-accent" />
              </div>
            )}
            <div>
              <CardTitle className="text-base">{day.day}</CardTitle>
              <p className="text-sm text-muted-foreground">{day.focus}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!day.isRestDay && (
              <Badge variant="secondary" className="gap-1 font-normal">
                <Clock className="h-3 w-3" /> {day.duration}
              </Badge>
            )}
            {day.isRestDay ? (
              <Badge variant="outline" className="text-muted-foreground">Rest</Badge>
            ) : (
              expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
      </button>

      {expanded && !day.isRestDay && (
        <CardContent className="px-6 pb-5 pt-0 space-y-3">
          {/* Exercises table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Exercise</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Sets</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Reps</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Rest</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">{ex.name}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{ex.sets}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{ex.reps}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{ex.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Motivational tip */}
          <div className="flex items-start gap-2 rounded-lg bg-accent/5 p-3">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm text-foreground/80 italic">{day.motivationalTip}</p>
          </div>
        </CardContent>
      )}

      {expanded && day.isRestDay && (
        <CardContent className="px-6 pb-5 pt-0">
          <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
            <Coffee className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground italic">{day.motivationalTip}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const AiWorkoutGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const msgInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      let idx = 0;
      setLoadingMsg(LOADING_MESSAGES[0]);
      msgInterval.current = setInterval(() => {
        idx = (idx + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[idx]);
      }, 2500);
    } else {
      if (msgInterval.current) clearInterval(msgInterval.current);
    }
    return () => { if (msgInterval.current) clearInterval(msgInterval.current); };
  }, [loading]);

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Please sign in to save plans", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!plan) return;

    setSaving(true);
    const { error } = await supabase.from("ai_workout_plans" as any).insert({
      user_id: user.id,
      fitness_goal: goal,
      experience_level: level,
      days_per_week: parseInt(daysPerWeek),
      workout_plan: plan,
    } as any);

    if (error) {
      console.error(error);
      toast({ title: "Failed to save plan", variant: "destructive" });
    } else {
      setSaved(true);
      toast({ title: "Plan saved!", description: "View it on your dashboard." });
    }
    setSaving(false);
  };

  const handleGenerate = async () => {
    if (!goal.trim() || !level || !daysPerWeek) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    setPlan(null);
    setSaved(false);
    setShowSuccess(false);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-workout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ goal, level, daysPerWeek }),
        }
      );

      if (resp.status === 429) {
        toast({ title: "Too many requests — please try again shortly.", variant: "destructive" });
        return;
      }
      if (resp.status === 402) {
        toast({ title: "AI credits exhausted. Please try later.", variant: "destructive" });
        return;
      }
      if (!resp.ok) throw new Error("Failed to generate");

      const data: WorkoutPlan = await resp.json();
      setPlan(data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const workoutDays = plan?.days.filter((d) => !d.isRestDay).length ?? 0;
  const restDays = plan?.days.filter((d) => d.isRestDay).length ?? 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80 py-20 text-primary-foreground">
        <FloatingFitnessIcons />
        <div className="container relative z-10 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" /> AI‑Powered
          </div>
          <h1 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">
            AI Workout Generator
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Describe your fitness goal and let AI craft a personalised workout plan in seconds.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="container -mt-10 relative z-20 pb-20">
        <Card className="mx-auto max-w-2xl shadow-[var(--shadow-card-hover)] border-0 animate-scale-in">
          <CardContent className="space-y-8 p-8">
            {/* Goal */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Flame className="h-4 w-4 text-accent" /> Fitness Goal
              </Label>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="I want to lose belly fat in 30 days"
                className="min-h-[100px] resize-none text-base"
                maxLength={500}
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Dumbbell className="h-4 w-4 text-accent" /> Experience Level
              </Label>
              <RadioGroup value={level} onValueChange={setLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <label
                      key={l.value}
                      className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                        level === l.value
                          ? "border-accent bg-accent/5 shadow-md"
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <RadioGroupItem value={l.value} className="sr-only" />
                      <Icon className={`h-6 w-6 ${level === l.value ? "text-accent" : "text-muted-foreground"}`} />
                      <span className="font-semibold">{l.label}</span>
                      <span className="text-xs text-muted-foreground">{l.desc}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Days per week */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Calendar className="h-4 w-4 text-accent" /> Workout Days per Week
              </Label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} {d === 1 ? "day" : "days"} / week
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate */}
            <Button
              variant="coral"
              size="lg"
              className="w-full text-base"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Generating your plan…</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Generate Workout Plan</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {plan && (
          <div className="mx-auto mt-10 max-w-2xl space-y-6 animate-scale-in">
            {/* Plan header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <Trophy className="h-4 w-4" /> Plan Generated
              </div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">{plan.title}</h2>
              <p className="text-muted-foreground">{plan.summary}</p>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
                  <Dumbbell className="h-3.5 w-3.5" /> {workoutDays} workout days
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
                  <Coffee className="h-3.5 w-3.5" /> {restDays} rest days
                </Badge>
              </div>
              <Button
                variant={saved ? "secondary" : "coral"}
                size="sm"
                className="gap-1.5"
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saved ? <><Check className="h-4 w-4" /> Saved to Dashboard</> : saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Plan</>}
              </Button>
            </div>

            {/* Day cards */}
            <div className="space-y-3">
              {plan.days.map((day, i) => (
                <DayCard key={day.day} day={day} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AiWorkoutGenerator;
