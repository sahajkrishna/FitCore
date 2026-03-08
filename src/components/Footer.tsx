import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-bold">
            <Dumbbell className="h-5 w-5 text-accent" />
            FitCore
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Your trusted resource for health, fitness, and nutrition guidance. Transform your body and mind with expert-designed programs.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Platform</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/workouts" className="text-primary-foreground/70 hover:text-accent transition-colors">Workouts</Link>
            <Link to="/nutrition" className="text-primary-foreground/70 hover:text-accent transition-colors">Nutrition</Link>
            <Link to="/blog" className="text-primary-foreground/70 hover:text-accent transition-colors">Blog</Link>
            <Link to="/pricing" className="text-primary-foreground/70 hover:text-accent transition-colors">Pricing</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Programs</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/programs/fat-loss" className="text-primary-foreground/70 hover:text-accent transition-colors">Fat Loss Program</Link>
            <Link to="/programs/strength-builder" className="text-primary-foreground/70 hover:text-accent transition-colors">Strength Builder</Link>
            <Link to="/programs/30-day-challenge" className="text-primary-foreground/70 hover:text-accent transition-colors">30 Day Challenge</Link>
            <Link to="/ai-workout" className="text-primary-foreground/70 hover:text-accent transition-colors">AI Generator</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Company</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors">About FitCore</Link>
            <Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors">Contact</Link>
            <Link to="/privacy" className="text-primary-foreground/70 hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-primary-foreground/70 hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © 2026 FitCore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
