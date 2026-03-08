import { Dumbbell, Heart, Flame, Zap, Trophy } from "lucide-react";

const icons = [Dumbbell, Heart, Flame, Zap, Trophy];

const positions = [
  { top: "12%", right: "8%", size: 28, delay: 0 },
  { top: "35%", right: "3%", size: 20, delay: 1.2 },
  { top: "60%", right: "12%", size: 24, delay: 2.4 },
  { top: "20%", right: "18%", size: 16, delay: 0.8 },
  { top: "75%", right: "6%", size: 18, delay: 1.8 },
];

const FloatingFitnessIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
    {positions.map((pos, i) => {
      const Icon = icons[i % icons.length];
      return (
        <div
          key={i}
          className="absolute text-primary-foreground/10"
          style={{
            top: pos.top,
            right: pos.right,
            animation: `float-icon 6s ease-in-out ${pos.delay}s infinite`,
          }}
        >
          <Icon size={pos.size} strokeWidth={1.5} />
        </div>
      );
    })}
  </div>
);

export default FloatingFitnessIcons;
