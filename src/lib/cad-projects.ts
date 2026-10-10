export type Param = { key: string; label: string; unit: string; value: number; min: number; max: number; step: number };
export type Step = { title: string; tool: string; detail: (p: Record<string, number>) => string; checks: string[] };
export type CadProject = { id: string; title: string; summary: string; level: string; params: Param[]; steps: Step[] };

export const cadProjects: CadProject[] = [
  {
    id: "phone-stand",
    title: "Phone stand",
    summary: "Single-part desk stand with angled back rest and cable slot.",
    level: "Beginner",
    params: [
      { key: "w", label: "Base width", unit: "mm", value: 80, min: 50, max: 150, step: 1 },
      { key: "d", label: "Base depth", unit: "mm", value: 100, min: 60, max: 160, step: 1 },
      { key: "t", label: "Wall thickness", unit: "mm", value: 4, min: 2, max: 10, step: 0.5 },
      { key: "a", label: "Rest angle", unit: "°", value: 65, min: 45, max: 80, step: 1 },
    ],
    steps: [
      { title: "Sketch the side profile", tool: "Sketch", detail: (p) => `On the Right plane, draw a base line ${p.d} mm long and a back rest line at ${p.a}° from horizontal. Offset the profile by ${p.t} mm.`, checks: ["Profile fully constrained", "Angle dimension applied", "Closed sketch loop"] },
      { title: "Extrude the body", tool: "Extrude", detail: (p) => `Extrude the profile symmetrically to ${p.w} mm (±${(p.w / 2).toFixed(1)} mm).`, checks: ["Mid-plane extrusion used", "Body appears solid"] },
      { title: "Add the phone lip", tool: "Sketch + Extrude", detail: (p) => `Add a front lip ${(p.t * 3).toFixed(1)} mm tall at the base front edge to stop the phone sliding.`, checks: ["Lip height sufficient", "Lip merged with body"] },
      { title: "Cut the cable slot", tool: "Extrude cut", detail: (p) => `Cut a 12 mm wide slot through the lip, centred at ${(p.w / 2).toFixed(1)} mm.`, checks: ["Slot centred", "Cut goes through all"] },
      { title: "Fillet edges", tool: "Fillet", detail: (p) => `Fillet outer edges with R${(p.t / 2).toFixed(1)} mm and the inner bend with R${p.t} mm.`, checks: ["No sharp outer edges", "Inner bend relieved"] },
    ],
  },
  {
    id: "shaft-assembly",
    title: "Shaft assembly",
    summary: "Stepped shaft with keyway, two bearings and a pulley hub.",
    level: "Intermediate",
    params: [
      { key: "D", label: "Shaft diameter", unit: "mm", value: 25, min: 10, max: 60, step: 1 },
      { key: "L", label: "Shaft length", unit: "mm", value: 240, min: 100, max: 500, step: 5 },
      { key: "s", label: "Shoulder step", unit: "mm", value: 5, min: 2, max: 10, step: 1 },
    ],
    steps: [
      { title: "Revolve the stepped shaft", tool: "Revolve", detail: (p) => `Sketch half-profile: Ø${p.D} main section, Ø${p.D + p.s} shoulder, total length ${p.L} mm. Revolve 360° about the axis.`, checks: ["Centreline used as axis", "Diameters dimensioned"] },
      { title: "Cut the keyway", tool: "Extrude cut", detail: (p) => `Keyway width ≈ ${(p.D / 4).toFixed(1)} mm, depth ≈ ${(p.D / 8).toFixed(1)} mm, length ${(p.L * 0.2).toFixed(0)} mm.`, checks: ["Keyway on tangent plane", "Size matches standard key"] },
      { title: "Add chamfers", tool: "Chamfer", detail: () => `Chamfer both shaft ends 1 × 45° for easy bearing assembly.`, checks: ["Both ends chamfered"] },
      { title: "Insert bearings", tool: "Assembly", detail: (p) => `Insert two deep-groove bearings with bore Ø${p.D}. Mate concentric and against shoulders.`, checks: ["Concentric mates", "Bearings seated on shoulders"] },
      { title: "Mount the pulley", tool: "Assembly", detail: () => `Insert pulley hub, mate concentric with shaft and align key with keyway.`, checks: ["Key aligned", "No interference detected"] },
    ],
  },
  {
    id: "belt-compressor",
    title: "Belt-driven compressor",
    summary: "Motor, pulleys and V-belt layout for a small air compressor.",
    level: "Advanced",
    params: [
      { key: "d1", label: "Motor pulley Ø", unit: "mm", value: 80, min: 40, max: 200, step: 1 },
      { key: "d2", label: "Compressor pulley Ø", unit: "mm", value: 240, min: 80, max: 400, step: 1 },
      { key: "C", label: "Centre distance", unit: "mm", value: 400, min: 150, max: 900, step: 5 },
      { key: "N", label: "Motor speed", unit: "rpm", value: 1450, min: 500, max: 3000, step: 10 },
    ],
    steps: [
      { title: "Lay out pulley centres", tool: "Layout sketch", detail: (p) => `Place two circles Ø${p.d1} and Ø${p.d2} with centres ${p.C} mm apart.`, checks: ["Centre distance dimensioned", "Pulleys horizontal"] },
      { title: "Compute belt length", tool: "Calculation", detail: (p) => { const L = 2 * p.C + (Math.PI / 2) * (p.d1 + p.d2) + (p.d2 - p.d1) ** 2 / (4 * p.C); return `L = 2C + π(d₁+d₂)/2 + (d₂−d₁)²/4C ≈ ${L.toFixed(0)} mm. Pick nearest standard belt.`; }, checks: ["Belt length calculated", "Standard belt selected"] },
      { title: "Check speed ratio", tool: "Calculation", detail: (p) => `i = ${(p.d2 / p.d1).toFixed(2)}, compressor speed ≈ ${(p.N * p.d1 / p.d2).toFixed(0)} rpm.`, checks: ["Ratio within 1–6", "Output speed acceptable"] },
      { title: "Model pulleys and belt", tool: "Revolve + Sweep", detail: () => `Revolve V-groove pulleys, then sweep the belt profile along the tangent path.`, checks: ["Groove angle 38–40°", "Belt sweep closed"] },
      { title: "Add base and guard", tool: "Sheet metal", detail: (p) => `Create a base plate covering ${(p.C + p.d2).toFixed(0)} mm length and a belt guard with slotted motor mounts.`, checks: ["Motor slots allow tensioning", "Guard covers belt"] },
    ],
  },
  {
    id: "drawing-checklist",
    title: "Assembly steps & drawing checklist",
    summary: "Turn any model into a complete, standard engineering drawing.",
    level: "All levels",
    params: [
      { key: "scale", label: "Drawing scale 1:", unit: "", value: 2, min: 1, max: 10, step: 1 },
      { key: "tol", label: "General tolerance", unit: "± mm", value: 0.1, min: 0.01, max: 1, step: 0.01 },
    ],
    steps: [
      { title: "Set up the sheet", tool: "Drawing", detail: (p) => `Choose A3 sheet, first/third-angle projection, scale 1:${p.scale}. Fill title block.`, checks: ["Projection symbol shown", "Title block complete", "Scale stated"] },
      { title: "Place standard views", tool: "Views", detail: () => `Insert front, top and side views plus an isometric view.`, checks: ["Views aligned", "Isometric added"] },
      { title: "Section & detail views", tool: "Views", detail: () => `Add sections through hidden features and detail views for small features.`, checks: ["Section hatching correct", "Detail labels match"] },
      { title: "Dimension and tolerance", tool: "Annotate", detail: (p) => `Dimension each feature once. Note general tolerance ±${p.tol} mm; add fits on bearing seats.`, checks: ["No duplicate dimensions", "Tolerances noted", "Surface finish marked"] },
      { title: "Assembly drawing & BOM", tool: "Assembly", detail: () => `Create exploded view with balloons and a bill of materials.`, checks: ["Balloons numbered", "BOM complete", "Exploded steps clear"] },
    ],
  },
];
