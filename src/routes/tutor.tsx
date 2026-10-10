import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/ComingNext";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "AI Engineering Tutor — MechMind Lab" },
      { name: "description", content: "Explanations organized into concept, formula, worked example and final answer." },
      { property: "og:title", content: "AI Engineering Tutor — MechMind Lab" },
      { property: "og:description", content: "Explanations organized into concept, formula, worked example and final answer." },
    ],
  }),
  component: () => <ComingNext eyebrow="Module 01" title="AI Engineering Tutor" desc="Explanations organized into concept, formula, worked example and final answer." items={["Engineering Mechanics","Thermodynamics","Calculus","Materials Science","Machine Design","Demo responses clearly labeled until AI is connected"]} />,
});
