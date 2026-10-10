// Pure engineering formulas. Educational use only — not validated design tools.

export type CalcResult =
  | { ok: true; value: number; unit: string; substituted: string }
  | { ok: false; error: string };

const isNum = (n: number) => typeof n === "number" && Number.isFinite(n);

function check(fields: Record<string, number>, positive: string[] = []): string | null {
  for (const [k, v] of Object.entries(fields)) {
    if (!isNum(v)) return `${k} must be a valid number.`;
  }
  for (const k of positive) {
    if (fields[k] <= 0) return `${k} must be greater than zero.`;
  }
  return null;
}

export const fmt = (n: number, digits = 4) => {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e6 || abs < 1e-3) return n.toExponential(3);
  return Number(n.toPrecision(digits + 2)).toLocaleString("en-US", { maximumFractionDigits: digits });
};

/** rpm → rad/s */
export const rpmToRadS = (rpm: number) => (rpm * 2 * Math.PI) / 60;
/** rad/s → rpm */
export const radSToRpm = (w: number) => (w * 60) / (2 * Math.PI);

/** T = P / ω. P in W, ω in rad/s → N·m */
export function torque(powerW: number, omegaRadS: number): CalcResult {
  const err = check({ Power: powerW, "Angular velocity": omegaRadS }, ["Angular velocity"]);
  if (err) return { ok: false, error: err };
  if (powerW < 0) return { ok: false, error: "Power cannot be negative." };
  return {
    ok: true,
    value: powerW / omegaRadS,
    unit: "N·m",
    substituted: `T = ${fmt(powerW)} W / ${fmt(omegaRadS)} rad/s`,
  };
}

export function convertSpeed(value: number, from: "rpm" | "rad/s"): CalcResult {
  const err = check({ Speed: value });
  if (err) return { ok: false, error: err };
  if (value < 0) return { ok: false, error: "Speed cannot be negative." };
  if (from === "rpm") {
    return { ok: true, value: rpmToRadS(value), unit: "rad/s", substituted: `ω = ${fmt(value)} × 2π / 60` };
  }
  return { ok: true, value: radSToRpm(value), unit: "rpm", substituted: `N = ${fmt(value)} × 60 / 2π` };
}

/** Gear ratio = N_driven / N_driver; output speed = input speed / ratio */
export function gear(driverTeeth: number, drivenTeeth: number, inputRpm: number) {
  const err = check(
    { "Driver teeth": driverTeeth, "Driven teeth": drivenTeeth, "Input speed": inputRpm },
    ["Driver teeth", "Driven teeth"],
  );
  if (err) return { ok: false as const, error: err };
  if (!Number.isInteger(driverTeeth) || !Number.isInteger(drivenTeeth))
    return { ok: false as const, error: "Tooth counts must be whole numbers." };
  if (inputRpm < 0) return { ok: false as const, error: "Input speed cannot be negative." };
  const ratio = drivenTeeth / driverTeeth;
  return {
    ok: true as const,
    ratio,
    outputRpm: inputRpm / ratio,
    substituted: `i = ${drivenTeeth} / ${driverTeeth};  N₂ = ${fmt(inputRpm)} / ${fmt(ratio)}`,
  };
}

/** σ = F / A. F in N, A in mm² → MPa (N/mm²) */
export function normalStress(forceN: number, areaMm2: number): CalcResult {
  const err = check({ Force: forceN, Area: areaMm2 }, ["Area"]);
  if (err) return { ok: false, error: err };
  return { ok: true, value: forceN / areaMm2, unit: "MPa", substituted: `σ = ${fmt(forceN)} N / ${fmt(areaMm2)} mm²` };
}
