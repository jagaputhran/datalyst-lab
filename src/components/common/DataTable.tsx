import { cn } from "@/lib/utils";

export type Row = Record<string, string | number | boolean | null | undefined>;

export function DataTable({
  rows,
  columns,
  maxHeight = 340,
  highlight,
  caption,
  className,
}: {
  rows: Row[];
  columns?: string[];
  maxHeight?: number;
  /** cells matching this predicate get a highlight */
  highlight?: (row: Row, col: string) => "added" | "changed" | "removed" | null;
  caption?: string;
  className?: string;
}) {
  const cols = columns ?? (rows.length ? Object.keys(rows[0]!) : []);

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No rows to display.
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr>
              {cols.map((c) => (
                <th
                  key={c}
                  className="whitespace-nowrap border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="odd:bg-transparent even:bg-muted/30">
                {cols.map((c) => {
                  const state = highlight?.(row, c) ?? null;
                  const value = row[c];
                  const isNull = value === null || value === undefined || value === "";
                  return (
                    <td
                      key={c}
                      className={cn(
                        "whitespace-nowrap border-b border-border/60 px-3 py-1.5 font-mono text-[13px]",
                        isNull && "italic text-muted-foreground",
                        state === "added" && "bg-success/15 text-success",
                        state === "changed" && "bg-warning/20",
                        state === "removed" && "bg-destructive/15 line-through",
                      )}
                    >
                      {isNull ? "NaN" : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="border-t border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}
