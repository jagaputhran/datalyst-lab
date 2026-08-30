import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { DataTable, type Row } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { studentPerformance } from "@/data/datasets";

const COLUMNS = ["Student", "Study_Hours", "Attendance", "Previous_Marks", "Assignment_Score", "Final_Score"] as const;
type Column = (typeof COLUMNS)[number];

/**
 * A generic, always-live interactive DataFrame — sort, filter and watch the
 * generated Pandas code and result update together. Used anywhere a lesson
 * or experiment references a "dataframe-table" demo.
 */
export function DataFrameExplorer() {
  const [sortCol, setSortCol] = useState<Column>("Final_Score");
  const [ascending, setAscending] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const rows = useMemo<Row[]>(() => {
    const filtered = studentPerformance.filter((r) => r.Final_Score >= minScore);
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortCol as keyof typeof a];
      const bv = b[sortCol as keyof typeof b];
      if (typeof av === "string" || typeof bv === "string") {
        return ascending ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      }
      return ascending ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return sorted.map((r) => ({
      Student: r.Student,
      Study_Hours: r.Study_Hours,
      Attendance: r.Attendance,
      Previous_Marks: r.Previous_Marks,
      Assignment_Score: r.Assignment_Score,
      Final_Score: r.Final_Score,
    }));
  }, [sortCol, ascending, minScore]);

  const code = `df[df["Final_Score"] >= ${minScore}].sort_values("${sortCol}", ascending=${ascending ? "True" : "False"})`;

  return (
    <div className="panel p-5">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort by</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COLUMNS.map((c) => (
              <Button key={c} size="sm" variant={sortCol === c ? "default" : "outline"} onClick={() => setSortCol(c)}>
                {c.replace("_", " ")}
              </Button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => setAscending((v) => !v)}
          >
            {ascending ? <ArrowUp className="mr-1.5 size-3.5" /> : <ArrowDown className="mr-1.5 size-3.5" />}
            {ascending ? "Ascending" : "Descending"}
          </Button>

          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Minimum Final_Score: {minScore}
            </label>
            <div className="mt-3">
              <Slider min={0} max={95} step={5} value={[minScore]} onValueChange={(v) => setMinScore(v[0]!)} />
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated code</p>
          <pre className="mt-1.5 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">{code}</pre>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {rows.length} of {studentPerformance.length} rows
          </p>
          <DataTable rows={rows} maxHeight={360} />
        </div>
      </div>
    </div>
  );
}
