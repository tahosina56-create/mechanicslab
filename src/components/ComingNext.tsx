import { Link } from "@tanstack/react-router";
import { AppShell, DemoBadge, PageHeader } from "@/components/AppShell";

export function ComingNext({ eyebrow, title, desc, items }: { eyebrow: string; title: string; desc: string; items: string[] }) {
  return (
    <AppShell>
      <PageHeader eyebrow={eyebrow} title={title} desc={desc} />
      <div className="panel p-6">
        <DemoBadge>Coming in the next step</DemoBadge>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((i) => (
            <li key={i} className="rounded-lg border border-border bg-background/50 p-4 text-sm">{i}</li>
          ))}
        </ul>
        <Link to="/calculator" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try the calculator meanwhile</Link>
      </div>
    </AppShell>
  );
}
