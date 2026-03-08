import Layout from "@/components/Layout";
import RevealSection from "@/components/RevealSection";
import { Dumbbell, Target, BookOpen, Apple, Sparkles } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "Structured Workout Programs", desc: "Strength, cardio, and flexibility routines designed by fitness experts." },
  { icon: Apple, title: "Nutrition Guides", desc: "Learn what to eat to fuel your workouts and support recovery." },
  { icon: BookOpen, title: "Fitness Education", desc: "In-depth articles on training, recovery, and healthy living." },
  { icon: Sparkles, title: "Personalized Planning", desc: "AI-powered workout generation tailored to your goals." },
];

const About = () => (
  <Layout>
    <section className="container max-w-3xl py-16 md:py-24">
      <RevealSection>
        <h1 className="font-heading text-4xl font-extrabold text-primary md:text-5xl">About FitCore</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          FitCore is a modern fitness platform designed to help people improve their health through structured workouts, nutrition guidance, and educational fitness resources.
        </p>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Our mission is to make fitness simple, accessible, and motivating for everyone — from beginners to intermediate fitness enthusiasts.
        </p>
      </RevealSection>

      <RevealSection delay={100}>
        <h2 className="mt-14 font-heading text-2xl font-bold text-primary">What FitCore Provides</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <div key={f.title} className="group flex items-start gap-4 rounded-xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-primary">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={200}>
        <div className="mt-16 rounded-xl bg-primary/5 border border-border p-8 md:p-10 text-center">
          <p className="font-heading text-xl md:text-2xl font-bold text-primary italic leading-relaxed">
            "Consistency builds strength, discipline builds results."
          </p>
          <p className="mt-3 text-sm text-muted-foreground">— The FitCore Team</p>
        </div>
      </RevealSection>
    </section>
  </Layout>
);

export default About;
