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
import FloatingFitnessIcons from "@/components/FloatingFitnessIcons";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import PremiumGate from "@/components/PremiumGate";
import strengthImg from "@/assets/programs/strength-builder.jpg";

const weeks: ProgramWeek[] = [
  {
    week: 1,
    title: "Foundation Phase",
    workouts: [
      {
        day: "Day 1", name: "SB: Upper Push", focus: "Upper Body – Push", duration: "50 min", calories: "300",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Bench Press – 4×8", "Overhead Press – 3×10", "Incline Dumbbell Press – 3×10", "Tricep Pushdowns – 3×12", "Lateral Raises – 3×15"],
      },
      {
        day: "Day 2", name: "SB: Lower Body", focus: "Lower Body", duration: "55 min", calories: "350",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Barbell Squats – 4×8", "Romanian Deadlifts – 3×10", "Leg Press – 3×12", "Leg Curls – 3×12", "Calf Raises – 4×15"],
      },
      {
        day: "Day 3", name: "SB: Rest Day W1", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Complete rest. Focus on nutrition and 7+ hours sleep."],
      },
      {
        day: "Day 4", name: "SB: Upper Pull", focus: "Upper Body – Pull", duration: "50 min", calories: "280",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Barbell Rows – 4×8", "Pull-Ups – 3×max", "Face Pulls – 3×15", "Barbell Curls – 3×12", "Hammer Curls – 3×12"],
      },
      {
        day: "Day 5", name: "SB: Core & Conditioning", focus: "Core Training", duration: "35 min", calories: "220",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Hanging Leg Raises – 3×12", "Cable Woodchops – 3×12 each", "Plank – 3×60s", "Farmer Carries – 3×40m", "Ab Wheel – 3×10"],
      },
      {
        day: "Day 6", name: "SB: Full Body Power", focus: "Full Body", duration: "55 min", calories: "340",
        difficulty: "Hard", icon: Zap,
        exercises: ["Deadlifts – 4×6", "Push Press – 3×8", "Front Squats – 3×8", "Weighted Dips – 3×10", "Barbell Rows – 3×10"],
      },
      {
        day: "Day 7", name: "SB: Recovery W1", focus: "Recovery", duration: "20 min", calories: "60",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Light stretching, foam rolling, and mobility work for all major joints."],
      },
    ],
  },
  {
    week: 2,
    title: "Volume Phase",
    workouts: [
      {
        day: "Day 1", name: "SB: Bench Volume", focus: "Upper Body – Push", duration: "55 min", calories: "320",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Bench Press – 4×10", "Dumbbell Flyes – 3×12", "Overhead Press – 4×8", "Cable Crossovers – 3×15", "Tricep Dips – 3×12"],
      },
      {
        day: "Day 2", name: "SB: Squat Volume", focus: "Lower Body", duration: "55 min", calories: "380",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Back Squats – 4×10", "Walking Lunges – 3×12 each", "Leg Extensions – 3×15", "Glute Bridges – 3×15", "Calf Raises – 4×20"],
      },
      {
        day: "Day 3", name: "SB: Rest Day W2", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Active recovery — light walk or gentle stretching if desired."],
      },
      {
        day: "Day 4", name: "SB: Back Volume", focus: "Upper Body – Pull", duration: "50 min", calories: "300",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Deadlifts – 3×8", "T-Bar Rows – 4×10", "Lat Pulldowns – 3×12", "Dumbbell Curls – 3×12", "Shrugs – 3×15"],
      },
      {
        day: "Day 5", name: "SB: Core Strength", focus: "Core Training", duration: "30 min", calories: "200",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Turkish Get-Ups – 3×5 each", "Pallof Press – 3×12 each", "Dragon Flags – 3×8", "Russian Twists – 3×20", "Side Plank – 3×30s each"],
      },
      {
        day: "Day 6", name: "SB: Compound Day", focus: "Full Body", duration: "60 min", calories: "380",
        difficulty: "Hard", icon: Zap,
        exercises: ["Clean & Press – 4×6", "Front Squats – 4×8", "Pendlay Rows – 4×8", "Weighted Pull-Ups – 3×6", "Push-Ups – 3×20"],
      },
      {
        day: "Day 7", name: "SB: Recovery W2", focus: "Recovery", duration: "25 min", calories: "70",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Yoga-based recovery session. Focus on thoracic spine and hip mobility."],
      },
    ],
  },
  {
    week: 3,
    title: "Strength Phase",
    workouts: [
      {
        day: "Day 1", name: "SB: Heavy Bench", focus: "Upper Body – Push", duration: "55 min", calories: "340",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Bench Press – 5×5 (heavy)", "Incline Press – 3×8", "Military Press – 4×6", "Close-Grip Bench – 3×8", "Cable Flyes – 3×12"],
      },
      {
        day: "Day 2", name: "SB: Heavy Squats", focus: "Lower Body", duration: "60 min", calories: "400",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Back Squats – 5×5 (heavy)", "Front Squats – 3×6", "Hack Squats – 3×10", "Leg Curls – 3×12", "Calf Raises – 4×15"],
      },
      {
        day: "Day 3", name: "SB: Rest Day W3", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Full rest day. Ensure adequate protein intake (1g per lb bodyweight)."],
      },
      {
        day: "Day 4", name: "SB: Heavy Pulls", focus: "Upper Body – Pull", duration: "55 min", calories: "360",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Deadlifts – 5×3 (heavy)", "Barbell Rows – 4×6", "Weighted Chin-Ups – 4×5", "EZ-Bar Curls – 3×10", "Face Pulls – 3×15"],
      },
      {
        day: "Day 5", name: "SB: Core Power", focus: "Core Training", duration: "30 min", calories: "230",
        difficulty: "Hard", icon: Zap,
        exercises: ["Weighted Plank – 3×45s", "Ab Wheel – 4×10", "Hanging Leg Raises – 4×12", "Landmine Rotations – 3×10 each", "L-Sits – 3×max hold"],
      },
      {
        day: "Day 6", name: "SB: Power Complex", focus: "Full Body", duration: "55 min", calories: "400",
        difficulty: "Hard", icon: Zap,
        exercises: ["Power Cleans – 5×3", "Push Jerk – 4×5", "Front Squats – 3×6", "Barbell Rows – 3×8", "Farmer Walks – 3×50m"],
      },
      {
        day: "Day 7", name: "SB: Recovery W3", focus: "Recovery", duration: "20 min", calories: "60",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Gentle mobility work. Prepare mentally for peak week testing."],
      },
    ],
  },
  {
    week: 4,
    title: "Peak & Test",
    workouts: [
      {
        day: "Day 1", name: "SB: Bench Max Test", focus: "Upper Body – Push", duration: "60 min", calories: "350",
        difficulty: "Hard", icon: Zap,
        exercises: ["Bench Press – work to 1RM", "Paused Bench – 3×3", "Overhead Press – 3×5", "Board Press – 3×5", "Tricep work – 3×12"],
      },
      {
        day: "Day 2", name: "SB: Squat Max Test", focus: "Lower Body", duration: "60 min", calories: "420",
        difficulty: "Hard", icon: Zap,
        exercises: ["Back Squat – work to 1RM", "Pause Squats – 3×3", "Leg Press – 3×8", "Walking Lunges – 3×10 each", "Calf Raises – 3×20"],
      },
      {
        day: "Day 3", name: "SB: Rest Day W4", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Critical rest before deadlift max test. Stay hydrated and well-fed."],
      },
      {
        day: "Day 4", name: "SB: Deadlift Max Test", focus: "Upper Body – Pull", duration: "55 min", calories: "400",
        difficulty: "Hard", icon: Zap,
        exercises: ["Deadlift – work to 1RM", "Deficit Deadlifts – 3×3", "Barbell Rows – 3×8", "Chin-Ups – 3×max", "Shrugs – 3×12"],
      },
      {
        day: "Day 5", name: "SB: Press Max Test", focus: "Core Training", duration: "50 min", calories: "310",
        difficulty: "Hard", icon: Zap,
        exercises: ["Overhead Press – work to 1RM", "Push Press – 3×5", "Core Circuit – 3 rounds", "Plank – 3×60s", "Hanging Leg Raises – 3×12"],
      },
      {
        day: "Day 6", name: "SB: Deload Session", focus: "Full Body", duration: "40 min", calories: "200",
        difficulty: "Easy", icon: Dumbbell,
        exercises: ["Light Squats – 3×10 (50%)", "Light Bench – 3×10 (50%)", "Light Rows – 3×10 (50%)", "Band Pull-Aparts – 3×15", "Mobility work – 10 min"],
      },
      {
        day: "Day 7", name: "SB: Final Recovery", focus: "Recovery", duration: "25 min", calories: "60",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Celebrate your progress! Full stretch session and reflection on strength gains."],
      },
    ],
  },
];

const StrengthBuilderProgram = () => {
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
      .eq("category", "strength-builder-program")
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
      user_id: user.id, workout_name: name, category: "strength-builder-program", duration, calories,
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

  const activeWorkouts = weeks.flatMap((w) => w.workouts.filter((wo) => !wo.isRest));
  const totalWorkouts = activeWorkouts.length;
  const completedCount = activeWorkouts.filter((wo) => completed.has(wo.name)).length;
  const progress = totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0;

  return (
    <Layout>
      <section className="relative overflow-hidden bg-primary">
        <img src={strengthImg} alt="Strength Builder" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/50" />
        <FloatingFitnessIcons />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/10 backdrop-blur-sm">Advanced</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 4 Weeks
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Strength Builder</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            A progressive overload program focused on the big four compound lifts. Build raw strength through periodized training phases.
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
          <p className="text-muted-foreground mb-8">Focus on progressive overload — increase weight or reps each week.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {weeks[activeWeek].workouts.map((wo, i) => (
              <ProgramWorkoutCard key={wo.name} workout={wo} completed={completed.has(wo.name)} loading={loading === wo.name}
                onComplete={() => markComplete(wo.name, wo.duration, wo.calories)} index={i} />
            ))}
          </div>
        </div>
      </section>

      <WorkoutCongrats
        open={congratsOpen}
        onClose={() => setCongratsOpen(false)}
        workoutName={lastCompleted}
        progress={progress}
      />
    </Layout>
  );
};

export default StrengthBuilderProgram;
