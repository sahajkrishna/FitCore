import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Dumbbell, Award, Target, Calendar, Star, Medal, Zap, Crown, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AchievementsSectionProps {
  streak: number;
  totalWorkouts: number;
  totalThisWeek: number;
  programsCompleted: number;
  categoriesCount: { strength: number; cardio: number; flexibility: number };
}

interface Achievement {
  id: string;
  icon: LucideIcon;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
  accent: "accent" | "destructive" | "success" | "primary";
}

const accentClasses = {
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/30", fill: "bg-accent" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", fill: "bg-destructive" },
  success: { bg: "bg-success/10", text: "text-success", border: "border-success/30", fill: "bg-success" },
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", fill: "bg-primary" },
};

const AchievementsSection = ({
  streak,
  totalWorkouts,
  totalThisWeek,
  programsCompleted,
  categoriesCount,
}: AchievementsSectionProps) => {
  const achievements: Achievement[] = [
    {
      id: "first-workout",
      icon: Star,
      emoji: "⭐",
      title: "First Step",
      description: "Complete your first workout",
      unlocked: totalWorkouts >= 1,
      progress: { current: Math.min(totalWorkouts, 1), target: 1 },
      accent: "accent",
    },
    {
      id: "streak-3",
      icon: Flame,
      emoji: "🔥",
      title: "3 Day Streak",
      description: "Train 3 days in a row",
      unlocked: streak >= 3,
      progress: { current: Math.min(streak, 3), target: 3 },
      accent: "destructive",
    },
    {
      id: "streak-5",
      icon: Flame,
      emoji: "🔥",
      title: "5 Day Streak",
      description: "Train 5 days in a row",
      unlocked: streak >= 5,
      progress: { current: Math.min(streak, 5), target: 5 },
      accent: "destructive",
    },
    {
      id: "weekly-consistency",
      icon: Calendar,
      emoji: "📅",
      title: "Weekly Warrior",
      description: "Complete 4 workouts this week",
      unlocked: totalThisWeek >= 4,
      progress: { current: Math.min(totalThisWeek, 4), target: 4 },
      accent: "success",
    },
    {
      id: "ten-workouts",
      icon: Dumbbell,
      emoji: "💪",
      title: "10 Workouts Done",
      description: "Complete 10 total workouts",
      unlocked: totalWorkouts >= 10,
      progress: { current: Math.min(totalWorkouts, 10), target: 10 },
      accent: "accent",
    },
    {
      id: "fifty-workouts",
      icon: Medal,
      emoji: "🥇",
      title: "Half Century",
      description: "Complete 50 total workouts",
      unlocked: totalWorkouts >= 50,
      progress: { current: Math.min(totalWorkouts, 50), target: 50 },
      accent: "primary",
    },
    {
      id: "first-program",
      icon: Trophy,
      emoji: "🏆",
      title: "First Program Completed",
      description: "Finish a full program",
      unlocked: programsCompleted >= 1,
      progress: { current: Math.min(programsCompleted, 1), target: 1 },
      accent: "accent",
    },
    {
      id: "all-rounder",
      icon: Sparkles,
      emoji: "✨",
      title: "All-Rounder",
      description: "Try strength, cardio & flexibility",
      unlocked:
        categoriesCount.strength > 0 &&
        categoriesCount.cardio > 0 &&
        categoriesCount.flexibility > 0,
      accent: "success",
    },
    {
      id: "streak-30",
      icon: Crown,
      emoji: "👑",
      title: "Legendary Consistency",
      description: "30 day workout streak",
      unlocked: streak >= 30,
      progress: { current: Math.min(streak, 30), target: 30 },
      accent: "primary",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" /> Achievements
        </h2>
        <Badge variant="secondary" className="text-xs">
          {unlockedCount} / {achievements.length} unlocked
        </Badge>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {achievements.map((a) => {
          const colors = accentClasses[a.accent];
          const pct = a.progress
            ? Math.round((a.progress.current / a.progress.target) * 100)
            : a.unlocked
              ? 100
              : 0;
          return (
            <Card
              key={a.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                a.unlocked
                  ? `${colors.border} hover:-translate-y-1 hover:shadow-card-hover`
                  : "border-border/40 opacity-60 grayscale"
              }`}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                    a.unlocked ? colors.bg : "bg-muted"
                  }`}
                >
                  <span aria-hidden>{a.emoji}</span>
                </div>
                <div className="space-y-0.5">
                  <p className={`font-heading text-sm font-bold leading-tight ${a.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {a.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {a.description}
                  </p>
                </div>
                {a.progress && !a.unlocked && (
                  <div className="w-full mt-1 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.fill} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {a.progress.current} / {a.progress.target}
                    </p>
                  </div>
                )}
                {a.unlocked && (
                  <Badge className={`mt-1 text-[10px] gap-1 ${colors.bg} ${colors.text} border-transparent hover:${colors.bg}`}>
                    <Zap className="h-3 w-3" /> Unlocked
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementsSection;