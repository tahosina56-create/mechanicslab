import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/calculator", label: "Calculator" },
  { to: "/machine-design", label: "Machine Design" },
  { to: "/cad", label: "CAD Assistant" },
  { to: "/challenge", label: "Challenge" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-primary/40 bg-accent shadow-[var(--glow)]">
        <Cog className="h-5 w-5 text-primary animate-spin-slow" />
      </span>
      <span className="font-display text-lg font-semibold">
        MechMind<span className="text-primary"> Lab</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background bg-blueprint">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
                activeProps={{ className: "bg-accent !text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent)]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                activeProps={{ className: "bg-accent !text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <footer className="border-t border-border/70 bg-background/70 py-6 text-center text-xs text-muted-foreground">
        MechMind Lab · Educational calculations only — not validated engineering designs.
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export function DemoBadge({ children = "Demo response" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      {children}
    </span>
  );
}
