import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, ArrowRight, Flame } from "lucide-react";

import fatLossImg from "@/assets/programs/fat-loss.jpg";
import strengthImg from "@/assets/programs/strength-builder.jpg";
import challengeImg from "@/assets/programs/30-day-challenge.jpg";

const programs = [
  {
    title: "Fat Loss Program",
    slug: "/programs/fat-loss",
    image: fatLossImg,
    duration: "8 Weeks",
    difficulty: "Intermediate",
    description: "Torch calories and shed fat with high-intensity interval training and metabolic conditioning.",
    workouts: 24,
    icon: Flame,
  },
  {
    title: "Strength Builder",
    slug: "/programs/strength-builder",
    image: strengthImg,
    duration: "12 Weeks",
    difficulty: "Advanced",
    description: "Progressive overload program designed to maximize muscle growth and raw strength.",
    workouts: 36,
    icon: Zap,
  },
  {
    title: "30 Day Fitness Challenge",
    image: challengeImg,
    duration: "4 Weeks",
    difficulty: "Beginner",
    description: "Kickstart your fitness journey with daily workouts that build consistency and confidence.",
    workouts: 30,
    icon: ArrowRight,
  },
];

const difficultyColor = (d: string) =>
  d === "Beginner"
    ? "bg-success/10 text-success border-success/20"
    : d === "Intermediate"
    ? "bg-accent/10 text-accent border-accent/20"
    : "bg-destructive/10 text-destructive border-destructive/20";

const FeaturedPrograms = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-16 md:py-20">
      {/* Decorative blobs */}
      <div
        className="absolute right-0 top-10 h-56 w-56 rounded-full bg-accent/5 blur-3xl"
        style={{ animation: "float-blob 10s ease-in-out infinite" }}
      />
      <div
        className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-success/5 blur-3xl"
        style={{ animation: "float-blob 8s ease-in-out 2s infinite" }}
      />

      <div className="container">
        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Featured Programs
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
            Structured Plans for Every Goal
          </h2>
          <p className="mt-4 text-muted-foreground">
            Follow expert-designed programs to stay on track and see real results.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {programs.map((p, i) => (
            <div
              key={p.title}
              className={`group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-3 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${(i + 1) * 200}ms` }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                {/* Difficulty badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className={`text-xs backdrop-blur-sm bg-card/60 ${difficultyColor(p.difficulty)}`}
                  >
                    {p.difficulty}
                  </Badge>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="text-[10px] backdrop-blur-sm bg-card/60 border-primary-foreground/20 text-primary-foreground gap-1"
                  >
                    <Clock className="h-2.5 w-2.5" /> {p.duration}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] backdrop-blur-sm bg-card/60 border-primary-foreground/20 text-primary-foreground"
                  >
                    {p.workouts} workouts
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <p.icon className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <Button variant="coral" size="sm" className="mt-5 w-full gap-1">
                  Start Program <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
