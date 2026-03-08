import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { articles } from "@/data/blogArticles";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RevealSection from "@/components/RevealSection";

const catColor = (c: string) => {
  const map: Record<string, string> = {
    "Strength Training": "bg-accent/10 text-accent",
    Cardio: "bg-primary/10 text-primary",
    Nutrition: "bg-success/10 text-success",
    Recovery: "bg-accent/10 text-accent",
  };
  return map[c] || "bg-secondary text-secondary-foreground";
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">Article Not Found</h1>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button variant="coral" className="mt-6">Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-end">
        <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />
        <div className="container relative z-10 pb-10 pt-20 md:pb-14 animate-fade-in">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <Badge className={`${catColor(article.category)} border-0 text-xs font-semibold`}>{article.category}</Badge>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight max-w-3xl">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.readTime} read</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="container max-w-3xl py-12 md:py-16">
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">{article.excerpt}</p>

        {article.sections.map((section, i) => (
          <RevealSection key={i} delay={i * 80}>
            <section className="mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">{section.heading}</h2>
              {section.image && (
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-full rounded-xl mb-6 shadow-md object-cover max-h-80"
                  loading="lazy"
                />
              )}
              <div className="prose-custom text-foreground/85 leading-[1.8] text-base md:text-lg whitespace-pre-line">
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

        {/* Bottom CTA */}
        <RevealSection>
          <div className="mt-12 rounded-xl bg-primary/5 border border-border p-8 text-center">
            <h3 className="font-heading text-xl font-bold text-primary mb-2">Ready to put this into practice?</h3>
            <p className="text-muted-foreground mb-5">Start your fitness journey with FitCore's personalized workout programs.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/workouts"><Button variant="coral">Browse Workouts</Button></Link>
              <Link to="/blog"><Button variant="outline">More Articles</Button></Link>
            </div>
          </div>
        </RevealSection>
      </article>
    </Layout>
  );
};

export default BlogArticle;
