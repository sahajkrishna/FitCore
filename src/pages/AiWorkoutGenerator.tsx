import { useState } from "react";
import { Sparkles, Dumbbell, Flame, Zap, Target, Calendar, TrendingUp, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FloatingFitnessIcons from "@/components/FloatingFitnessIcons";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", icon: Target, desc: "New to fitness" },
  { value: "intermediate", label: "Intermediate", icon: TrendingUp, desc: "Some experience" },
  { value: "advanced", label: "Advanced", icon: Zap, desc: "Seasoned athlete" },
];

const AiWorkoutGenerator = () => {
  const { toast } = useToast();
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim() || !level || !daysPerWeek) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    setPlan("");

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
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "AI credits exhausted. Please try later.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to generate");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) { result += c; setPlan(result); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
                <><Loader2 className="h-5 w-5 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Generate Workout Plan</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {plan && (
          <Card className="mx-auto mt-8 max-w-2xl border-0 shadow-[var(--shadow-card-hover)] animate-scale-in">
            <CardContent className="p-8">
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
                <Zap className="h-5 w-5 text-accent" /> Your Workout Plan
              </h2>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground/90">
                {plan}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </Layout>
  );
};

export default AiWorkoutGenerator;
