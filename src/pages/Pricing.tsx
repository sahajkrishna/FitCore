import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Dumbbell } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the essentials",
    icon: Dumbbell,
    highlighted: false,
    features: [
      "Access workout library",
      "Limited nutrition guides",
      "Save workouts to your profile",
      "Basic workout tracking",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    ctaLink: "/signup",
  },
  {
    name: "Premium",
    price: "$6",
    period: "/month",
    description: "Unlock your full potential",
    icon: Zap,
    highlighted: true,
    features: [
      "Full structured workout programs",
      "Workout progress analytics",
      "Advanced nutrition guides",
      "Priority access to new content",
      "Personalized recommendations",
      "Ad-free experience",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    ctaVariant: "coral" as const,
    ctaLink: "/signup",
  },
];

const Pricing = () => (
  <Layout>
    <section className="bg-primary">
      <div className="container py-16 md:py-24 text-center">
        <Badge variant="secondary" className="mb-4 text-xs font-medium">
          Simple Pricing
        </Badge>
        <h1 className="font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70 text-base md:text-lg">
          Start free and upgrade when you're ready. No hidden fees, cancel anytime.
        </p>
      </div>
    </section>

    <section className="container -mt-10 pb-20 md:-mt-14">
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover ${
              plan.highlighted
                ? "ring-2 ring-accent scale-[1.02] md:scale-105"
                : "border border-border/60"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground px-4 py-1 text-xs font-semibold shadow-md">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  plan.highlighted ? "bg-accent/10" : "bg-primary/5"
                }`}
              >
                <plan.icon
                  className={`h-5 w-5 ${plan.highlighted ? "text-accent" : "text-primary"}`}
                />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">{plan.name}</h2>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="font-heading text-4xl font-extrabold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      plan.highlighted ? "text-accent" : "text-success"
                    }`}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.ctaVariant}
              size="lg"
              className="w-full"
              asChild
            >
              <a href={plan.ctaLink}>{plan.cta}</a>
            </Button>
          </div>
        ))}
      </div>
    </section>

    <section className="border-t border-border bg-muted/30">
      <div className="container py-16 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">
          Questions about pricing?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We're here to help. Reach out to our team and we'll get back to you within 24 hours.
        </p>
      </div>
    </section>
  </Layout>
);

export default Pricing;
