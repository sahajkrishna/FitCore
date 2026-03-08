import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, Dumbbell, Heart, Zap, Target, Users, TrendingUp, Quote, Flame, Timer, Activity } from "lucide-react";
import TransformationResults from "@/components/TransformationResults";

import heroImg from "@/assets/hero-dashboard.jpg";
import strengthImg from "@/assets/category-strength.jpg";
import cardioImg from "@/assets/category-cardio.jpg";
import flexImg from "@/assets/category-flexibility.jpg";

const categories = [
  { img: strengthImg, icon: Dumbbell, title: "Build Strength", desc: "Power up with effective strength training routines.", link: "/workouts" },
  { img: cardioImg, icon: Zap, title: "Boost Endurance", desc: "Improve stamina with energizing cardio workouts.", link: "/workouts" },
  { img: flexImg, icon: Heart, title: "Move Better", desc: "Stretch and recover with flexibility training.", link: "/workouts" },
];

const stats = [
  { icon: Target, value: "200+", label: "Exercises" },
  { icon: Users, value: "50K+", label: "Community Members" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
];

const floatingIcons = [
  { Icon: Dumbbell, size: 20, x: "8%", y: "15%", delay: 0, duration: 6 },
  { Icon: Flame, size: 16, x: "85%", y: "20%", delay: 1.5, duration: 7 },
  { Icon: Heart, size: 14, x: "75%", y: "70%", delay: 3, duration: 5.5 },
  { Icon: Timer, size: 18, x: "12%", y: "75%", delay: 2, duration: 8 },
  { Icon: Activity, size: 16, x: "92%", y: "50%", delay: 4, duration: 6.5 },
  { Icon: Zap, size: 15, x: "50%", y: "10%", delay: 1, duration: 7.5 },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  const handleScroll = useCallback(() => {
    setOffset(window.scrollY);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return offset;
}

const FloatingIcon = ({ Icon, size, x, y, delay, duration }: typeof floatingIcons[0]) => (
  <div
    className="absolute pointer-events-none text-primary-foreground/10"
    style={{
      left: x,
      top: y,
      animation: `float-icon ${duration}s ease-in-out ${delay}s infinite`,
    }}
  >
    <Icon size={size} />
  </div>
);

const Index = () => {
  const quote = useInView();
  const cats = useInView();
  const statsSection = useInView();
  const cta = useInView();
  const scrollY = useParallax();

  return (
    <Layout>
      {/* Hero with parallax */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Athletes training in a gym"
          className="absolute inset-0 h-[110%] w-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.92), hsl(var(--primary) / 0.65) 50%, hsl(var(--accent) / 0.35))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 8s ease infinite",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--primary)/0.7)_100%)]" />

        {/* Floating fitness icons */}
        {floatingIcons.map((fi, i) => (
          <FloatingIcon key={i} {...fi} />
        ))}

        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl" style={{ transform: `translateY(${scrollY * -0.08}px)` }}>
            <span
              className="inline-block rounded-full bg-accent/20 px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-sm opacity-0"
              style={{ animation: "reveal-up 0.7s ease-out 0.2s forwards" }}
            >
              Your Fitness Journey Starts Here
            </span>
            <h1
              className="mt-8 font-heading text-4xl font-extrabold leading-[1.1] text-primary-foreground sm:text-5xl md:text-7xl opacity-0"
              style={{ animation: "reveal-up 0.8s ease-out 0.4s forwards" }}
            >
              Build Your <span className="text-accent">Strongest Self</span> with FitCore
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl opacity-0"
              style={{ animation: "reveal-up 0.8s ease-out 0.6s forwards" }}
            >
              Train smarter, stay consistent, and transform your fitness journey.
            </p>
            <div
              className="mt-10 flex flex-wrap gap-4 opacity-0"
              style={{ animation: "reveal-up 0.8s ease-out 0.8s forwards" }}
            >
              <Button variant="coral" size="lg" className="animate-pulse-glow" asChild>
                <Link to="/workouts">
                  Start Your Workout <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm" asChild>
                <Link to="/workouts">Explore Workouts</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Motivational Quote */}
      <section ref={quote.ref} className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2b4a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        {/* Floating accent blobs */}
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-accent/5 blur-2xl" style={{ animation: "float-blob 10s ease-in-out infinite" }} />
        <div className="absolute right-16 bottom-8 h-24 w-24 rounded-full bg-success/5 blur-2xl" style={{ animation: "float-blob 8s ease-in-out 2s infinite" }} />

        <div className={`container text-center transition-all duration-1000 ${quote.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Quote className={`mx-auto h-10 w-10 text-accent/40 transition-transform duration-1000 ${quote.visible ? "scale-100 rotate-0" : "scale-50 -rotate-12"}`} />
          <blockquote className="mx-auto mt-6 max-w-3xl font-heading text-2xl font-bold leading-snug text-primary sm:text-3xl md:text-4xl">
            "The only bad workout is the one that{" "}
            <span className="text-accent">didn't happen.</span>"
          </blockquote>
          <div className={`mx-auto mt-6 h-1 rounded-full bg-accent transition-all duration-1000 delay-300 ${quote.visible ? "w-16" : "w-0"}`} />
        </div>
      </section>

      {/* Stats */}
      <section ref={statsSection.ref} className="border-y border-border bg-card">
        <div className="container grid grid-cols-1 divide-y divide-border py-0 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-2 py-10 text-center transition-all duration-700 ${statsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-transform duration-700 ${statsSection.visible ? "scale-100" : "scale-0"}`} style={{ transitionDelay: `${i * 200 + 100}ms` }}>
                <s.icon className="h-5 w-5 text-accent" />
              </div>
              <span className="font-heading text-3xl font-bold text-primary md:text-4xl">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Workout Categories */}
      <section ref={cats.ref} className="relative overflow-hidden bg-background py-20 md:py-28">
        {/* Animated gradient blobs */}
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" style={{ animation: "float-blob 12s ease-in-out infinite" }} />
        <div className="absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-success/5 blur-3xl" style={{ animation: "float-blob 9s ease-in-out 3s infinite" }} />

        <div className="container">
          <div className={`mx-auto max-w-xl text-center transition-all duration-700 ${cats.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Train Your Way</span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">Workout Categories</h2>
            <p className="mt-4 text-muted-foreground">Choose your focus area and start training with expert-designed programs.</p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {categories.map((c, i) => (
              <Link
                key={c.title}
                to={c.link}
                className={`group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-3 ${cats.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
                style={{ transitionDelay: `${(i + 1) * 200}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <c.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold text-primary">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent transition-all duration-300 group-hover:gap-2">
                    Start Training <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Results */}
      <TransformationResults />

      {/* CTA */}
      <section ref={cta.ref} className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_100%_71%/0.15),transparent_50%)]" />
        {/* Floating icons in CTA */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Dumbbell className="absolute text-primary-foreground/5" style={{ left: "5%", top: "20%", animation: "float-icon 7s ease-in-out infinite" }} size={28} />
          <Flame className="absolute text-primary-foreground/5" style={{ right: "10%", bottom: "25%", animation: "float-icon 6s ease-in-out 1s infinite" }} size={22} />
          <Activity className="absolute text-primary-foreground/5" style={{ left: "80%", top: "15%", animation: "float-icon 8s ease-in-out 2s infinite" }} size={20} />
        </div>
        <div className={`container relative z-10 py-20 text-center md:py-28 transition-all duration-700 ${cta.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-5xl">
            Ready to Transform Your Fitness?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/70">
            Join thousands of people who have already started their journey with FitCore.
          </p>
          <Button variant="coral" size="lg" className="mt-8 animate-pulse-glow" asChild>
            <Link to="/workouts">Start Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
