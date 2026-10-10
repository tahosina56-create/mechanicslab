import { describe, expect, it } from "vitest";
import { convertSpeed, gear, normalStress, torque } from "@/lib/engineering";

describe("engineering formulas", () => {
  it("torque T = P/ω", () => {
    const r = torque(1000, 100);
    expect(r.ok && r.value).toBe(10);
  });
  it("torque rejects zero angular velocity", () => {
    expect(torque(1000, 0).ok).toBe(false);
  });
  it("converts 60 rpm to 2π rad/s", () => {
    const r = convertSpeed(60, "rpm");
    expect(r.ok && r.value).toBeCloseTo(2 * Math.PI);
  });
  it("gear 20→60 teeth at 1500 rpm gives ratio 3 and 500 rpm", () => {
    const r = gear(20, 60, 1500);
    expect(r.ok && r.ratio).toBe(3);
    expect(r.ok && r.outputRpm).toBe(500);
  });
  it("gear rejects fractional teeth", () => {
    expect(gear(20.5, 60, 1500).ok).toBe(false);
  });
  it("stress σ = F/A in MPa", () => {
    const r = normalStress(5000, 50);
    expect(r.ok && r.value).toBe(100);
  });
  it("stress rejects non-numeric input", () => {
    expect(normalStress(NaN, 50).ok).toBe(false);
  });
});
