import Layout from "@/components/Layout";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/PageHero";
import heroBlogImg from "@/assets/hero-blog.jpg";

const posts = [
  { title: "5 Compound Exercises Every Beginner Should Master", category: "Training", date: "Mar 5, 2026", readTime: "6 min", excerpt: "Compound movements recruit multiple muscle groups simultaneously, making them the most efficient way to build strength and muscle as a beginner." },
  { title: "How to Build a Sustainable Workout Routine", category: "Lifestyle", date: "Mar 2, 2026", readTime: "8 min", excerpt: "Consistency beats intensity. Learn how to create a workout schedule that fits your life and keeps you motivated long-term." },
  { title: "The Science of Muscle Recovery", category: "Recovery", date: "Feb 27, 2026", readTime: "7 min", excerpt: "Understanding the recovery process is just as important as the workout itself. Discover how sleep, nutrition, and rest days work together." },
  { title: "Nutrition Myths Debunked: What Actually Works", category: "Nutrition", date: "Feb 22, 2026", readTime: "5 min", excerpt: "From meal timing to carb fears, we break down the most common nutrition myths and reveal what the research actually says." },
  { title: "Progressive Overload: The Key to Continuous Gains", category: "Training", date: "Feb 18, 2026", readTime: "6 min", excerpt: "Your body adapts quickly. Learn how to strategically increase training volume, intensity, and complexity to keep making progress." },
  { title: "Mindfulness and Exercise: The Mental Health Connection", category: "Wellness", date: "Feb 14, 2026", readTime: "7 min", excerpt: "Exercise isn't just physical. Explore the powerful relationship between movement, mindfulness, and mental well-being." },
];

const catColor = (c: string) => {
  const map: Record<string, string> = { Training: "bg-accent/10 text-accent", Lifestyle: "bg-primary/10 text-primary", Recovery: "bg-success/10 text-success", Nutrition: "bg-success/10 text-success", Wellness: "bg-accent/10 text-accent" };
  return map[c] || "bg-secondary text-secondary-foreground";
};

const Blog = () => (
  <Layout>
      <PageHero
        image={heroBlogImg}
        headline="Fitness Knowledge Hub"
        description="Read expert tips, fitness strategies, and health insights."
        ctaLabel="Read Articles"
        ctaHref="#articles"
      />

    <section className="container py-16 md:py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="group flex flex-col rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
            <div className="flex-1 p-7">
              <Badge className={`${catColor(p.category)} border-0 text-xs font-semibold`}>{p.category}</Badge>
              <h2 className="mt-4 font-heading text-lg font-bold leading-snug text-primary">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border px-7 py-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readTime}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Read <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  </Layout>
);

export default Blog;
