import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-bold">
            <Dumbbell className="h-5 w-5 text-accent" />
            FitCore
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Your trusted resource for health, fitness, and nutrition guidance.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Pages</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/workouts" className="text-primary-foreground/70 hover:text-accent transition-colors">Workouts</Link>
            <Link to="/nutrition" className="text-primary-foreground/70 hover:text-accent transition-colors">Nutrition</Link>
            <Link to="/blog" className="text-primary-foreground/70 hover:text-accent transition-colors">Blog</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Stay Connected</h4>
          <p className="mt-3 text-sm text-primary-foreground/70">Follow us for daily fitness tips and motivation.</p>
        </div>
      </div>
      <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © 2026 FitCore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
