import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, BookOpen, User, Clock, Flame, Bookmark, ArrowRight, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const recommendedWorkouts = [
  { title: "Full Body HIIT", duration: "30 min", calories: "350 cal", level: "Intermediate", icon: Zap },
  { title: "Morning Yoga Flow", duration: "20 min", calories: "120 cal", level: "Beginner", icon: Heart },
  { title: "Upper Body Strength", duration: "45 min", calories: "280 cal", level: "Advanced", icon: Dumbbell },
];

const savedWorkouts = [
  { title: "5K Running Plan", category: "Cardio", lastDone: "2 days ago" },
  { title: "Core Crusher", category: "Strength", lastDone: "5 days ago" },
  { title: "Stretch & Recover", category: "Flexibility", lastDone: "1 week ago" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();
      if (data?.display_name) setDisplayName(data.display_name);
    };
    fetchProfile();
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

  return (
    <Layout>
      <div className="container py-10 md:py-16 space-y-10">
        {/* Welcome Section */}
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

        {/* Quick Access Cards */}
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

        {/* Today's Recommended Workout */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Today's Recommended</h2>
            <Link to="/workouts">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedWorkouts.map((workout) => (
              <Card key={workout.title} className="border-border/60 transition-all duration-300 hover:shadow-card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <workout.icon className="h-5 w-5 text-accent" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {workout.level}
                    </Badge>
                  </div>
                  <CardTitle className="font-heading text-base mt-3">{workout.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {workout.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" /> {workout.calories}
                    </span>
                  </div>
                  <Button variant="coral" size="sm" className="w-full mt-4">
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Saved Workouts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Saved Workouts</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Manage <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-0 divide-y divide-border">
              {savedWorkouts.map((workout) => (
                <div key={workout.title} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                      <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{workout.title}</p>
                      <p className="text-xs text-muted-foreground">{workout.category} · Last done {workout.lastDone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Resume
                  </Button>
                </div>
              ))}
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
