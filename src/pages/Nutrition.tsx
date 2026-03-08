import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import PremiumGate from "@/components/PremiumGate";
import PageHero from "@/components/PageHero";
import RevealSection from "@/components/RevealSection";
import heroNutritionImg from "@/assets/hero-nutrition.jpg";
import { nutritionGuides, nutritionCategories } from "@/data/nutritionGuides";

const catColor = (c: string) => {
  const map: Record<string, string> = {
    Basics: "bg-success/10 text-success",
    "Muscle Building": "bg-primary/10 text-primary",
    "Fat Loss": "bg-accent/10 text-accent",
    "Meal Planning": "bg-success/10 text-success",
  };
  return map[c] || "bg-secondary text-secondary-foreground";
};

const Nutrition = () => {
  const { isPremium } = usePremiumStatus();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? nutritionGuides
    : nutritionGuides.filter((g) => g.category === activeCategory);

  return (
    <Layout>
      <PageHero
        image={heroNutritionImg}
        headline="Fuel Your Body Right"
        description="Learn nutrition strategies that support strength, energy, and recovery."
        ctaLabel="Explore Nutrition Guides"
        ctaHref="#guides"
      />

      {/* Motivational Quote */}
      <RevealSection>
        <section className="container py-12 md:py-16">
          <div className="rounded-xl bg-success/5 border border-success/20 p-8 md:p-12 text-center">
            <p className="font-heading text-2xl md:text-3xl font-bold text-primary leading-relaxed italic">
              "Your diet is a bank account. Good food choices are good investments."
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— Bethenny Frankel</p>
          </div>
        </section>
      </RevealSection>

      <section id="guides" className="container pb-16 md:pb-20">
        {/* Category Filters */}
        <RevealSection>
          <div className="flex flex-wrap gap-2 mb-10">
            {nutritionCategories.map((cat) => (
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

        {/* Guide Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g, i) => {
            const isLocked = g.premium && !isPremium;

            return (
              <RevealSection key={g.slug} delay={i * 100}>
                <article className="group flex flex-col rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={g.image}
                      alt={g.title}
                      className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 ${isLocked ? "opacity-50" : ""}`}
                      loading="lazy"
                    />
                    <Badge className={`absolute top-3 left-3 ${catColor(g.category)} border-0 text-xs font-semibold`}>
                      {g.category}
                    </Badge>
                    {isLocked && (
                      <Badge variant="outline" className="absolute top-3 right-3 border-accent/40 text-accent text-[10px]">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <h2 className="font-heading text-lg font-bold leading-snug text-primary">{g.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{g.excerpt}</p>
                  </div>
                  <div className="border-t border-border px-6 py-4">
                    {isLocked ? (
                      <PremiumGate message={`"${g.title}" is a premium guide. Upgrade to unlock.`} />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />{g.readTime}
                        </span>
                        <Link to={`/nutrition/${g.slug}`}>
                          <span className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                            Read Guide <ArrowRight className="h-3 w-3" />
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              </RevealSection>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No guides found in this category.</p>
        )}
      </section>
    </Layout>
  );
};

export default Nutrition;
