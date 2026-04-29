import { useEffect, useState } from "react";

const BASE = 18;
const VARIANCE = 22;

const getCount = () => BASE + Math.floor(Math.random() * VARIANCE);

const LiveUsersIndicator = () => {
  const [count, setCount] = useState<number>(() => getCount());

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
        const next = prev + delta;
        if (next < BASE) return BASE + Math.floor(Math.random() * 4);
        if (next > BASE + VARIANCE + 8) return BASE + VARIANCE;
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2.5 rounded-full border border-border/60 bg-card/90 px-4 py-2 shadow-card backdrop-blur-md animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      <p className="text-xs font-medium text-foreground">
        <span className="font-bold text-accent tabular-nums">{count}</span>{" "}
        <span className="text-muted-foreground">users exploring FitCore right now</span>
      </p>
    </div>
  );
};

export default LiveUsersIndicator;