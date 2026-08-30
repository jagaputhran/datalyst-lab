import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chart } from "@/components/charts/Chart";
import { PythonLab } from "@/components/editor/PythonLab";
import { studentPerformance } from "@/data/datasets";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Visualization Studio | DS VirtualLab" },
      { name: "description", content: "Build charts interactively and see the matching Matplotlib/Pandas code, then run it for real." },
    ],
  }),
  component: StudioPage,
});

type ChartType = "scatter" | "line" | "bar" | "histogram" | "box" | "heatmap";

const NUMERIC_COLUMNS = ["Study_Hours", "Attendance", "Previous_Marks", "Assignment_Score", "Final_Score"] as const;
type NumericColumn = (typeof NUMERIC_COLUMNS)[number];

const CHART_TYPES: { id: ChartType; label: string }[] = [
  { id: "scatter", label: "Scatter" },
  { id: "line", label: "Line" },
  { id: "bar", label: "Bar" },
  { id: "histogram", label: "Histogram" },
  { id: "box", label: "Box" },
  { id: "heatmap", label: "Correlation heatmap" },
];

function correlation(a: number[], b: number[]) {
  const ma = a.reduce((s, v) => s + v, 0) / a.length;
  const mb = b.reduce((s, v) => s + v, 0) / b.length;
  const cov = a.reduce((s, v, i) => s + (v - ma) * (b[i]! - mb), 0);
  const da = Math.sqrt(a.reduce((s, v) => s + (v - ma) ** 2, 0));
  const db = Math.sqrt(b.reduce((s, v) => s + (v - mb) ** 2, 0));
  return cov / (da * db);
}

function StudioPage() {
  const [type, setType] = useState<ChartType>("scatter");
  const [xCol, setXCol] = useState<NumericColumn>("Study_Hours");
  const [yCol, setYCol] = useState<NumericColumn>("Final_Score");

  const x = studentPerformance.map((r) => r[xCol]);
  const y = studentPerformance.map((r) => r[yCol]);
  const students = studentPerformance.map((r) => r.Student);

  const { data, layout } = useMemo(() => {
    switch (type) {
      case "scatter":
        return {
          data: [{ type: "scatter", mode: "markers", x, y, text: students, marker: { size: 10 } }],
          layout: { title: `${xCol} vs ${yCol}`, xaxis: { title: xCol }, yaxis: { title: yCol } },
        };
      case "line":
        return {
          data: [{ type: "scatter", mode: "lines+markers", x: students, y }],
          layout: { title: `${yCol} across students` },
        };
      case "bar":
        return {
          data: [{ type: "bar", x: students, y }],
          layout: { title: `${yCol} by student` },
        };
      case "histogram":
        return {
          data: [{ type: "histogram", x: y, nbinsx: 8 }],
          layout: { title: `Distribution of ${yCol}` },
        };
      case "box":
        return {
          data: [
            { type: "box", y: x, name: xCol },
            { type: "box", y, name: yCol },
          ],
          layout: { title: `Spread: ${xCol} vs ${yCol}` },
        };
      case "heatmap": {
        const cols = NUMERIC_COLUMNS;
        const matrix = cols.map((c1) => cols.map((c2) => correlation(studentPerformance.map((r) => r[c1]), studentPerformance.map((r) => r[c2]))));
        return {
          data: [{ type: "heatmap", z: matrix, x: cols, y: cols, colorscale: "RdBu", zmin: -1, zmax: 1 }],
          layout: { title: "Correlation matrix" },
        };
      }
    }
  }, [type, x, y, xCol, yCol, students]);

  const code = useMemo(() => {
    const header = `import pandas as pd\nimport matplotlib.pyplot as plt\n\ndata = ${JSON.stringify(
      Object.fromEntries(NUMERIC_COLUMNS.map((c) => [c, studentPerformance.map((r) => r[c])])),
    )}\ndf = pd.DataFrame(data)\ndf["Student"] = ${JSON.stringify(students)}\n\n`;
    switch (type) {
      case "scatter":
        return `${header}plt.scatter(df["${xCol}"], df["${yCol}"])\nplt.xlabel("${xCol}")\nplt.ylabel("${yCol}")\nplt.title("${xCol} vs ${yCol}")\nplt.show()\nprint("Correlation:", df["${xCol}"].corr(df["${yCol}"]))\n`;
      case "line":
        return `${header}plt.plot(df["Student"], df["${yCol}"], marker="o")\nplt.xticks(rotation=45)\nplt.ylabel("${yCol}")\nplt.title("${yCol} across students")\nplt.tight_layout()\nplt.show()\n`;
      case "bar":
        return `${header}plt.bar(df["Student"], df["${yCol}"])\nplt.xticks(rotation=45)\nplt.ylabel("${yCol}")\nplt.title("${yCol} by student")\nplt.tight_layout()\nplt.show()\n`;
      case "histogram":
        return `${header}plt.hist(df["${yCol}"], bins=8)\nplt.xlabel("${yCol}")\nplt.title("Distribution of ${yCol}")\nplt.show()\n`;
      case "box":
        return `${header}plt.boxplot([df["${xCol}"], df["${yCol}"]], tick_labels=["${xCol}", "${yCol}"])\nplt.title("Spread: ${xCol} vs ${yCol}")\nplt.show()\n`;
      case "heatmap":
        return `${header}print(df[${JSON.stringify(NUMERIC_COLUMNS)}].corr().round(2))\n`;
    }
  }, [type, xCol, yCol, students]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Data visualization"
        title="Visualization studio"
        description="Select a chart type and columns to explore the dataset interactively; the equivalent Matplotlib code is generated below and can be executed directly."
      />

      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chart type</span>
          {CHART_TYPES.map((c) => (
            <Button key={c.id} size="sm" variant={type === c.id ? "default" : "outline"} onClick={() => setType(c.id)}>
              {c.label}
            </Button>
          ))}
        </div>

        {type !== "heatmap" && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {type === "scatter" || type === "box" ? (
              <ColumnPicker label="X axis" value={xCol} onChange={setXCol} />
            ) : null}
            <ColumnPicker label="Y axis" value={yCol} onChange={setYCol} />
          </div>
        )}

        <div className="mt-5">
          <Chart data={data as Record<string, unknown>[]} layout={layout} height={400} />
        </div>
      </div>

      <section>
        <SectionTitle hint="Generated for the chart above">Matching Python code</SectionTitle>
        <PythonLab key={code} initialCode={code!} height="300px" />
      </section>
    </div>
  );
}

function ColumnPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: NumericColumn;
  onChange: (v: NumericColumn) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={(v) => onChange(v as NumericColumn)}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {NUMERIC_COLUMNS.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
