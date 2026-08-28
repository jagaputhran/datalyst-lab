import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Row } from "@/components/common/DataTable";

const students = [
  { Student_ID: 1, Name: "Arun" },
  { Student_ID: 2, Name: "Bala" },
  { Student_ID: 3, Name: "Charan" },
];
const scores = [
  { Student_ID: 1, Score: 78 },
  { Student_ID: 2, Score: 92 },
  { Student_ID: 4, Score: 85 },
];

type How = "inner" | "left" | "right" | "outer";

const notes: Record<How, string> = {
  inner: "Only IDs present in BOTH tables survive (1 and 2). Charan and ID 4 are dropped.",
  left: "Every student is kept. Charan has no score, so Score becomes NaN. ID 4 is dropped.",
  right: "Every score row is kept. ID 4 has no name, so Name becomes NaN. Charan is dropped.",
  outer: "The union of both key sets (1, 2, 3, 4). Missing values on either side become NaN.",
};

export function MergeSimulator() {
  const [how, setHow] = useState<How>("left");

  const merged = useMemo<Row[]>(() => {
    const ids = new Set<number>();
    if (how === "inner")
      students.forEach((s) => scores.some((x) => x.Student_ID === s.Student_ID) && ids.add(s.Student_ID));
    if (how === "left") students.forEach((s) => ids.add(s.Student_ID));
    if (how === "right") scores.forEach((s) => ids.add(s.Student_ID));
    if (how === "outer") {
      students.forEach((s) => ids.add(s.Student_ID));
      scores.forEach((s) => ids.add(s.Student_ID));
    }
    return [...ids]
      .sort((a, b) => a - b)
      .map((id) => ({
        Student_ID: id,
        Name: students.find((s) => s.Student_ID === id)?.Name ?? null,
        Score: scores.find((s) => s.Student_ID === id)?.Score ?? null,
      }));
  }, [how]);

  return (
    <div className="panel p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            students (left)
          </p>
          <DataTable rows={students} maxHeight={180} />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            scores (right)
          </p>
          <DataTable rows={scores} maxHeight={180} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Join type</span>
        {(["inner", "left", "right", "outer"] as How[]).map((h) => (
          <Button key={h} size="sm" variant={how === h ? "default" : "outline"} onClick={() => setHow(h)}>
            {h}
          </Button>
        ))}
      </div>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
{`pd.merge(students, scores, on="Student_ID", how="${how}")`}
      </pre>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Result — {merged.length} rows
        </p>
        <DataTable
          rows={merged}
          maxHeight={240}
          highlight={(row, col) => (row[col] === null ? "changed" : null)}
          caption={notes[how]}
        />
      </div>
    </div>
  );
}
