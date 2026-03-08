import { useEffect, useRef, useState } from "react";
import { ArrowRight, Star } from "lucide-react";

import before1 from "@/assets/transformations/before-1.jpg";
import after1 from "@/assets/transformations/after-1.jpg";
import before2 from "@/assets/transformations/before-2.jpg";
import after2 from "@/assets/transformations/after-2.jpg";
import before3 from "@/assets/transformations/before-3.jpg";
import after3 from "@/assets/transformations/after-3.jpg";

const transformations = [
  {
    name: "Marcus R.",
    before: before1,
    after: after1,
    duration: "6 months",
    story: "Lost 35 lbs and gained lean muscle through consistent strength training and a balanced nutrition plan.",
  },
  {
    name: "Sarah K.",
    before: before2,
    after: after2,
    duration: "4 months",
    story: "Transformed her physique with HIIT cardio and flexibility routines, building confidence and endurance.",
  },
  {
    name: "James L.",
    before: before3,
    after: after3,
    duration: "8 months",
    story: "Went from a sedentary lifestyle to competing in fitness events through disciplined daily workouts.",
  },
];

const TransformationResults = () => {
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
    <section ref={ref} className="relative overflow-hidden bg-card py-20 md:py-28">
      {/* Background accents */}
      <div
        className="absolute -right-10 top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
        style={{ animation: "float-blob 11s ease-in-out infinite" }}
      />
      <div
        className="absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-success/5 blur-3xl"
        style={{ animation: "float-blob 9s ease-in-out 2s infinite" }}
      />

      <div className="container">
        {/* Header */}
        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Success Stories
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
            Real Results Start with{" "}
            <span className="text-accent">Consistency</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            See how our community members transformed their lives with dedication and the right plan.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {transformations.map((t, i) => (
            <div
              key={t.name}
              className={`group relative overflow-hidden rounded-2xl bg-background shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-3 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${(i + 1) * 200}ms` }}
            >
              {/* Before / After images */}
              <div className="relative grid grid-cols-2 gap-0.5 bg-border">
                <div className="relative overflow-hidden">
                  <img
                    src={t.before}
                    alt={`${t.name} before`}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-primary/80 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                    Before
                  </span>
                </div>
                <div className="relative overflow-hidden">
                  <img
                    src={t.after}
                    alt={`${t.name} after`}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-accent/90 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground backdrop-blur-sm">
                    After
                  </span>
                </div>
                {/* Arrow overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-card transition-transform duration-500 group-hover:scale-110">
                    <ArrowRight className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {t.name}
                  </h3>
                  <span className="rounded-full bg-success/10 px-3 py-0.5 text-xs font-semibold text-success">
                    {t.duration}
                  </span>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className="h-3.5 w-3.5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  "{t.story}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationResults;
