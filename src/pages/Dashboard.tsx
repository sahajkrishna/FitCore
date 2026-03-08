import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, BookOpen, User, Clock, Flame, ArrowRight, Zap, Heart, StretchHorizontal, CalendarDays, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WorkoutEntry {
  id: string;
  workout_name: string;
  category: string;
  date_completed: string;
  duration: string | null;
  calories: string | null;
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

const Dashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [totalThisWeek, setTotalThisWeek] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Fetch profile
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });

    // Fetch recent workouts (last 10)
    supabase
      .from("workout_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("date_completed", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setRecentWorkouts(data as WorkoutEntry[]);
      });

    // Fetch weekly data (last 7 days)
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
        days.forEach((d) => {
          counts[dayLabels[d.getDay()]] = 0;
        });
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
  }, [user]);

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
      <div className="container py-10 md:py-16 space-y-10">
        {/* Welcome */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 shadow-sm">
            <User className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {getGreeting()}, {displayName || "Athlete"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Ready to crush your fitness goals today?</p>
          </div>
        </div>

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
              {weeklyData.length > 0 ? (
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

        {/* Recent Workout History */}
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
      </div>
    </Layout>
  );
};

export default Dashboard;
