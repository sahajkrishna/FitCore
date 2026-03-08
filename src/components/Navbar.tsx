import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Dumbbell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/workouts", label: "Workouts" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Pricing" },
  { to: "/ai-workout", label: "AI Generator" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Dumbbell className="h-6 w-6 text-accent" />
          FitCore
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/5"
                }`}
              >
                {l.label}
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-accent transition-all duration-200 ${
                    isActive ? "w-4" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="coral" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="coral" size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 pb-4 md:hidden">
          {links.map((l) => {
            const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-foreground/60 hover:bg-accent/5 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {user ? (
            <>
              <Button variant="coral" size="sm" className="mt-2 w-full" asChild>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => { handleSignOut(); setOpen(false); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
                <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
              </Button>
              <Button variant="coral" size="sm" className="mt-2 w-full" asChild>
                <Link to="/signup" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
