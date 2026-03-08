import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PremiumGateProps {
  message?: string;
}

const PremiumGate = ({ message = "This content is available for Premium members only." }: PremiumGateProps) => (
  <div className="relative rounded-xl border border-border/60 bg-muted/30 p-8 text-center backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
        <Lock className="h-7 w-7 text-accent" />
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Premium Content</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      </div>
      <Link to="/pricing">
        <Button variant="coral" size="lg" className="mt-2">
          Upgrade to Premium
        </Button>
      </Link>
    </div>
  </div>
);

export default PremiumGate;
