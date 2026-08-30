import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/charts/Chart";
import { studentPerformance } from "@/data/datasets";

type ChartKind = "line" | "scatter" | "bar" | "histogram" | "box";

const KINDS: { id: ChartKind; label: string }[] = [
  { id: "line", label: "Line" },
  { id: "scatter", label: "Scatter" },
  { id: "bar", label: "Bar" },
  { id: "histogram", label: "Histogram" },
  { id: "box", label: "Box" },
];

/** Live, switchable chart-type preview over the shared student dataset. */
export function ChartPreview() {
  const [kind, setKind] = useState<ChartKind>("scatter");

  const students = studentPerformance.map((r) => r.Student);
  const hours = studentPerformance.map((r) => r.Study_Hours);
  const score = studentPerformance.map((r) => r.Final_Score);

  const { data, layout } = useMemo(() => {
    switch (kind) {
      case "line":
        return {
          data: [{ type: "scatter", mode: "lines+markers", x: students, y: score, name: "Final_Score" }],
          layout: { title: "Final score across students (as a sequence)" },
        };
      case "scatter":
        return {
          data: [{ type: "scatter", mode: "markers", x: hours, y: score, name: "Students", marker: { size: 10 } }],
          layout: { title: "Study Hours vs Final Score", xaxis: { title: "Study Hours" }, yaxis: { title: "Final Score" } },
        };
      case "bar":
        return {
          data: [{ type: "bar", x: students, y: score, name: "Final_Score" }],
          layout: { title: "Final score by student" },
        };
      case "histogram":
        return {
          data: [{ type: "histogram", x: score, nbinsx: 8, name: "Final_Score" }],
          layout: { title: "Distribution of Final_Score" },
        };
      case "box":
        return {
          data: [
            { type: "box", y: hours, name: "Study_Hours" },
            { type: "box", y: score, name: "Final_Score" },
          ],
          layout: { title: "Spread of Study_Hours vs Final_Score" },
        };
    }
  }, [kind, students, hours, score]);

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chart type</span>
        {KINDS.map((k) => (
          <Button key={k.id} size="sm" variant={kind === k.id ? "default" : "outline"} onClick={() => setKind(k.id)}>
            {k.label}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <Chart data={data as Record<string, unknown>[]} layout={layout} height={380} />
      </div>
    </div>
  );
}
