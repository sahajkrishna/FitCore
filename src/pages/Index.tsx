import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, Dumbbell, Apple, BookOpen, Target, Users, TrendingUp } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "Workout Library", desc: "Browse exercises for strength, cardio, and flexibility.", link: "/workouts" },
  { icon: Apple, title: "Nutrition Guides", desc: "Beginner-friendly meal plans and nutrition tips.", link: "/nutrition" },
  { icon: BookOpen, title: "Expert Blog", desc: "Articles on training, recovery, and wellness.", link: "/blog" },
];

const stats = [
  { icon: Target, value: "200+", label: "Exercises" },
  { icon: Users, value: "50K+", label: "Community Members" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(216_48%_28%),transparent_60%)]" />
      <div className="container relative py-24 md:py-36">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold text-accent">
            Your Fitness Journey Starts Here
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            Build a Stronger,{" "}
            <span className="text-accent">Healthier</span> You
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 md:text-xl">
            Discover expert workouts, nutrition guides, and wellness resources designed for beginners and intermediate fitness enthusiasts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="coral" size="lg" asChild>
              <Link to="/workouts">
                Explore Workouts <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/nutrition">Nutrition Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-border bg-card">
      <div className="container grid grid-cols-3 divide-x divide-border py-10">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center">
            <s.icon className="h-5 w-5 text-accent" />
            <span className="font-heading text-2xl font-bold text-primary md:text-3xl">{s.value}</span>
            <span className="text-xs text-muted-foreground md:text-sm">{s.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">Everything You Need</h2>
        <p className="mt-4 text-muted-foreground">Comprehensive resources to support every aspect of your fitness journey.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            to={f.link}
            className="group rounded-xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <f.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-primary">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Learn more <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="bg-primary">
      <div className="container py-20 text-center md:py-28">
        <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
          Ready to Transform Your Fitness?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
          Join thousands of people who have already started their journey with FitCore.
        </p>
        <Button variant="coral" size="lg" className="mt-8" asChild>
          <Link to="/workouts">Start Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Index;
