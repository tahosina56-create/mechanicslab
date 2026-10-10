import { createFileRoute } from "@tanstack/react-router";
import { ComingNext } from "@/components/ComingNext";

export const Route = createFileRoute("/machine-design")({
  head: () => ({
    meta: [
      { title: "Machine Design Explorer — MechMind Lab" },
      { name: "description", content: "Explore gear trains, belt drives and shaft stress with simplified diagrams." },
      { property: "og:title", content: "Machine Design Explorer — MechMind Lab" },
      { property: "og:description", content: "Explore gear trains, belt drives and shaft stress with simplified diagrams." },
    ],
  }),
  component: () => <ComingNext eyebrow="Module 03" title="Machine Design Explorer" desc="Explore gear trains, belt drives and shaft stress with simplified diagrams." items={["Interactive gear ratio explorer","Belt-drive speed calculator","Shaft torque and stress","Assumptions explained for every result"]} />,
});
