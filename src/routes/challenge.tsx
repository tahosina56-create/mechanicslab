import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { fmt, rpmToRadS, torque } from "@/lib/engineering";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/challenge")({
  head: () => ({
    meta: [
      { title: "Engineering Challenge — MechMind Lab" },
      { name: "description", content: "Solve a shaft torque problem and get instant feedback with the full method." },
      { property: "og:title", content: "Engineering Challenge — MechMind Lab" },
      { property: "og:description", content: "Test yourself on a real-world shaft torque problem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengePage,
});

const P = 7500, N = 960;
const r = torque(P, rpmToRadS(N));
const answer = r.ok ? r.value : 0;

function ChallengePage() {
  const [val, setVal] = useState("");
  const [state, setState] = useState<null | "ok" | "close" | "wrong" | "invalid">(null);

  const submit = () => {
    const x = Number(val);
    if (val.trim() === "" || !Number.isFinite(x)) return setState("invalid");
    const err = Math.abs(x - answer) / answer;
    setState(err <= 0.02 ? "ok" : err <= 0.1 ? "close" : "wrong");
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Challenge 01" title="Pump shaft torque" desc="A 7.5 kW motor drives a pump shaft at 960 rpm. Find the transmitted torque in N·m." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="panel p-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <label className="text-sm text-muted-foreground">Your answer (N·m)</label>
          <div className="mt-2 flex gap-2">
            <input value={val} onChange={(e) => setVal(e.target.value)} inputMode="decimal"
              className="min-w-0 flex-1 rounded-lg border border-input bg-background/80 px-3 py-2.5 font-mono outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <Button type="submit" className="h-auto px-5 font-semibold shadow-[var(--glow)]">Submit</Button>
          </div>
          {state && (
            <p className={`mt-4 text-sm ${state === "ok" ? "text-success" : state === "close" ? "text-warning" : "text-destructive"}`}>
              {state === "ok" && "Correct — nicely done."}
              {state === "close" && "Close! Check your rounding or unit conversion."}
              {state === "wrong" && "Not quite. Did you convert rpm to rad/s?"}
              {state === "invalid" && "Enter a valid number."}
            </p>
          )}
        </form>
        {state && state !== "invalid" && (
          <div className="panel border-primary/25 p-6 font-mono text-sm animate-in fade-in">
            <p className="font-sans font-semibold">Method</p>
            <p className="mt-3 text-muted-foreground">1. ω = 2πN / 60 = 2π × {N} / 60 = {fmt(rpmToRadS(N))} rad/s</p>
            <p className="mt-2 text-muted-foreground">2. T = P / ω = {P} / {fmt(rpmToRadS(N))}</p>
            <p className="mt-3 text-base">T ≈ <span className="text-primary">{fmt(answer, 2)} N·m</span></p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
