import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Dumbbell, Zap, Heart, StretchHorizontal, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProgramWorkoutCard, { type ProgramWeek } from "@/components/ProgramWorkoutCard";
import WorkoutCongrats from "@/components/WorkoutCongrats";
import challengeImg from "@/assets/programs/30-day-challenge.jpg";

const weeks: ProgramWeek[] = [
  {
    week: 1,
    title: "Getting Started",
    workouts: [
      {
        day: "Day 1", name: "30DC: Upper Body Intro", focus: "Upper Body", duration: "20 min", calories: "180",
        difficulty: "Easy", icon: Dumbbell,
        exercises: ["Wall Push-Ups – 3×10", "Arm Circles – 2×20", "Chair Dips – 3×8", "Shoulder Taps – 3×10 each"],
      },
      {
        day: "Day 2", name: "30DC: Cardio Starter", focus: "Cardio", duration: "15 min", calories: "200",
        difficulty: "Easy", icon: Heart,
        exercises: ["Marching in Place – 2 min", "Jumping Jacks – 3×20", "High Knees – 3×15", "Cool-down Walk – 3 min"],
      },
      {
        day: "Day 3", name: "30DC: Rest Day 1", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Take it easy! Light stretching and stay hydrated."],
      },
      {
        day: "Day 4", name: "30DC: Lower Body Basics", focus: "Lower Body", duration: "20 min", calories: "200",
        difficulty: "Easy", icon: Dumbbell,
        exercises: ["Bodyweight Squats – 3×15", "Lunges – 3×10 each", "Glute Bridges – 3×12", "Calf Raises – 3×15"],
      },
      {
        day: "Day 5", name: "30DC: Core Basics", focus: "Core Training", duration: "15 min", calories: "120",
        difficulty: "Easy", icon: Zap,
        exercises: ["Crunches – 3×15", "Plank – 3×20s", "Dead Bug – 3×10 each", "Bird Dog – 3×8 each"],
      },
      {
        day: "Day 6", name: "30DC: Full Body Fun", focus: "Full Body", duration: "25 min", calories: "250",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Burpees (no push-up) – 3×8", "Squats – 3×12", "Push-Ups (knees) – 3×10", "Mountain Climbers – 3×10 each"],
      },
      {
        day: "Day 7", name: "30DC: Recovery Walk", focus: "Recovery", duration: "20 min", calories: "80",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["20-minute walk outdoors. Focus on breathing and enjoying the movement."],
      },
    ],
  },
  {
    week: 2,
    title: "Building Momentum",
    workouts: [
      {
        day: "Day 1", name: "30DC: Upper Body Build", focus: "Upper Body", duration: "25 min", calories: "220",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Push-Ups – 3×12", "Pike Push-Ups – 3×8", "Tricep Dips – 3×10", "Plank Shoulder Taps – 3×12 each"],
      },
      {
        day: "Day 2", name: "30DC: Cardio Boost", focus: "Cardio", duration: "20 min", calories: "260",
        difficulty: "Moderate", icon: Heart,
        exercises: ["Jump Squats – 3×10", "Skaters – 3×12 each", "High Knees – 3×20", "Butt Kicks – 3×20"],
      },
      {
        day: "Day 3", name: "30DC: Rest Day 2", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Rest day. You're building a habit — celebrate showing up every day!"],
      },
      {
        day: "Day 4", name: "30DC: Leg Strength", focus: "Lower Body", duration: "25 min", calories: "250",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Jump Squats – 3×10", "Walking Lunges – 3×12 each", "Single-Leg Glute Bridge – 3×10 each", "Wall Sit – 3×30s"],
      },
      {
        day: "Day 5", name: "30DC: Core Builder", focus: "Core Training", duration: "20 min", calories: "160",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Bicycle Crunches – 3×16", "Russian Twists – 3×20", "Leg Raises – 3×12", "Plank – 3×30s"],
      },
      {
        day: "Day 6", name: "30DC: Full Body Circuit", focus: "Full Body", duration: "30 min", calories: "300",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Burpees – 3×8", "Push-Ups – 3×12", "Squat Jumps – 3×10", "Mountain Climbers – 3×12 each", "Plank – 3×30s"],
      },
      {
        day: "Day 7", name: "30DC: Yoga Flow", focus: "Recovery", duration: "25 min", calories: "90",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Beginner yoga flow — sun salutations, warrior poses, and seated stretches."],
      },
    ],
  },
  {
    week: 3,
    title: "Pushing Limits",
    workouts: [
      {
        day: "Day 1", name: "30DC: Upper Power", focus: "Upper Body", duration: "30 min", calories: "280",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Diamond Push-Ups – 3×10", "Decline Push-Ups – 3×10", "Tricep Dips – 3×12", "Commando Plank – 3×8 each", "Arm Circles – 2×30"],
      },
      {
        day: "Day 2", name: "30DC: HIIT Cardio", focus: "Cardio", duration: "20 min", calories: "300",
        difficulty: "Hard", icon: Heart,
        exercises: ["Burpees – 4×10", "Mountain Climbers – 4×20", "Star Jumps – 3×12", "Sprint in Place – 4×20s"],
      },
      {
        day: "Day 3", name: "30DC: Rest Day 3", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Rest and recover. You're past the halfway mark — keep going!"],
      },
      {
        day: "Day 4", name: "30DC: Explosive Legs", focus: "Lower Body", duration: "30 min", calories: "320",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Jump Lunges – 3×10 each", "Pistol Squat (assisted) – 3×5 each", "Sumo Squats – 3×15", "Box Step-Ups – 3×10 each", "Calf Raises – 3×20"],
      },
      {
        day: "Day 5", name: "30DC: Core Challenge", focus: "Core Training", duration: "25 min", calories: "200",
        difficulty: "Hard", icon: Zap,
        exercises: ["V-Ups – 3×12", "Flutter Kicks – 3×20", "Hollow Hold – 3×20s", "Side Plank – 3×20s each", "Plank – 3×45s"],
      },
      {
        day: "Day 6", name: "30DC: Total Body Blast", focus: "Full Body", duration: "30 min", calories: "340",
        difficulty: "Hard", icon: Zap,
        exercises: ["Burpee Broad Jumps – 3×8", "Push-Up to Squat Jump – 3×8", "Bear Crawl – 3×20m", "Tuck Jumps – 3×8", "Plank – 3×45s"],
      },
      {
        day: "Day 7", name: "30DC: Deep Stretch", focus: "Recovery", duration: "25 min", calories: "70",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Full-body deep stretch with focus on hip flexors, hamstrings, and shoulders."],
      },
    ],
  },
  {
    week: 4,
    title: "Finish Strong",
    workouts: [
      {
        day: "Day 1", name: "30DC: Upper Max", focus: "Upper Body", duration: "30 min", calories: "300",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Push-Ups – max reps in 2 min", "Pike Push-Ups – 3×12", "Decline Push-Ups – 3×10", "Tricep Dips – 3×max", "Plank – 3×60s"],
      },
      {
        day: "Day 2", name: "30DC: Cardio Finisher", focus: "Cardio", duration: "25 min", calories: "350",
        difficulty: "Hard", icon: Heart,
        exercises: ["Tabata – 8×20s/10s burpees", "Jump Rope – 3×1 min", "Sprint in Place – 4×30s", "Cool-down – 3 min"],
      },
      {
        day: "Day 3", name: "30DC: Rest Day 4", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Final rest day. Visualize crushing the last few workouts!"],
      },
      {
        day: "Day 4", name: "30DC: Leg Finisher", focus: "Lower Body", duration: "30 min", calories: "340",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Squat – max reps in 2 min", "Jump Lunges – 3×12 each", "Wall Sit – 3×45s", "Single-Leg Deadlift – 3×10 each", "Calf Raises – 4×20"],
      },
      {
        day: "Day 5", name: "30DC: Core Finale", focus: "Core Training", duration: "20 min", calories: "180",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Hanging Knee Raises – 3×12", "V-Ups – 3×15", "Plank – 3×60s", "Dead Bug – 3×12 each", "Flutter Kicks – 3×20"],
      },
      {
        day: "Day 6", name: "30DC: The Grand Finale", focus: "Full Body", duration: "35 min", calories: "400",
        difficulty: "Hard", icon: Zap,
        exercises: ["Burpees – 50 total (break as needed)", "Push-Ups – 50 total", "Squats – 100 total", "Plank – 5 min total", "Celebrate! 🎉"],
      },
      {
        day: "Day 7", name: "30DC: Victory Stretch", focus: "Recovery", duration: "25 min", calories: "70",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["You did it! 🏆 Full-body stretch and celebrate 30 days of consistency."],
      },
    ],
  },
];

const ThirtyDayChallenge = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [lastCompleted, setLastCompleted] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("workout_progress")
      .select("workout_name")
      .eq("user_id", user.id)
      .eq("category", "30-day-challenge")
      .then(({ data }) => {
        if (data) setCompleted(new Set(data.map((d) => d.workout_name)));
      });
  }, [user]);

  const markComplete = async (name: string, duration: string, calories: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to track progress.", variant: "destructive" });
      return;
    }
    setLoading(name);
    const { error } = await supabase.from("workout_progress").insert({
      user_id: user.id, workout_name: name, category: "30-day-challenge", duration, calories,
    });
    setLoading(null);
    if (error) {
      toast({ title: "Error", description: "Could not log workout.", variant: "destructive" });
    } else {
      setCompleted((prev) => new Set(prev).add(name));
      setLastCompleted(name);
      setCongratsOpen(true);
    }
  };

  const allDays = weeks.flatMap((w) => w.workouts);
  const activeWorkouts = allDays.filter((wo) => !wo.isRest);
  const totalWorkouts = activeWorkouts.length;
  const completedCount = activeWorkouts.filter((wo) => completed.has(wo.name)).length;
  const progress = totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0;

  return (
    <Layout>
      <section className="relative overflow-hidden bg-primary">
        <img src={challengeImg} alt="30 Day Challenge" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-success/40 text-success bg-success/10 backdrop-blur-sm">Beginner</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 30 Days
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">30 Day Fitness Challenge</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            One workout every day for 30 days. No equipment needed — just show up, work hard, and build the habit.
          </p>
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm text-primary-foreground/60 mb-2">
              <span>{completedCount} of {totalWorkouts} workouts completed</span>
              <span className="font-bold text-accent">{progress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-primary-foreground/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {/* Progress grid */}
        <div className="mb-10 rounded-xl bg-card p-5 shadow-card">
          <h3 className="font-heading text-sm font-bold text-primary mb-3">Progress Tracker</h3>
          <div className="flex flex-wrap gap-1.5">
            {allDays.map((d, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  d.isRest
                    ? "bg-muted text-muted-foreground/40"
                    : completed.has(d.name)
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {weeks.map((w, i) => {
            const active = w.workouts.filter((wo) => !wo.isRest);
            const weekCompleted = active.filter((wo) => completed.has(wo.name)).length;
            const allDone = weekCompleted === active.length;
            return (
              <button key={w.week} onClick={() => setActiveWeek(i)}
                className={`flex-shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeWeek === i ? "bg-primary text-primary-foreground shadow-card" : "bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                <span className="block">Week {w.week}</span>
                <span className={`block text-xs mt-0.5 ${activeWeek === i ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                  {allDone ? "✓ Complete" : `${weekCompleted}/${active.length}`}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-2">Week {weeks[activeWeek].week}: {weeks[activeWeek].title}</h2>
          <p className="text-muted-foreground mb-8">Complete one workout every day — no excuses!</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeks[activeWeek].workouts.map((wo) => (
              <ProgramWorkoutCard key={wo.name} workout={wo} completed={completed.has(wo.name)} loading={loading === wo.name}
                onComplete={() => markComplete(wo.name, wo.duration, wo.calories)} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ThirtyDayChallenge;
