import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Chart } from "@/components/charts/Chart";

const DATA = [65, 84, 72, 91, 58, 77, 86, 49, 95, 68, 12, 130, 74, 81, 63, 70, 88, 55, 79, 92];

function quantile(sorted: number[], q: number) {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const lo = sorted[base]!;
  const hi = sorted[base + 1] ?? lo;
  return lo + rest * (hi - lo);
}

export function OutlierLab() {
  const [k, setK] = useState(1.5);

  const stats = useMemo(() => {
    const sorted = [...DATA].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lower = q1 - k * iqr;
    const upper = q3 + k * iqr;
    const outliers = DATA.filter((v) => v < lower || v > upper);
    const kept = DATA.filter((v) => v >= lower && v <= upper);
    const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
    return { q1, q3, iqr, lower, upper, outliers, kept, meanAll: mean(DATA), meanKept: mean(kept) };
  }, [k]);

  const traces = useMemo(
    () => [
      {
        type: "box",
        y: DATA,
        name: "Final Score",
        boxpoints: "all",
        jitter: 0.5,
        pointpos: -1.7,
        marker: { size: 7 },
      },
      {
        type: "scatter",
        mode: "markers",
        x: stats.outliers.map(() => "Final Score"),
        y: stats.outliers,
        name: `Flagged (k=${k})`,
        marker: { size: 14, color: "#ef4444", symbol: "circle-open", line: { width: 3 } },
      },
    ],
    [stats.outliers, k],
  );

  return (
    <div className="panel p-5">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div>
          <label className="text-sm font-semibold">IQR multiplier (k)</label>
          <div className="mt-3 flex items-center gap-3">
            <Slider min={0.5} max={3} step={0.1} value={[k]} onValueChange={(v) => setK(v[0]!)} />
            <span className="w-12 rounded-md border border-border px-2 py-1 text-center font-mono text-sm">
              {k.toFixed(1)}
            </span>
          </div>

          <pre className="mt-4 rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
{`IQR = Q3 - Q1 = ${stats.iqr.toFixed(1)}

Lower = Q1 - ${k.toFixed(1)} × IQR = ${stats.lower.toFixed(1)}
Upper = Q3 + ${k.toFixed(1)} × IQR = ${stats.upper.toFixed(1)}`}
          </pre>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Q1" value={stats.q1.toFixed(1)} />
            <Stat label="Q3" value={stats.q3.toFixed(1)} />
            <Stat label="Outliers found" value={String(stats.outliers.length)} />
            <Stat label="Rows kept" value={String(stats.kept.length)} />
            <Stat label="Mean (all)" value={stats.meanAll.toFixed(2)} />
            <Stat label="Mean (cleaned)" value={stats.meanKept.toFixed(2)} />
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            A smaller k flags more points as outliers. k = 1.5 is the convention; k = 3.0 marks only extreme
            values. Removing points changes the mean — compare the two figures above before deciding.
          </p>
        </div>

        <Chart data={traces} layout={{ title: "Score distribution with IQR fences" }} height={420} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-semibold">{value}</dd>
    </div>
  );
}
