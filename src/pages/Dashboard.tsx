import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, BookOpen, User, Clock, Flame, ArrowRight, Heart, StretchHorizontal, CalendarDays, TrendingUp, Bookmark, Trash2, Crown, Target, Sparkles, ChevronDown, ChevronUp, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import PremiumGate from "@/components/PremiumGate";
import heroBanner from "@/assets/hero-dashboard.jpg";
import categoryStrength from "@/assets/category-strength.jpg";
import categoryCardio from "@/assets/category-cardio.jpg";
import categoryFlexibility from "@/assets/category-flexibility.jpg";
import bgGymEquipment from "@/assets/bg-gym-equipment.jpg";
import bgAthletes from "@/assets/bg-athletes.jpg";

interface WorkoutEntry {
  id: string;
  workout_name: string;
  category: string;
  date_completed: string;
  duration: string | null;
  calories: string | null;
}

interface SavedWorkout {
  id: string;
  workout_name: string;
  category: string;
  saved_at: string;
}

interface AiPlan {
  id: string;
  fitness_goal: string;
  experience_level: string;
  days_per_week: number;
  workout_plan: any;
  created_at: string;
}

const categoryIcon = (cat: string) => {
  switch (cat) {
    case "strength": return Dumbbell;
    case "cardio": return Heart;
    case "flexibility": return StretchHorizontal;
    default: return Dumbbell;
  }
};

const categoryColor = (cat: string) => {
  switch (cat) {
    case "strength": return "text-accent";
    case "cardio": return "text-destructive";
    case "flexibility": return "text-success";
    default: return "text-primary";
  }
};

interface SubscriptionInfo {
  plan: string;
  subscription_status: string;
  subscription_end_date: string;
  subscription_start_date: string;
  amount: number;
  currency: string;
}

interface ProgramProgress {
  slug: string;
  title: string;
  total: number;
  completed: number;
  color: string;
}

const programDefs = [
  { slug: "/programs/fat-loss", title: "Fat Loss Program", category: "fat-loss-program", total: 20, color: "bg-accent" },
  { slug: "/programs/strength-builder", title: "Strength Builder", category: "strength-builder-program", total: 20, color: "bg-destructive" },
  { slug: "/programs/30-day-challenge", title: "30 Day Challenge", category: "30-day-challenge", total: 20, color: "bg-success" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium } = usePremiumStatus();
  const [displayName, setDisplayName] = useState("");
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutEntry[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [aiPlans, setAiPlans] = useState<AiPlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isPremiumProfile, setIsPremiumProfile] = useState(false);
  const [totalThisWeek, setTotalThisWeek] = useState(0);
  const [programProgress, setProgramProgress] = useState<ProgramProgress[]>([]);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("display_name, premium_status")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.premium_status) setIsPremiumProfile(true);
      });

    supabase
      .from("workout_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("date_completed", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setRecentWorkouts(data as WorkoutEntry[]);
      });

    supabase
      .from("subscriptions")
      .select("plan, subscription_status, subscription_end_date, subscription_start_date, amount, currency")
      .eq("user_id", user.id)
      .order("subscription_start_date", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setSubscription(data[0] as SubscriptionInfo);
      });

    supabase
      .from("saved_workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSavedWorkouts(data as SavedWorkout[]);
      });

    supabase
      .from("ai_workout_plans" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }: any) => {
        if (data) setAiPlans(data as AiPlan[]);
      });

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    const weekStart = days[0].toISOString();

    supabase
      .from("workout_progress")
      .select("date_completed")
      .eq("user_id", user.id)
      .gte("date_completed", weekStart)
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach((d) => { counts[dayLabels[d.getDay()]] = 0; });
        if (data) {
          data.forEach((entry) => {
            const d = new Date(entry.date_completed);
            const label = dayLabels[d.getDay()];
            counts[label] = (counts[label] || 0) + 1;
          });
          setTotalThisWeek(data.length);
        }
        setWeeklyData(days.map((d) => ({ day: dayLabels[d.getDay()], count: counts[dayLabels[d.getDay()]] || 0 })));
      });

    // Fetch program progress
    Promise.all(
      programDefs.map(async (prog) => {
        const { data } = await supabase
          .from("workout_progress")
          .select("workout_name")
          .eq("user_id", user.id)
          .eq("category", prog.category);
        return {
          slug: prog.slug,
          title: prog.title,
          total: prog.total,
          completed: data?.length || 0,
          color: prog.color,
        };
      })
    ).then((results) => {
      setProgramProgress(results.filter((p) => p.completed > 0));
    });
  }, [user]);

  const removeSaved = async (id: string, name: string) => {
    const { error } = await supabase.from("saved_workouts").delete().eq("id", id);
    if (!error) {
      setSavedWorkouts((prev) => prev.filter((w) => w.id !== id));
      toast({ title: "Removed", description: `${name} removed from saved workouts.` });
    }
  };

  const quickLinks = [
    { icon: Dumbbell, title: "Workout Library", desc: "Browse exercises & programs", to: "/workouts", color: "bg-accent/10 text-accent" },
    { icon: Apple, title: "Nutrition Guides", desc: "Meal plans & tips", to: "/nutrition", color: "bg-success/10 text-success" },
    { icon: BookOpen, title: "Resources Blog", desc: "Latest fitness articles", to: "/blog", color: "bg-primary/10 text-primary" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const barColors = weeklyData.map((d) => (d.count > 0 ? "hsl(var(--accent))" : "hsl(var(--muted))"));

  return (
    <Layout>
      <div className="space-y-0">
        {/* Main container with padding */}
        <div className="container py-10 md:py-16 space-y-10">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl shadow-lg">
          <img src={heroBanner} alt="Modern gym with warm lighting" className="w-full h-56 sm:h-72 md:h-80 object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/20" />
          <div className="absolute inset-0 flex items-center px-8 md:px-14">
            <div className="space-y-3">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-accent">
                {getGreeting()}, {displayName || "Athlete"}
              </p>
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-primary-foreground drop-shadow-md leading-tight">
                Train Smart<br />with <span className="text-accent">FitCore</span>
              </h1>
              <p className="text-sm md:text-base text-primary-foreground/70 max-w-md">
                Push your limits, stay consistent, and transform your body. Your journey starts here.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {isPremiumProfile && (
                  <Badge className="bg-accent text-accent-foreground text-xs gap-1">
                    <Crown className="h-3 w-3" /> Premium Member
                  </Badge>
                )}
                <Link to="/workouts">
                  <Button variant="coral" size="sm" className="gap-1.5">
                    Start Training <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Flame, label: "This Week", value: `${totalThisWeek} workout${totalThisWeek !== 1 ? "s" : ""}`, color: "text-accent", bg: "bg-accent/10" },
            { icon: Dumbbell, label: "Strength", value: `${recentWorkouts.filter(w => w.category === "strength").length} sessions`, color: "text-accent", bg: "bg-accent/10" },
            { icon: Heart, label: "Cardio", value: `${recentWorkouts.filter(w => w.category === "cardio").length} sessions`, color: "text-destructive", bg: "bg-destructive/10" },
            { icon: StretchHorizontal, label: "Flexibility", value: `${recentWorkouts.filter(w => w.category === "flexibility").length} sessions`, color: "text-success", bg: "bg-success/10" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="flex items-center gap-3 py-4 px-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-heading text-sm font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Program Progress */}
        {programProgress.length > 0 && (
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-accent" /> Active Programs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programProgress.map((prog) => {
                const pct = Math.round((prog.completed / prog.total) * 100);
                return (
                  <Link key={prog.slug} to={prog.slug} className="group">
                    <Card className="border-border/60 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                      <CardContent className="py-5 px-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-heading text-sm font-bold text-foreground">{prog.title}</h3>
                          <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${prog.color} transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {prog.completed} of {prog.total} workouts completed
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Workout Category Cards */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Explore Workouts</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { img: categoryStrength, title: "Strength Training", desc: "Build muscle and power with barbell, dumbbell, and bodyweight exercises.", to: "/workouts", icon: Dumbbell, color: "text-accent" },
              { img: categoryCardio, title: "Cardio Workouts", desc: "Boost endurance and burn calories with running, cycling, and HIIT.", to: "/workouts", icon: Heart, color: "text-destructive" },
              { img: categoryFlexibility, title: "Flexibility & Mobility", desc: "Improve range of motion with yoga, stretching, and recovery flows.", to: "/workouts", icon: StretchHorizontal, color: "text-success" },
            ].map((cat) => (
              <Link key={cat.title} to={cat.to} className="group">
                <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                      <span className="font-heading text-base font-bold text-foreground">{cat.title}</span>
                    </div>
                  </div>
                  <CardContent className="pt-3 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Access</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((item) => (
              <Link key={item.title} to={item.to} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/60">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-heading text-base">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.desc}</CardDescription>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        </div>{/* end main container */}

        {/* Gym Equipment Background Section */}
        <section className="relative py-16 my-0">
          <img src={bgGymEquipment} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" aria-hidden="true" />
          <div className="absolute inset-0 bg-background/92" />
          <div className="container relative z-10 space-y-10">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-accent" /> Subscription Status
          </h2>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              {isPremium && subscription ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <Crown className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground capitalize">{subscription.plan} Plan</p>
                        <Badge variant="default" className="bg-accent text-accent-foreground text-[10px]">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ₹{(subscription.amount / 100).toFixed(0)}/{subscription.currency} · Renews {new Date(subscription.subscription_end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Member since {new Date(subscription.subscription_start_date).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60">
                      <Crown className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Free Plan</p>
                      <p className="text-xs text-muted-foreground">Upgrade to unlock advanced features</p>
                    </div>
                  </div>
                  <Link to="/pricing">
                    <Button variant="coral" size="sm">Upgrade to Premium <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Weekly Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" /> Weekly Progress
            </h2>
            <Badge variant="secondary" className="text-xs">
              {totalThisWeek} workout{totalThisWeek !== 1 ? "s" : ""} this week
            </Badge>
          </div>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              {!isPremium ? (
                <PremiumGate message="Workout analytics and weekly progress charts are available for Premium members." />
              ) : weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={weeklyData} barCategoryGap="25%">
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} hide />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }}
                      formatter={(value: number) => [`${value} workout${value !== 1 ? "s" : ""}`, "Completed"]}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {weeklyData.map((_, i) => (
                        <Cell key={i} fill={barColors[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No workouts tracked yet. Head to the workout library to get started!</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Saved Workouts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-accent" /> Saved Workouts
            </h2>
            <Link to="/workouts">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Browse more <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          {savedWorkouts.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-10 text-center">
                <Bookmark className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No saved workouts yet. Save workouts from the <Link to="/workouts" className="text-accent underline">Workout Library</Link>!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedWorkouts.map((w) => {
                const Icon = categoryIcon(w.category);
                return (
                  <Card key={w.id} className="border-border/60 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                    <CardContent className="flex items-start gap-4 py-5 px-5">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${w.category === "strength" ? "bg-accent/10" : w.category === "cardio" ? "bg-destructive/10" : "bg-success/10"}`}>
                        <Icon className={`h-5 w-5 ${categoryColor(w.category)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{w.workout_name}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">
                          {w.category} · Saved {new Date(w.saved_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSaved(w.id, w.workout_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
          </div>{/* end gym equipment bg container */}
        </section>{/* end gym equipment bg section */}

        {/* Athletes Background Section */}
        <section className="relative py-16">
          <img src={bgAthletes} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" aria-hidden="true" />
          <div className="absolute inset-0 bg-background/93" />
          <div className="container relative z-10 space-y-10">

        {/* Workout History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Workout History
            </h2>
            <Link to="/workouts">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Log more <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-0 divide-y divide-border">
              {recentWorkouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No workouts completed yet. Start tracking from the <Link to="/workouts" className="text-accent underline">Workout Library</Link>!</p>
              ) : (
                recentWorkouts.map((w) => {
                  const Icon = categoryIcon(w.category);
                  return (
                    <div key={w.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60">
                          <Icon className={`h-4 w-4 ${categoryColor(w.category)}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{w.workout_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {w.category} · {new Date(w.date_completed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {w.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{w.duration}</span>}
                        {w.calories && <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{w.calories}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>

        {/* Profile Summary */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-heading text-base">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">{user?.email}</span></p>
            <p><span className="font-medium text-foreground">Display Name:</span> <span className="text-muted-foreground">{displayName || "Not set"}</span></p>
            <p><span className="font-medium text-foreground">Member since:</span> <span className="text-muted-foreground">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span></p>
          </CardContent>
        </Card>
          </div>{/* end athletes bg container */}
        </section>{/* end athletes bg section */}
      </div>
    </Layout>
  );
};

export default Dashboard;
