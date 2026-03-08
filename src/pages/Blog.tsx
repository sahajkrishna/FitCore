import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import RevealSection from "@/components/RevealSection";
import heroBlogImg from "@/assets/hero-blog.jpg";
import { articles, categories, type BlogCategory } from "@/data/blogArticles";

const catColor = (c: string) => {
  const map: Record<string, string> = {
    "Strength Training": "bg-accent/10 text-accent",
    Cardio: "bg-primary/10 text-primary",
    Nutrition: "bg-success/10 text-success",
    Recovery: "bg-accent/10 text-accent",
  };
  return map[c] || "bg-secondary text-secondary-foreground";
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");

  const filtered = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <Layout>
      <PageHero
        image={heroBlogImg}
        headline="Fitness Knowledge Hub"
        description="Read expert tips, fitness strategies, and health insights."
        ctaLabel="Read Articles"
        ctaHref="#articles"
      />

      <section id="articles" className="container py-16 md:py-20">
        {/* Category Filters */}
        <RevealSection>
          <div className="flex flex-wrap gap-2 mb-10">
            <Button
              variant={activeCategory === "All" ? "coral" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("All")}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "coral" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </RevealSection>

        {/* Article Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <RevealSection key={p.slug} delay={i * 100}>
              <article className="group flex flex-col rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className={`absolute top-3 left-3 ${catColor(p.category)} border-0 text-xs font-semibold`}>
                    {p.category}
                  </Badge>
                </div>
                <div className="flex-1 p-6">
                  <h2 className="font-heading text-lg font-bold leading-snug text-primary">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readTime}</span>
                  </div>
                  <Link to={`/blog/${p.slug}`}>
                    <span className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
              </article>
            </RevealSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No articles found in this category.</p>
        )}
      </section>
    </Layout>
  );
};

export default Blog;
