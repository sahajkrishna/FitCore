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
import fatLossImg from "@/assets/programs/fat-loss.jpg";

const weeks: ProgramWeek[] = [
  {
    week: 1,
    title: "Foundation Week",
    workouts: [
      {
        day: "Day 1", name: "Upper Body Burn", focus: "Upper Body", duration: "35 min", calories: "280",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Push-ups – 3×15", "Dumbbell Rows – 3×12", "Shoulder Press – 3×10", "Tricep Dips – 3×12", "Plank Hold – 3×30s"],
      },
      {
        day: "Day 2", name: "HIIT Cardio Blast", focus: "Cardio", duration: "30 min", calories: "350",
        difficulty: "Hard", icon: Heart,
        exercises: ["Burpees – 4×10", "Mountain Climbers – 4×20", "Jump Squats – 4×15", "High Knees – 4×30s", "Box Jumps – 3×10"],
      },
      {
        day: "Day 3", name: "Rest & Recover", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Light stretching, foam rolling, and hydration. Let your muscles recover."],
      },
      {
        day: "Day 4", name: "Lower Body Burn", focus: "Lower Body", duration: "40 min", calories: "320",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Goblet Squats – 4×12", "Walking Lunges – 3×14 each", "Leg Press – 3×12", "Calf Raises – 3×20", "Glute Bridges – 3×15"],
      },
      {
        day: "Day 5", name: "Core Crusher", focus: "Core Training", duration: "25 min", calories: "200",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Bicycle Crunches – 3×20", "Russian Twists – 3×20", "Leg Raises – 3×15", "Dead Bug – 3×12 each", "Plank – 3×45s"],
      },
      {
        day: "Day 6", name: "Full Body Circuit", focus: "Full Body", duration: "40 min", calories: "380",
        difficulty: "Hard", icon: Zap,
        exercises: ["Kettlebell Swings – 4×15", "Push-ups – 3×15", "Squat Jumps – 3×12", "Renegade Rows – 3×10", "Burpees – 3×10"],
      },
      {
        day: "Day 7", name: "Active Recovery", focus: "Recovery", duration: "20 min", calories: "100",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Light yoga flow, gentle stretching, and a 15-minute walk. Focus on breathing."],
      },
    ],
  },
  {
    week: 2,
    title: "Ramp Up",
    workouts: [
      {
        day: "Day 1", name: "Push-Pull Power", focus: "Upper Body", duration: "40 min", calories: "300",
        difficulty: "Moderate", icon: Dumbbell,
        exercises: ["Bench Press – 3×12", "Bent-Over Rows – 3×12", "Lateral Raises – 3×15", "Bicep Curls – 3×12", "Skull Crushers – 3×12"],
      },
      {
        day: "Day 2", name: "Tabata Intervals", focus: "Cardio", duration: "25 min", calories: "320",
        difficulty: "Hard", icon: Heart,
        exercises: ["Sprint Intervals – 8×20s/10s", "Jumping Jacks – 4×30s", "Squat Thrusters – 4×12", "Battle Ropes – 4×20s"],
      },
      {
        day: "Day 3", name: "Rest Day", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Rest and recharge. Prioritize sleep, nutrition, and hydration."],
      },
      {
        day: "Day 4", name: "Metabolic Legs", focus: "Lower Body", duration: "40 min", calories: "360",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Barbell Squats – 4×10", "Romanian Deadlifts – 3×12", "Step-Ups – 3×12 each", "Leg Curls – 3×15", "Wall Sit – 3×45s"],
      },
      {
        day: "Day 5", name: "Core & Abs", focus: "Core Training", duration: "25 min", calories: "220",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Hanging Leg Raises – 3×12", "Cable Woodchops – 3×12 each", "Ab Wheel – 3×10", "Side Plank – 3×30s each", "Flutter Kicks – 3×20"],
      },
      {
        day: "Day 6", name: "AMRAP Challenge", focus: "Full Body", duration: "35 min", calories: "400",
        difficulty: "Hard", icon: Zap,
        exercises: ["Thrusters – max reps in 1 min", "Pull-Ups – max reps", "Box Jumps – max reps in 1 min", "Push-Ups – max reps", "Repeat 4 rounds"],
      },
      {
        day: "Day 7", name: "Yoga & Stretch", focus: "Recovery", duration: "30 min", calories: "80",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Full-body yoga flow with emphasis on hip openers and hamstring stretches."],
      },
    ],
  },
  {
    week: 3,
    title: "Peak Intensity",
    workouts: [
      {
        day: "Day 1", name: "Superset Upper Body", focus: "Upper Body", duration: "40 min", calories: "320",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Chest Press + Rows superset – 4×10", "Shoulder Press + Face Pulls – 3×12", "Dips + Curls superset – 3×12", "Diamond Push-Ups – 3×10"],
      },
      {
        day: "Day 2", name: "Sprint Intervals", focus: "Cardio", duration: "25 min", calories: "380",
        difficulty: "Hard", icon: Heart,
        exercises: ["400m Sprints – 6 sets", "Recovery Walk – 90s between", "Stair Climbs – 4×1 min", "Cooldown Jog – 5 min"],
      },
      {
        day: "Day 3", name: "Recovery Day", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["Complete rest or light mobility work. Foam roll any tight areas."],
      },
      {
        day: "Day 4", name: "Plyometric Legs", focus: "Lower Body", duration: "35 min", calories: "400",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Jump Squats – 4×12", "Lateral Bounds – 3×10 each", "Single-Leg Deadlifts – 3×10 each", "Box Jumps – 4×8", "Calf Raises – 4×20"],
      },
      {
        day: "Day 5", name: "Core Inferno", focus: "Core Training", duration: "30 min", calories: "250",
        difficulty: "Hard", icon: Zap,
        exercises: ["Dragon Flags – 3×8", "Turkish Get-Ups – 3×5 each", "Pallof Press – 3×12 each", "V-Ups – 3×15", "Plank – 3×60s"],
      },
      {
        day: "Day 6", name: "Full Body Burner", focus: "Full Body", duration: "40 min", calories: "420",
        difficulty: "Hard", icon: Zap,
        exercises: ["Clean & Press – 4×8", "Pull-Ups – 4×8", "Front Squats – 4×10", "Burpees – 3×12", "Farmer Carries – 3×40m"],
      },
      {
        day: "Day 7", name: "Guided Stretch", focus: "Recovery", duration: "25 min", calories: "70",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Deep stretch session targeting all major muscle groups. Focus on areas of tension."],
      },
    ],
  },
  {
    week: 4,
    title: "Final Push",
    workouts: [
      {
        day: "Day 1", name: "Max Effort Upper", focus: "Upper Body", duration: "45 min", calories: "350",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Incline Bench Press – 4×8", "Weighted Pull-Ups – 4×6", "Arnold Press – 3×10", "Close-Grip Bench – 3×10", "Face Pulls – 3×15"],
      },
      {
        day: "Day 2", name: "HIIT Max Effort", focus: "Cardio", duration: "30 min", calories: "420",
        difficulty: "Hard", icon: Heart,
        exercises: ["Bike Sprints – 10×30s/30s", "Devil Press – 4×8", "Shuttle Runs – 6×20m", "Rowing Sprints – 4×250m"],
      },
      {
        day: "Day 3", name: "Rest Day", focus: "Recovery", duration: "—", calories: "0",
        difficulty: "Easy", icon: Moon, isRest: true,
        exercises: ["You've earned it. Full rest — stay hydrated and eat well."],
      },
      {
        day: "Day 4", name: "Leg Day Finisher", focus: "Lower Body", duration: "40 min", calories: "380",
        difficulty: "Hard", icon: Dumbbell,
        exercises: ["Barbell Squats – 5×5 (heavy)", "Leg Press – 4×12", "Hack Squats – 3×10", "Walking Lunges – 3×12 each", "Seated Calf Raises – 4×20"],
      },
      {
        day: "Day 5", name: "Core Finisher", focus: "Core Training", duration: "25 min", calories: "200",
        difficulty: "Moderate", icon: Zap,
        exercises: ["Hanging Leg Raises – 4×12", "Cable Crunches – 3×15", "Plank – 3×60s", "Dead Bug – 3×12 each", "Bird Dog – 3×10 each"],
      },
      {
        day: "Day 6", name: "The Grand Finale", focus: "Full Body", duration: "45 min", calories: "450",
        difficulty: "Hard", icon: Zap,
        exercises: ["Deadlifts – 4×6", "Push Press – 4×8", "Barbell Rows – 4×10", "Box Jumps – 3×10", "Burpee Pull-Ups – 3×8"],
      },
      {
        day: "Day 7", name: "Celebration Stretch", focus: "Recovery", duration: "25 min", calories: "80",
        difficulty: "Easy", icon: StretchHorizontal, isRest: true,
        exercises: ["Congratulations! Full-body stretching and meditation to close out the program."],
      },
    ],
  },
];

const FatLossProgram = () => {
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
      .eq("category", "fat-loss-program")
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
      user_id: user.id, workout_name: name, category: "fat-loss-program", duration, calories,
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <img src={fatLossImg} alt="Fat Loss Program" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container relative z-10 py-16 md:py-24">
          <Link to="/workouts" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Workouts
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/10 backdrop-blur-sm">Intermediate</Badge>
            <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" /> 4 Weeks
            </Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl">Fat Loss Program</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70 text-lg">
            A 4-week high-intensity program combining HIIT, strength circuits, and active recovery to maximize fat burn and build lean muscle.
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

      {/* Weekly plan */}
      <section className="container py-12 md:py-16">
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {weeks.map((w, i) => {
            const active = w.workouts.filter((wo) => !wo.isRest);
            const weekCompleted = active.filter((wo) => completed.has(wo.name)).length;
            const allDone = weekCompleted === active.length;
            return (
              <button
                key={w.week}
                onClick={() => setActiveWeek(i)}
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
          <h2 className="font-heading text-2xl font-bold text-primary mb-2">
            Week {weeks[activeWeek].week}: {weeks[activeWeek].title}
          </h2>
          <p className="text-muted-foreground mb-8">Complete each workout to progress through the program.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeks[activeWeek].workouts.map((wo) => (
              <ProgramWorkoutCard
                key={wo.name}
                workout={wo}
                completed={completed.has(wo.name)}
                loading={loading === wo.name}
                onComplete={() => markComplete(wo.name, wo.duration, wo.calories)}
              />
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

export default FatLossProgram;
