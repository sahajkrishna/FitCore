import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Zap, PartyPopper } from "lucide-react";

const MOTIVATIONAL_MESSAGES = [
  { text: "Great job! Keep pushing forward!", icon: Flame },
  { text: "You're unstoppable! 💪", icon: Zap },
  { text: "One step closer to your goals!", icon: Star },
  { text: "Consistency is the key to greatness!", icon: Trophy },
  { text: "You showed up and crushed it!", icon: PartyPopper },
  { text: "Your future self will thank you!", icon: Flame },
  { text: "Champions are made in the gym!", icon: Trophy },
  { text: "Another workout down, another level up!", icon: Zap },
];

interface Props {
  open: boolean;
  onClose: () => void;
  workoutName: string;
  progress: number; // 0-100
}

const WorkoutCongrats = ({ open, onClose, workoutName, progress }: Props) => {
  const [message] = useState(
    () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  );
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const IconComp = message.icon;

  useEffect(() => {
    if (open) {
      setAnimatedProgress(0);
      const timer = setTimeout(() => setAnimatedProgress(progress), 100);
      return () => clearTimeout(timer);
    }
  }, [open, progress]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md border-accent/30 bg-card p-0 overflow-hidden">
        {/* Decorative top band */}
        <div className="relative h-28 bg-gradient-to-br from-accent via-accent/80 to-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.4),transparent_60%)]" />
          <div className="relative flex flex-col items-center animate-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Confetti dots */}
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full animate-fade-in"
              style={{
                background: ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--success))", "#fff"][i % 4],
                top: `${10 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 90}%`,
                animationDelay: `${i * 80}ms`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <div className="px-6 pb-6 pt-5 text-center">
          <h2 className="font-heading text-xl font-extrabold text-primary animate-fade-in">
            Workout Complete! 🎉
          </h2>
          <p className="mt-1 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
            {workoutName}
          </p>

          {/* Motivational message */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-4 py-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <IconComp className="h-5 w-5 text-accent shrink-0" />
            <p className="text-sm font-semibold text-accent">{message.text}</p>
          </div>

          {/* Animated progress bar */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Program Progress</span>
              <span className="font-bold text-primary">{animatedProgress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-1000 ease-out"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
          </div>

          <Button
            variant="coral"
            className="mt-6 w-full gap-2 animate-fade-in"
            style={{ animationDelay: "400ms" }}
            onClick={onClose}
          >
            <Flame className="h-4 w-4" /> Keep Going!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutCongrats;
