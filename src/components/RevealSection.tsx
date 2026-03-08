import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const RevealSection = ({ children, className, delay = 0 }: RevealSectionProps) => {
  const { ref, visible } = useReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealSection;
