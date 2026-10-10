import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "mechmind-welcome-dismissed";

export function WelcomeOverlay() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* private mode — just close */
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to MechMind Lab"
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
    >
      <div className="panel relative w-full max-w-lg p-6 sm:p-8">
        <button
          onClick={dismiss}
          aria-label="Close welcome message"
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="grid h-11 w-11 place-items-center rounded-lg border border-primary/40 bg-accent shadow-[var(--glow)]">
          <Sparkles className="h-5 w-5 text-primary" />
        </span>

        <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
          Welcome to <span className="text-primary text-glow">MechMind</span>
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Your AI powered assistant for CAD modeling, mechanics problem solving, and SolidWorks diagnostics.
        </p>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={dismiss}
            className="h-auto px-5 py-3 font-semibold shadow-[var(--glow)]"
          >
            Jump into the CAD tools
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              dismiss();
              navigate({ to: "/cad" });
            }}
            className="h-auto px-5 py-3 font-medium"
          >
            Open CAD Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}
