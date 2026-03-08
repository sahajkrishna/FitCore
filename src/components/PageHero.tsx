import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import FloatingFitnessIcons from "@/components/FloatingFitnessIcons";

interface PageHeroProps {
  image: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaOnClick?: () => void;
  ctaHref?: string;
  badge?: ReactNode;
}

const PageHero = ({ image, headline, description, ctaLabel, ctaOnClick, ctaHref, badge }: PageHeroProps) => (
  <section className="relative overflow-hidden min-h-[340px] md:min-h-[420px] flex items-center">
    {/* Background image */}
    <img
      src={image}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      loading="eager"
      aria-hidden="true"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
    {/* Floating icons */}
    <FloatingFitnessIcons />
    {/* Content */}
    <div className="container relative z-10 py-16 md:py-24">
      <div className="max-w-2xl space-y-5 animate-fade-in">
        {badge}
        <h1 className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl drop-shadow-md leading-tight">
          {headline}
        </h1>
        <p className="text-base md:text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
          {description}
        </p>
        {ctaHref ? (
          <a href={ctaHref}>
            <Button variant="coral" size="lg" className="mt-2 text-base shadow-lg hover:shadow-xl transition-shadow">
              {ctaLabel}
            </Button>
          </a>
        ) : (
          <Button variant="coral" size="lg" className="mt-2 text-base shadow-lg hover:shadow-xl transition-shadow" onClick={ctaOnClick}>
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  </section>
);

export default PageHero;
