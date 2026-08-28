import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

export interface PlotlyChartProps {
  data: Record<string, unknown>[];
  layout?: Record<string, unknown>;
  height?: number;
  className?: string;
}

/** Client-only Plotly renderer. Loaded lazily so the initial bundle stays small. */
export default function PlotlyChart({ data, layout = {}, height = 380, className }: PlotlyChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let disposed = false;
    let node: HTMLDivElement | null = ref.current;

    (async () => {
      const Plotly = (await import("plotly.js-dist-min")).default as unknown as {
        react: (el: HTMLElement, data: unknown, layout: unknown, config: unknown) => Promise<void>;
        purge: (el: HTMLElement) => void;
      };
      if (disposed || !ref.current) return;
      node = ref.current;

      const dark = theme === "dark";
      const font = dark ? "#e6edf5" : "#1f2937";
      const grid = dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)";

      await Plotly.react(
        node,
        data,
        {
          height,
          margin: { l: 56, r: 24, t: 44, b: 52 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: font, family: "Plus Jakarta Sans, system-ui, sans-serif", size: 12 },
          colorway: ["#2563eb", "#14b8a6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"],
          xaxis: { gridcolor: grid, zerolinecolor: grid },
          yaxis: { gridcolor: grid, zerolinecolor: grid },
          legend: { orientation: "h", y: -0.22 },
          ...layout,
        },
        { displayModeBar: true, responsive: true, displaylogo: false },
      );
    })();

    return () => {
      disposed = true;
      if (node) {
        import("plotly.js-dist-min").then((m) => {
          const P = m.default as unknown as { purge: (el: HTMLElement) => void };
          try {
            if (node) P.purge(node);
          } catch {
            /* ignore */
          }
        });
      }
    };
  }, [data, layout, height, theme]);

  return <div ref={ref} className={className} style={{ width: "100%", minHeight: height }} />;
}
