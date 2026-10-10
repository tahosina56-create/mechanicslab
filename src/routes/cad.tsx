import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/ComingNext";

export const Route = createFileRoute("/cad")({
  head: () => ({
    meta: [
      { title: "CAD Assistant — MechMind Lab" },
      { name: "description", content: "Step-by-step modeling plans, component lists and drawing checklists." },
      { property: "og:title", content: "CAD Assistant — MechMind Lab" },
      { property: "og:description", content: "Step-by-step modeling plans, component lists and drawing checklists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ComingNext eyebrow="Module 04" title="CAD Assistant" desc="Step-by-step modeling plans, component lists and drawing checklists." items={["Phone stand","Shaft assembly","Belt-driven compressor","Assembly steps and drawing checklist"]} />,
});
