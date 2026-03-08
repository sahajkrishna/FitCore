import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Flame, Loader2, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WorkoutDay {
  day: string;
  name: string;
  focus: string;
  duration: string;
  calories: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  exercises: string[];
  icon: LucideIcon;
  isRest?: boolean;
}

export interface ProgramWeek {
  week: number;
  title: string;
  workouts: WorkoutDay[];
}

const diffBadge = (d: string) =>
  d === "Easy"
    ? "bg-success/10 text-success border-success/20"
    : d === "Moderate"
    ? "bg-accent/10 text-accent border-accent/20"
    : "bg-destructive/10 text-destructive border-destructive/20";

interface Props {
  workout: WorkoutDay;
  completed: boolean;
  loading: boolean;
  onComplete: () => void;
}

const ProgramWorkoutCard = ({ workout: wo, completed: done, loading: isLoading, onComplete }: Props) => {
  const IconComp = wo.icon;

  if (wo.isRest) {
    return (
      <div className="overflow-hidden rounded-xl bg-card shadow-card border border-border/40">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Moon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{wo.day}</p>
              <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{wo.exercises[0]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`group overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${done ? "ring-2 ring-success/40" : ""}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${done ? "bg-success/10" : "bg-accent/10"}`}>
              {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <IconComp className="h-5 w-5 text-accent" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{wo.day}</p>
              <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] ${diffBadge(wo.difficulty)}`}>
            {wo.difficulty}
          </Badge>
        </div>

        {/* Focus */}
        <p className="mt-2 text-xs font-semibold text-accent uppercase tracking-wider">{wo.focus}</p>

        {/* Exercise list */}
        <ul className="mt-3 space-y-1.5">
          {wo.exercises.map((ex, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
              {ex}
            </li>
          ))}
        </ul>

        {/* Meta */}
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{wo.duration}</span>
          <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{wo.calories} cal</span>
        </div>

        {/* Button */}
        <Button
          variant={done ? "success" : "coral"}
          size="sm"
          className="mt-4 w-full gap-1"
          disabled={done || isLoading}
          onClick={onComplete}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : done ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</>
          ) : (
            <><Circle className="h-3.5 w-3.5" /> Start Workout</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramWorkoutCard;
