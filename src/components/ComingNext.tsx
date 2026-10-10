import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AppShell, DemoBadge, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export function ComingNext({ eyebrow, title, desc, items }: { eyebrow: string; title: string; desc: string; items: string[] }) {
  return (
    <AppShell>
      <PageHeader eyebrow={eyebrow} title={title} desc={desc} />
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 bg-primary/10 blur-3xl" />
        <DemoBadge>Coming in the next step</DemoBadge>
        <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-primary"><Check className="h-3.5 w-3.5" /></span>
              {i}
            </li>
          ))}
        </ul>
        <Button asChild className="relative mt-6 shadow-[var(--glow)]">
          <Link to="/calculator">Try the calculator meanwhile <ArrowRight /></Link>
        </Button>
      </div>
    </AppShell>
  );
}
