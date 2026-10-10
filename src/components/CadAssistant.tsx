import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, RotateCcw, Box } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cadProjects, type CadProject } from "@/lib/cad-projects";
import { cn } from "@/lib/utils";

export function CadAssistant({ extra }: { extra?: ReactNode }) {
  const [active, setActive] = useState<CadProject | null>(null);
  return (
    <AppShell>
      <PageHeader eyebrow="Module 04" title="CAD Assistant" desc="Pick a project to open a step-by-step modelling guide with live parameters and checklists." />
      {active ? (
        <Viewer key={active.id} project={active} onBack={() => setActive(null)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cadProjects.map((p) => (
            <button key={p.id} onClick={() => setActive(p)} className="panel panel-hover group p-6 text-left">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary"><Box className="h-5 w-5" /></span>
                <span className="rounded-full border border-primary/30 px-2.5 py-0.5 font-mono text-xs text-accent-foreground">{p.level}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
              <p className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                {p.steps.length} steps · Open viewer <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </p>
            </button>
          ))}
        </div>
      )}
      {extra && <div className="mt-8">{extra}</div>}
    </AppShell>
  );
}

function Viewer({ project, onBack }: { project: CadProject; onBack: () => void }) {
  const initial = useMemo(() => Object.fromEntries(project.params.map((p) => [p.key, p.value])), [project]);
  const [vals, setVals] = useState<Record<string, number>>(initial);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const step = project.steps[idx]!;
  const total = project.steps.reduce((s, st) => s + st.checks.length, 0);
  const ticked = Object.values(done).filter(Boolean).length;
  const stepDone = (i: number) => project.steps[i]!.checks.every((_, c) => done[`${i}-${c}`]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}><ArrowLeft /> All projects</Button>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono text-muted-foreground">{ticked}/{total} checks</span>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${(ticked / total) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_280px]">
        <nav className="panel p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">{project.title}</p>
          {project.steps.map((s, i) => (
            <button key={s.title} onClick={() => setIdx(i)}
              className={cn("flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition",
                i === idx ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted")}>
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-xs",
                stepDone(i) ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                {stepDone(i) ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {s.title}
            </button>
          ))}
        </nav>

        <section className="panel p-6">
          <p className="font-mono text-xs text-primary">STEP {idx + 1} / {project.steps.length} · {step.tool}</p>
          <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
          <p className="mt-4 rounded-lg border border-primary/20 bg-background/60 p-4 font-mono text-sm leading-relaxed">{step.detail(vals)}</p>
          <h3 className="mt-6 text-sm font-semibold">Checklist</h3>
          <ul className="mt-2 space-y-2">
            {step.checks.map((c, ci) => {
              const k = `${idx}-${ci}`;
              return (
                <li key={k}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/50 p-3 text-sm hover:border-primary/50">
                    <input type="checkbox" checked={!!done[k]} onChange={(e) => setDone((d) => ({ ...d, [k]: e.target.checked }))} className="h-4 w-4 accent-[var(--primary)]" />
                    <span className={cn(done[k] && "text-muted-foreground line-through")}>{c}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><ArrowLeft /> Previous</Button>
            <Button disabled={idx === project.steps.length - 1} onClick={() => setIdx(idx + 1)}>Next <ArrowRight /></Button>
          </div>
        </section>

        <aside className="panel p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Parameters</h3>
            <Button size="sm" variant="ghost" onClick={() => setVals(initial)}><RotateCcw /> Reset</Button>
          </div>
          <div className="mt-3 space-y-4">
            {project.params.map((p) => (
              <label key={p.key} className="block">
                <span className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.label}</span>
                  <span className="font-mono text-primary">{vals[p.key]} {p.unit}</span>
                </span>
                <input type="range" min={p.min} max={p.max} step={p.step} value={vals[p.key]}
                  onChange={(e) => setVals((v) => ({ ...v, [p.key]: Number(e.target.value) }))}
                  className="mt-2 w-full accent-[var(--primary)]" />
              </label>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Step instructions update live as you change values.</p>
        </aside>
      </div>
    </div>
  );
}
