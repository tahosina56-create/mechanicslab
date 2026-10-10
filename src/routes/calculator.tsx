import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { CalcCard, Field } from "@/components/CalcCard";
import { convertSpeed, fmt, gear, normalStress, rpmToRadS, torque } from "@/lib/engineering";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Engineering Calculator — MechMind Lab" },
      { name: "description", content: "Torque, speed conversion, gear ratio and normal stress calculators with step-by-step substitution." },
      { property: "og:title", content: "Engineering Calculator — MechMind Lab" },
      { property: "og:description", content: "Step-by-step torque, gear and stress calculations for engineering students." },
    ],
  }),
  component: CalculatorPage,
});

type R = Parameters<typeof CalcCard>[0]["result"];
const n = (s: string) => (s.trim() === "" ? NaN : Number(s));

function CalculatorPage() {
  const [p, setP] = useState("5000");
  const [rpm, setRpm] = useState("1450");
  const [tR, setTR] = useState<R>(null);

  const [sv, setSv] = useState("1500");
  const [from, setFrom] = useState<"rpm" | "rad/s">("rpm");
  const [sR, setSR] = useState<R>(null);

  const [z1, setZ1] = useState("20");
  const [z2, setZ2] = useState("60");
  const [gin, setGin] = useState("1500");
  const [gR, setGR] = useState<R>(null);

  const [f, setF] = useState("12000");
  const [a, setA] = useState("78.5");
  const [stR, setStR] = useState<R>(null);

  return (
    <AppShell>
      <PageHeader eyebrow="Module 02" title="Engineering Calculator" desc="Enter values, see the formula, the substitution, and the answer with units." />
      <div className="grid gap-6 lg:grid-cols-2">
        <CalcCard title="Shaft Torque" formula="T = P / ω" result={tR}
          onCalc={() => {
            const N = n(rpm);
            const r = torque(n(p), Number.isFinite(N) ? rpmToRadS(N) : NaN);
            setTR(r.ok ? { substituted: `ω = ${fmt(N)} rpm × 2π/60;  ${r.substituted}`, lines: [{ label: "T", value: `${fmt(r.value)} ${r.unit}` }] } : { error: r.error });
          }}>
          <Field label="Power" unit="W" value={p} onChange={setP} />
          <Field label="Speed" unit="rpm" value={rpm} onChange={setRpm} />
        </CalcCard>

        <CalcCard title="Speed Conversion" formula="ω = 2πN / 60" result={sR}
          onCalc={() => {
            const r = convertSpeed(n(sv), from);
            setSR(r.ok ? { substituted: r.substituted, lines: [{ label: from === "rpm" ? "ω" : "N", value: `${fmt(r.value)} ${r.unit}` }] } : { error: r.error });
          }}>
          <Field label="Value" unit={from} value={sv} onChange={setSv} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Convert from</span>
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-input bg-background p-1">
              {(["rpm", "rad/s"] as const).map((u) => (
                <button type="button" key={u} onClick={() => setFrom(u)}
                  className={`rounded-md py-1.5 font-mono text-xs ${from === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {u}
                </button>
              ))}
            </div>
          </label>
        </CalcCard>

        <CalcCard title="Gear Ratio & Output Speed" formula="i = Z₂ / Z₁" result={gR}
          onCalc={() => {
            const r = gear(n(z1), n(z2), n(gin));
            setGR(r.ok ? { substituted: r.substituted, lines: [{ label: "i", value: `${fmt(r.ratio)} : 1` }, { label: "N₂", value: `${fmt(r.outputRpm)} rpm` }] } : { error: r.error });
          }}>
          <Field label="Driver teeth Z₁" value={z1} onChange={setZ1} />
          <Field label="Driven teeth Z₂" value={z2} onChange={setZ2} />
          <Field label="Input speed N₁" unit="rpm" value={gin} onChange={setGin} />
        </CalcCard>

        <CalcCard title="Normal Stress" formula="σ = F / A" result={stR}
          onCalc={() => {
            const r = normalStress(n(f), n(a));
            setStR(r.ok ? { substituted: r.substituted, lines: [{ label: "σ", value: `${fmt(r.value)} ${r.unit}` }] } : { error: r.error });
          }}>
          <Field label="Axial force F" unit="N" value={f} onChange={setF} />
          <Field label="Cross-section A" unit="mm²" value={a} onChange={setA} />
        </CalcCard>
      </div>
    </AppShell>
  );
}
