import Layout from "@/components/Layout";
import { Apple, Droplets, Wheat, Beef, Leaf, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import PremiumGate from "@/components/PremiumGate";
import PageHero from "@/components/PageHero";
import heroNutritionImg from "@/assets/hero-nutrition.jpg";

const guides = [
  {
    icon: Apple,
    title: "Understanding Macros",
    summary: "Learn about proteins, carbohydrates, and fats — the three macronutrients your body needs to fuel workouts and recovery.",
    tips: ["Aim for 1.6–2.2g protein per kg of body weight for muscle building", "Complex carbs before workouts for sustained energy", "Healthy fats support hormone production and joint health"],
  },
  {
    icon: Droplets,
    title: "Hydration Essentials",
    summary: "Water is the most underrated performance enhancer. Proper hydration improves energy, focus, and recovery.",
    tips: ["Drink at least 2–3 liters of water daily", "Add electrolytes during intense or long workouts", "Monitor urine color — pale yellow indicates good hydration"],
  },
  {
    icon: Wheat,
    title: "Meal Prep for Beginners",
    summary: "Simplify your nutrition with batch cooking. Spend a few hours on Sunday to set up your week for success.",
    tips: ["Start with 3–4 simple recipes you enjoy", "Cook proteins, grains, and veggies in bulk", "Use portioned containers to grab meals on the go"],
  },
  {
    icon: Beef,
    title: "Pre & Post Workout Nutrition",
    summary: "What you eat around your workouts matters. Timing your nutrition can boost performance and speed up recovery.",
    tips: ["Eat a balanced meal 2–3 hours before training", "Post-workout: protein + fast carbs within 60 minutes", "A banana with peanut butter is a great quick option"],
    premium: true,
  },
  {
    icon: Leaf,
    title: "Plant-Based Fitness Nutrition",
    summary: "Going plant-based doesn't mean sacrificing performance. Learn how to get all the nutrients you need from plants.",
    tips: ["Combine legumes and grains for complete proteins", "Supplement B12 and consider vitamin D", "Iron-rich foods: lentils, spinach, fortified cereals"],
    premium: true,
  },
];

const Nutrition = () => {
  const { isPremium } = usePremiumStatus();

  return (
    <Layout>
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h1 className="font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Nutrition Guides</h1>
          <p className="mt-4 max-w-lg text-primary-foreground/70">Beginner-friendly nutrition articles to fuel your fitness journey. No fads — just science-backed guidance.</p>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-8">
          {guides.map((g) => {
            const isLocked = g.premium && !isPremium;

            if (isLocked) {
              return (
                <article key={g.title} className="relative rounded-xl bg-card p-8 shadow-card md:p-10">
                  <div className="flex items-start gap-4 opacity-40 pointer-events-none select-none">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                      <g.icon className="h-6 w-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading text-xl font-bold text-primary md:text-2xl">{g.title}</h2>
                        <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">Premium</Badge>
                      </div>
                      <p className="mt-2 text-muted-foreground">{g.summary}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <PremiumGate message={`"${g.title}" is a premium nutrition guide. Upgrade to unlock all guides.`} />
                  </div>
                </article>
              );
            }

            return (
              <article key={g.title} className="rounded-xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover md:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                    <g.icon className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-bold text-primary md:text-2xl">{g.title}</h2>
                    <p className="mt-2 text-muted-foreground">{g.summary}</p>
                    <ul className="mt-5 space-y-2">
                      {g.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-foreground/80">
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default Nutrition;
