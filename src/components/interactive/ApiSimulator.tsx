import { useState } from "react";
import { CheckCircle2, Loader2, Play, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { apiSampleJson } from "@/data/datasets";

type Stage = "idle" | "fetching" | "parsed" | "dataframe";

/** Visualises the JSON → dict → DataFrame pipeline without ever leaving the browser. */
export function ApiSimulator() {
  const [stage, setStage] = useState<Stage>("idle");

  const run = () => {
    setStage("fetching");
    window.setTimeout(() => setStage("parsed"), 500);
    window.setTimeout(() => setStage("dataframe"), 1100);
  };

  const reset = () => setStage("idle");

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simulated GET request</p>
          <p className="mt-1 font-mono text-sm">GET /api/students/1</p>
        </div>
        <Button size="sm" onClick={stage === "idle" ? run : reset} disabled={stage === "fetching"}>
          {stage === "fetching" ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Play className="mr-2 size-4" />
          )}
          {stage === "idle" ? "Send request" : stage === "fetching" ? "Fetching…" : "Run again"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Step active={stage !== "idle"} title="1. JSON response" done={stage !== "idle" && stage !== "fetching"}>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(apiSampleJson, null, 2)}
          </pre>
        </Step>

        <Step active={stage === "parsed" || stage === "dataframe"} title="2. json.loads() → dict" done={stage === "dataframe"}>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
            {`{'student': '${apiSampleJson.student}',\n 'attendance': ${apiSampleJson.attendance},\n 'score': ${apiSampleJson.score}}`}
          </pre>
        </Step>

        <Step active={stage === "dataframe"} title="3. pd.DataFrame([record])" done={stage === "dataframe"}>
          {stage === "dataframe" ? (
            <DataTable rows={[apiSampleJson]} maxHeight={140} />
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Waiting…
            </div>
          )}
        </Step>
      </div>

      <div className="mt-5 flex gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-xs leading-relaxed text-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
        <p>
          In a real browser app, third-party APIs are subject to <strong>CORS</strong>, and any key embedded in
          frontend code is public. This simulator uses local sample data only — nothing is sent over the network.
        </p>
      </div>
    </div>
  );
}

function Step({
  active,
  done,
  title,
  children,
}: {
  active: boolean;
  done: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-3.5 transition-opacity ${active ? "border-primary/40 bg-primary/5" : "border-border opacity-40"}`}>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {done && <CheckCircle2 className="size-3.5 text-success" />}
        {title}
      </p>
      {children}
    </div>
  );
}
