import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { nutritionGuides } from "@/data/nutritionGuides";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RevealSection from "@/components/RevealSection";

const catColor = (c: string) => {
  const map: Record<string, string> = {
    Basics: "bg-success/10 text-success",
    "Muscle Building": "bg-primary/10 text-primary",
    "Fat Loss": "bg-accent/10 text-accent",
    "Meal Planning": "bg-success/10 text-success",
  };
  return map[c] || "bg-secondary text-secondary-foreground";
};

const NutritionGuide = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = nutritionGuides.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">Guide Not Found</h1>
          <p className="mt-4 text-muted-foreground">The nutrition guide you're looking for doesn't exist.</p>
          <Link to="/nutrition"><Button variant="coral" className="mt-6">Back to Nutrition</Button></Link>
        </div>
      </Layout>
    );
  }

  const related = nutritionGuides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-end">
        <img src={guide.image} alt={guide.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />
        <div className="container relative z-10 pb-10 pt-20 md:pb-14 animate-fade-in">
          <Link to="/nutrition" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Nutrition
          </Link>
          <Badge className={`${catColor(guide.category)} border-0 text-xs font-semibold`}>{guide.category}</Badge>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight max-w-3xl">
            {guide.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{guide.author}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{guide.readTime} read</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="container max-w-3xl py-12 md:py-16">
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">{guide.excerpt}</p>

        {guide.sections.map((section, i) => (
          <RevealSection key={i} delay={i * 80}>
            <section className="mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">{section.heading}</h2>
              {section.image && (
                <img src={section.image} alt={section.heading} className="w-full rounded-xl mb-6 shadow-md object-cover max-h-80" loading="lazy" />
              )}
              <div className="text-foreground/85 leading-[1.8] text-base md:text-lg whitespace-pre-line">
                {section.body.split("\n\n").map((paragraph, pi) => (
                  <p key={pi} className="mb-4">
                    {paragraph.split(/(\*\*.*?\*\*)/).map((part, partIdx) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={partIdx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={partIdx}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
            </section>
          </RevealSection>
        ))}

        {/* Motivational Quote */}
        <RevealSection>
          <div className="my-12 rounded-xl bg-success/5 border border-success/20 p-8 md:p-10 text-center">
            <p className="font-heading text-xl md:text-2xl font-bold text-primary leading-relaxed italic">
              "Your diet is a bank account. Good food choices are good investments."
            </p>
            <p className="mt-3 text-sm text-muted-foreground">— Bethenny Frankel</p>
          </div>
        </RevealSection>

        {/* Related Guides */}
        <RevealSection>
          <div className="mt-12">
            <h3 className="font-heading text-2xl font-bold text-primary mb-6">Related Nutrition Guides</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/nutrition/${r.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <img src={r.image} alt={r.title} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="p-4">
                      <Badge className={`${catColor(r.category)} border-0 text-[10px] font-semibold`}>{r.category}</Badge>
                      <h4 className="mt-2 font-heading text-sm font-bold text-primary leading-snug">{r.title}</h4>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        Read Guide <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Bottom CTA */}
        <RevealSection>
          <div className="mt-12 rounded-xl bg-primary/5 border border-border p-8 text-center">
            <h3 className="font-heading text-xl font-bold text-primary mb-2">Ready to fuel your fitness?</h3>
            <p className="text-muted-foreground mb-5">Pair your nutrition with FitCore's workout programs for maximum results.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/workouts"><Button variant="coral">Browse Workouts</Button></Link>
              <Link to="/nutrition"><Button variant="outline">More Guides</Button></Link>
            </div>
          </div>
        </RevealSection>
      </article>
    </Layout>
  );
};

export default NutritionGuide;
