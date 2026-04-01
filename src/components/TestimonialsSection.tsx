import { Star } from "lucide-react";
import RevealSection from "@/components/RevealSection";

const testimonials = [
  {
    name: "Priya S.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    review: "FitCore helped me stay consistent with my workouts. The structured programs are amazing!",
    rating: 5,
  },
  {
    name: "Arjun M.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    review: "The AI workout generator gives me personalized plans that actually work. Down 8kg in 3 months!",
    rating: 5,
  },
  {
    name: "Sneha R.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    review: "Love the nutrition guides and streak tracker. It keeps me motivated every single day.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="bg-secondary/30 py-20 md:py-28">
    <div className="container">
      <div className="mx-auto max-w-xl text-center mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Real Stories</span>
        <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
          What Our Users Say
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of satisfied members transforming their fitness journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <RevealSection key={t.name} delay={i * 150}>
            <div className="group rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{t.review}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/20"
                  loading="lazy"
                />
                <span className="font-heading text-sm font-bold text-foreground">{t.name}</span>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
