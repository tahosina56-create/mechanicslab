import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calculator, Cog, GraduationCap, Boxes, Trophy, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MechMind Lab — Think. Design. Engineer." },
      { name: "description", content: "AI-assisted learning lab for mechanical engineering students: tutor, calculators, machine design and CAD planning." },
      { property: "og:title", content: "MechMind Lab — Think. Design. Engineer." },
      { property: "og:description", content: "Learn mechanics, run calculations and plan CAD models in one engineering lab." },
    ],
  }),
  component: Dashboard,
});

const examples = [
  "Why does torque drop as shaft speed increases?",
  "Explain the first law of thermodynamics",
  "How do I size a shaft for 5 kW at 1450 rpm?",
];

const modules = [
  { to: "/tutor", icon: GraduationCap, title: "AI Tutor", desc: "Concept, formula, worked example, answer.", tag: "Preview" },
  { to: "/calculator", icon: Calculator, title: "Engineering Calculator", desc: "Torque, speed, gears and stress.", tag: "Live" },
  { to: "/machine-design", icon: Cog, title: "Machine Design Explorer", desc: "Gear trains, belt drives, shafts.", tag: "Preview" },
  { to: "/cad", icon: Boxes, title: "CAD Assistant", desc: "Step-by-step modeling plans.", tag: "Preview" },
] as const;

const activity = [
  { t: "Torque calculation · 5 kW @ 1450 rpm", time: "2h ago" },
  { t: "Gear ratio · 20T → 60T", time: "Yesterday" },
  { t: "Tutor · Bending stress in beams", time: "2 days ago" },
];

function GearArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <g className="origin-center animate-spin-slow" style={{ transformOrigin: "80px 90px" }}>
        <circle cx="80" cy="90" r="46" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="9 9" className="text-primary/60" />
        <circle cx="80" cy="90" r="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <circle cx="80" cy="90" r="8" fill="currentColor" className="text-primary" />
      </g>
      <g className="animate-spin-slow-rev" style={{ transformOrigin: "145px 140px" }}>
        <circle cx="145" cy="140" r="30" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="7 7" className="text-muted-foreground/60" />
        <circle cx="145" cy="140" r="6" fill="currentColor" className="text-muted-foreground" />
      </g>
    </svg>
  );
}

function Dashboard() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const ask = (text: string) => navigate({ to: "/tutor", search: { q: text } as never });

  return (
    <AppShell>
      <section className="panel relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 opacity-70 sm:h-96 sm:w-96">
          <GearArt />
        </div>
        <div className="relative max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Engineering learning lab</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
            Think. Design. <span className="text-primary text-glow">Engineer.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Ask a question, run a calculation, or plan your next CAD model.</p>
          <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }}>
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Ask about mechanics, thermo, materials…"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Ask tutor <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((e) => (
              <button key={e} onClick={() => ask(e)} className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                {e}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map(({ to, icon: Icon, title, desc, tag }) => (
          <Link key={to} to={to} className="panel panel-hover group p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent"><Icon className="h-5 w-5 text-primary" /></span>
              <span className={`font-mono text-[10px] uppercase tracking-wider ${tag === "Live" ? "text-success" : "text-muted-foreground"}`}>● {tag}</span>
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-80 group-hover:opacity-100">Open <ArrowRight className="h-3 w-3" /></span>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-1">
          <h2 className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-primary" /> Recent activity</h2>
          <ul className="mt-4 divide-y divide-border">
            {activity.map((a) => (
              <li key={a.t} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{a.t}</span><span className="shrink-0 font-mono text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Sample data</p>
        </div>
        <div className="panel p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold"><Trophy className="h-4 w-4 text-primary" /> Featured challenge</h2>
          <p className="mt-4 text-lg">A 7.5 kW motor drives a pump shaft at 960 rpm. What torque does the shaft transmit?</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">Mechanics · Beginner</span>
            <Link to="/challenge" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Solve it <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
