import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Brain, Zap, Target } from "lucide-react";
import RevealSection from "@/components/RevealSection";

const AiWorkoutCTA = () => (
  <section className="relative overflow-hidden bg-background py-20 md:py-28">
    {/* Background accents */}
    <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" style={{ animation: "float-blob 10s ease-in-out infinite" }} />
    <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-success/5 blur-3xl" style={{ animation: "float-blob 8s ease-in-out 2s infinite" }} />

    <div className="container relative z-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 p-10 md:p-14 shadow-2xl">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-4">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-foreground leading-tight">
              Generate Your Personalized Workout Plan
            </h2>
            <p className="mt-4 text-primary-foreground/70 leading-relaxed">
              Tell us your goals, experience level, and schedule. Our AI creates a tailored multi-day workout plan designed just for you.
            </p>
            <Button variant="coral" size="lg" className="mt-6 gap-2" asChild>
              <Link to="/ai-workout">
                Try AI Generator <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              { icon: Brain, label: "Smart Planning", desc: "AI-tailored to you" },
              { icon: Zap, label: "Instant Plans", desc: "Ready in seconds" },
              { icon: Target, label: "Goal Focused", desc: "Aligned to targets" },
              { icon: Sparkles, label: "Personalized", desc: "Unique each time" },
            ].map((feat) => (
              <div key={feat.label} className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <feat.icon className="h-5 w-5 text-accent mb-2" />
                <p className="text-sm font-semibold text-primary-foreground">{feat.label}</p>
                <p className="text-xs text-primary-foreground/60">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AiWorkoutCTA;
