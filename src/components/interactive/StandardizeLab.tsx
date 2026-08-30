import { useMemo, useState } from "react";
import { Chart } from "@/components/charts/Chart";
import { Slider } from "@/components/ui/slider";

const STUDY_HOURS = [4, 7, 5, 9, 3, 6, 8, 2, 10, 5];

function mean(a: number[]) {
  return a.reduce((s, v) => s + v, 0) / a.length;
}
function std(a: number[]) {
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1));
}

/** Live Min-Max vs Z-score scaling comparison over the Study_Hours sample. */
export function StandardizeLab() {
  const [pick, setPick] = useState(7);

  const stats = useMemo(() => {
    const min = Math.min(...STUDY_HOURS);
    const max = Math.max(...STUDY_HOURS);
    const m = mean(STUDY_HOURS);
    const s = std(STUDY_HOURS);
    const minmax = STUDY_HOURS.map((x) => (x - min) / (max - min));
    const zscore = STUDY_HOURS.map((x) => (x - m) / s);
    const pickIndex = STUDY_HOURS.indexOf(pick);
    return { min, max, mean: m, std: s, minmax, zscore, pickIndex };
  }, [pick]);

  return (
    <div className="panel p-5">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <label className="text-sm font-semibold">Pick a Study_Hours value</label>
          <div className="mt-3 flex items-center gap-3">
            <Slider
              min={Math.min(...STUDY_HOURS)}
              max={Math.max(...STUDY_HOURS)}
              step={1}
              value={[pick]}
              onValueChange={(v) => {
                const nearest = STUDY_HOURS.reduce((a, b) => (Math.abs(b - v[0]!) < Math.abs(a - v[0]!) ? b : a));
                setPick(nearest);
              }}
            />
            <span className="w-10 rounded-md border border-border px-2 py-1 text-center font-mono text-sm">
              {pick}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Min-Max" value={stats.minmax[stats.pickIndex]!.toFixed(3)} />
            <Stat label="Z-score" value={stats.zscore[stats.pickIndex]!.toFixed(3)} />
            <Stat label="Column mean" value={stats.mean.toFixed(2)} />
            <Stat label="Column std" value={stats.std.toFixed(2)} />
          </dl>

          <pre className="mt-4 rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
{`MinMax = (${pick} - ${stats.min}) / (${stats.max} - ${stats.min})
        = ${stats.minmax[stats.pickIndex]!.toFixed(3)}

ZScore = (${pick} - ${stats.mean.toFixed(2)}) / ${stats.std.toFixed(2)}
       = ${stats.zscore[stats.pickIndex]!.toFixed(3)}`}
          </pre>
        </div>

        <Chart
          data={[
            { type: "bar", x: STUDY_HOURS.map((_, i) => `S${i + 1}`), y: STUDY_HOURS, name: "Original" },
            { type: "bar", x: STUDY_HOURS.map((_, i) => `S${i + 1}`), y: stats.minmax.map((v) => v * 10), name: "MinMax ×10" },
            { type: "bar", x: STUDY_HOURS.map((_, i) => `S${i + 1}`), y: stats.zscore, name: "ZScore" },
          ]}
          layout={{ title: "Original vs scaled Study_Hours", barmode: "group" }}
          height={380}
        />
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
