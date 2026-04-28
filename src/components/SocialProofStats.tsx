import { useEffect, useRef, useState } from "react";
import { Users, Sparkles, Crown, Dumbbell, TrendingUp, Target, LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  accent: "accent" | "success" | "destructive" | "primary";
}

const stats: Stat[] = [
  { icon: Users, value: 52000, suffix: "+", label: "Active Users", sublabel: "Training every week", accent: "accent" },
  { icon: Sparkles, value: 18400, suffix: "+", label: "AI Workout Plans Generated", sublabel: "Personalized & ready", accent: "success" },
  { icon: Crown, value: 4200, suffix: "+", label: "Premium Members", sublabel: "Unlocking full access", accent: "destructive" },
  { icon: Dumbbell, value: 1240000, suffix: "+", label: "Workouts Completed", sublabel: "By the FitCore community", accent: "primary" },
];

const accentMap = {
  accent: { text: "text-accent", bg: "bg-accent/10", ring: "ring-accent/20" },
  success: { text: "text-success", bg: "bg-success/10", ring: "ring-success/20" },
  destructive: { text: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/20" },
  primary: { text: "text-primary", bg: "bg-primary/10", ring: "ring-primary/20" },
};

const formatValue = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const AnimatedCounter = ({ target, start, duration = 2000 }: { target: number; start: boolean; duration?: number }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.floor(easeOutCubic(p) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, target, duration]);

  return <>{formatValue(value)}</>;
};

const SocialProofStats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-secondary/30 py-20 md:py-28"
    >
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-success/5 blur-3xl" />

      <div className="container relative z-10">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <TrendingUp className="h-3.5 w-3.5" /> Trusted Worldwide
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-primary md:text-4xl">
            Join a Thriving <span className="text-accent">Fitness Community</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real numbers from a real community pushing their limits with FitCore every day.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
            const c = accentMap[s.accent];
            return (
              <div
                key={s.label}
                className={`group relative rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all duration-700 hover:-translate-y-2 hover:shadow-card-hover ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} ring-4 ${c.ring} transition-transform duration-300 group-hover:scale-110`}
                >
                  <s.icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className={`font-heading text-4xl font-extrabold ${c.text} tabular-nums`}>
                    <AnimatedCounter target={s.value} start={visible} duration={2000 + i * 200} />
                  </span>
                  {s.suffix && (
                    <span className={`font-heading text-2xl font-bold ${c.text}`}>{s.suffix}</span>
                  )}
                </div>
                <p className="mt-2 font-heading text-sm font-bold text-foreground">{s.label}</p>
                {s.sublabel && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.sublabel}</p>
                )}
                <div
                  className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl ${c.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </div>
            );
          })}
        </div>

        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground transition-all duration-700 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-accent" /> 200+ Expert Workouts
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-success" /> AI-Powered Plans
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-destructive" /> 95% Success Rate
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofStats;