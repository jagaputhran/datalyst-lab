import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BASE = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];

type Mode = "element" | "row" | "column" | "slice";

export function ArrayGrid() {
  const [mode, setMode] = useState<Mode>("element");
  const [sel, setSel] = useState<{ r: number; c: number }>({ r: 1, c: 2 });

  const selected = useMemo(() => {
    const inSel = (r: number, c: number) => {
      if (mode === "element") return r === sel.r && c === sel.c;
      if (mode === "row") return r === sel.r;
      if (mode === "column") return c === sel.c;
      return r <= sel.r && c <= sel.c;
    };
    return inSel;
  }, [mode, sel]);

  const expression =
    mode === "element"
      ? `arr[${sel.r}, ${sel.c}]`
      : mode === "row"
        ? `arr[${sel.r}]`
        : mode === "column"
          ? `arr[:, ${sel.c}]`
          : `arr[0:${sel.r + 1}, 0:${sel.c + 1}]`;

  const value =
    mode === "element"
      ? String(BASE[sel.r]![sel.c])
      : mode === "row"
        ? `[${BASE[sel.r]!.join(" ")}]`
        : mode === "column"
          ? `[${BASE.map((row) => row[sel.c]).join(" ")}]`
          : `[${BASE.slice(0, sel.r + 1)
              .map((row) => `[${row.slice(0, sel.c + 1).join(" ")}]`)
              .join("\n ")}]`;

  return (
    <div className="panel p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Selection mode
        </span>
        {(["element", "row", "column", "slice"] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>
            {m}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div>
          <div className="mb-1 flex pl-8">
            {[0, 1, 2].map((c) => (
              <span key={c} className="w-16 text-center font-mono text-xs text-muted-foreground">
                col {c}
              </span>
            ))}
          </div>
          {BASE.map((row, r) => (
            <div key={r} className="mb-1 flex items-center">
              <span className="w-8 font-mono text-xs text-muted-foreground">{r}</span>
              {row.map((v, c) => (
                <button
                  key={c}
                  onClick={() => setSel({ r, c })}
                  className={cn(
                    "mr-1 grid size-15 h-15 w-16 place-items-center rounded-lg border font-mono text-sm transition-all",
                    selected(r, c)
                      ? "border-primary bg-primary/12 font-semibold text-primary shadow-sm"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-1 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expression</p>
          <p className="mt-1 font-mono text-lg font-semibold text-primary">{expression}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</p>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-sm">{value}</pre>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground">shape</dt>
              <dd className="font-mono font-semibold">(3, 3)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ndim</dt>
              <dd className="font-mono font-semibold">2</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">dtype</dt>
              <dd className="font-mono font-semibold">int64</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
