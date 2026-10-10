import type { ReactNode } from "react";

export function Field({
  label, unit, value, onChange,
}: { label: string; unit?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-input bg-background focus-within:border-primary">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 font-mono text-sm outline-none"
        />
        {unit && <span className="grid place-items-center border-l border-input bg-muted px-3 font-mono text-xs text-muted-foreground">{unit}</span>}
      </div>
    </label>
  );
}

export function CalcCard({
  title, formula, children, onCalc, result,
}: {
  title: string; formula: string; children: ReactNode; onCalc: () => void;
  result: { error?: string; substituted?: string; lines?: { label: string; value: string }[] } | null;
}) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <code className="rounded-md border border-primary/30 bg-accent px-2 py-1 font-mono text-sm text-accent-foreground">{formula}</code>
      </div>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => { e.preventDefault(); onCalc(); }}
      >
        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          Calculate
        </button>
      </form>
      {result && (
        <div className="mt-5 rounded-lg border border-border bg-background/60 p-4 font-mono text-sm animate-in fade-in">
          {result.error ? (
            <p className="text-destructive">⚠ {result.error}</p>
          ) : (
            <>
              <p className="text-muted-foreground">{result.substituted}</p>
              {result.lines?.map((l) => (
                <p key={l.label} className="mt-2 text-base">
                  <span className="text-muted-foreground">{l.label} = </span>
                  <span className="font-semibold text-primary text-glow">{l.value}</span>
                </p>
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
}
