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

const focusGradient = (focus: string) => {
  if (focus.toLowerCase().includes("upper")) return "from-accent/20 to-accent/5";
  if (focus.toLowerCase().includes("lower")) return "from-primary/20 to-primary/5";
  if (focus.toLowerCase().includes("cardio")) return "from-destructive/20 to-destructive/5";
  if (focus.toLowerCase().includes("core")) return "from-accent/15 to-success/10";
  if (focus.toLowerCase().includes("full")) return "from-primary/15 to-accent/10";
  return "from-muted to-muted/50";
};

interface Props {
  workout: WorkoutDay;
  completed: boolean;
  loading: boolean;
  onComplete: () => void;
  index?: number;
}

const ProgramWorkoutCard = ({ workout: wo, completed: done, loading: isLoading, onComplete, index = 0 }: Props) => {
  const IconComp = wo.icon;

  if (wo.isRest) {
    return (
      <div
        className="overflow-hidden rounded-xl bg-card shadow-card border border-border/40 opacity-0 animate-scale-in"
        style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-secondary">
              <Moon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{wo.day}</p>
              <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground italic">{wo.exercises[0]}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1.5 opacity-0 animate-scale-in ${
        done ? "ring-2 ring-success/50" : ""
      }`}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      {/* Top gradient strip based on workout focus */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${focusGradient(wo.focus)}`} />

      {/* Completed overlay shimmer */}
      {done && (
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500 ${
                done
                  ? "bg-success/10"
                  : "bg-gradient-to-br from-accent/15 to-accent/5 group-hover:from-accent/25 group-hover:to-accent/10"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-success animate-check-pop" />
              ) : (
                <IconComp className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{wo.day}</p>
              <h3 className="font-heading text-base font-bold text-primary">{wo.name}</h3>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] ${diffBadge(wo.difficulty)}`}>
            {wo.difficulty}
          </Badge>
        </div>

        {/* Focus tag */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/8 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">{wo.focus}</span>
        </div>

        {/* Exercise list */}
        <ul className="mt-3 space-y-1.5">
          {wo.exercises.map((ex, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground group/item">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                done ? "bg-success/60" : "bg-accent/40 group-hover/item:bg-accent"
              }`} />
              <span className={done ? "line-through opacity-60" : ""}>{ex}</span>
            </li>
          ))}
        </ul>

        {/* Meta row */}
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1">
            <Clock className="h-3 w-3 text-primary/60" />{wo.duration}
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1">
            <Flame className="h-3 w-3 text-accent/60" />{wo.calories} cal
          </span>
        </div>

        {/* Button */}
        <Button
          variant={done ? "success" : "coral"}
          size="sm"
          className={`mt-4 w-full gap-1.5 transition-all duration-300 ${
            !done && !isLoading ? "hover:shadow-lg hover:shadow-accent/20" : ""
          }`}
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
