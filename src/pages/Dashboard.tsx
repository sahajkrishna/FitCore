import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Apple, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";

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
    { icon: Dumbbell, title: "Workouts", desc: "Browse exercise library", to: "/workouts" },
    { icon: Apple, title: "Nutrition", desc: "Explore nutrition guides", to: "/nutrition" },
    { icon: BookOpen, title: "Blog", desc: "Read latest articles", to: "/blog" },
  ];

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <User className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              Welcome back, {displayName || "Athlete"}!
            </h1>
            <p className="text-muted-foreground">Here's your fitness dashboard</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.title} to={item.to}>
              <Card className="transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium text-foreground">Email:</span> {user?.email}</p>
            <p><span className="font-medium text-foreground">Display Name:</span> {displayName || "Not set"}</p>
            <p><span className="font-medium text-foreground">Member since:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
