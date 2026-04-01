import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Flame, Dumbbell, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RevealSection from "@/components/RevealSection";

const goals = [
  {
    id: "lose-fat",
    icon: Flame,
    title: "Lose Fat",
    description: "Burn calories and improve body composition with targeted cardio and HIIT programs.",
    redirect: "/programs/fat-loss",
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent",
  },
  {
    id: "build-muscle",
    icon: Dumbbell,
    title: "Build Muscle",
    description: "Gain strength and size with progressive overload and structured resistance training.",
    redirect: "/programs/strength-builder",
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary",
  },
  {
    id: "stay-fit",
    icon: Heart,
    title: "Stay Fit",
    description: "Maintain a healthy lifestyle with balanced workouts across all fitness categories.",
    redirect: "/workouts",
    color: "text-success",
    bg: "bg-success/10",
    ring: "ring-success",
  },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setSaving(true);

    // Save fitness goal to profile metadata
    await supabase
      .from("profiles")
      .update({ fitness_goal: selected } as any)
      .eq("user_id", user.id);

    const goal = goals.find((g) => g.id === selected);
    navigate(goal?.redirect || "/dashboard");
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="container max-w-2xl">
          <RevealSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Welcome to FitCore
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground">
                What's your fitness goal?
              </h1>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Choose your primary goal and we'll guide you to the best workouts and programs.
              </p>
            </div>
          </RevealSection>

          <div className="grid gap-4 sm:grid-cols-3">
            {goals.map((goal, i) => (
              <RevealSection key={goal.id} delay={i * 100}>
                <button
                  onClick={() => setSelected(goal.id)}
                  className={`w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${
                    selected === goal.id
                      ? `${goal.ring} border-current shadow-card-hover -translate-y-1`
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${goal.bg} mb-4`}>
                    <goal.icon className={`h-6 w-6 ${goal.color}`} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{goal.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{goal.description}</p>
                </button>
              </RevealSection>
            ))}
          </div>

          <RevealSection delay={400}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                variant="coral"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] gap-2"
                disabled={!selected || saving}
                onClick={handleContinue}
              >
                {saving ? "Setting up..." : "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          </RevealSection>
        </div>
      </section>
    </Layout>
  );
};

export default Onboarding;
