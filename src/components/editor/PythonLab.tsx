import { useEffect, useState } from "react";
import { AlertTriangle, Download, Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  explainError,
  initPython,
  retryPython,
  runPython,
  subscribeRuntime,
  type RunResult,
  type RuntimeStatus,
} from "@/services/pythonRunner";

/**
 * A self-contained, runnable Python cell backed by the in-browser Pyodide worker.
 * Used by lesson "Try it yourself" blocks and experiment labs alike.
 */
export function PythonLab({
  initialCode,
  height = "300px",
  onRun,
}: {
  initialCode: string;
  height?: string;
  onRun?: (result: RunResult) => void;
}) {
  const [code, setCode] = useState(initialCode);
  const [runtime, setRuntime] = useState<{ status: RuntimeStatus; message: string }>({
    status: "idle",
    message: "",
  });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  useEffect(() => subscribeRuntime((status, message) => setRuntime({ status, message })), []);

  // Start (or resume) the runtime download as soon as a lab is on screen,
  // so it is usually ready before the learner presses Run.
  useEffect(() => {
    initPython();
  }, []);

  const run = async () => {
    setRunning(true);
    const r = await runPython(code);
    setResult(r);
    setRunning(false);
    onRun?.(r);
  };

  const friendly = result && !result.success ? explainError(result.error ?? "") : null;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Python lab</span>
          {runtime.status === "loading" && (
            <Badge variant="outline" className="gap-1.5 text-[11px]">
              <Loader2 className="size-3 animate-spin" /> {runtime.message}
            </Badge>
          )}
          {runtime.status === "ready" && (
            <Badge className="bg-success/15 text-[11px] text-success">Runtime ready</Badge>
          )}
          {runtime.status === "error" && (
            <Badge variant="destructive" className="text-[11px]">
              Runtime error
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setCode(initialCode)} disabled={code === initialCode}>
            <RotateCcw className="mr-1.5 size-3.5" /> Reset
          </Button>
          <Button size="sm" onClick={run} disabled={running || runtime.status === "loading"}>
            {running || runtime.status === "loading" ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Play className="mr-1.5 size-3.5" />
            )}
            {running ? "Running…" : runtime.status === "loading" ? "Preparing…" : "Run"}
          </Button>
        </div>
      </div>

      <CodeEditor value={code} onChange={setCode} height={height} />

      {runtime.status === "loading" && !result && (
        <div className="flex items-start gap-3 border-t border-border bg-muted/40 px-4 py-3">
          <Download className="mt-0.5 size-4 shrink-0 text-info" />
          <div className="flex-1 text-xs leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Setting up the Python environment — {runtime.message}</p>
            <p className="mt-0.5">
              This happens once per visit and is cached by your browser; subsequent runs execute instantly.
            </p>
          </div>
          <Button size="sm" variant="ghost" className="shrink-0 text-xs" onClick={retryPython}>
            Restart download
          </Button>
        </div>
      )}

      {runtime.status === "error" && (
        <div className="flex items-start gap-3 border-t border-border bg-destructive/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-medium text-destructive">The Python environment could not be loaded.</p>
            <p className="mt-0.5 text-muted-foreground">
              Check your internet connection — the runtime is downloaded from a CDN on first use — then try again. If
              you are on a corporate or campus network, cdn.jsdelivr.net may be blocked.
            </p>
            {runtime.message && (
              <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground/80">{runtime.message}</p>
            )}
          </div>
          <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={retryPython}>
            Retry
          </Button>
        </div>
      )}

      {result && (
        <div className="border-t border-border bg-card p-4">
          {result.success ? (
            <>
              {result.stdout && (
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-[12px] leading-relaxed">
                  {result.stdout}
                </pre>
              )}
              {!result.stdout && !result.images.length && (
                <p className="text-xs text-muted-foreground">Ran successfully with no printed output.</p>
              )}
              {result.images.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {result.images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={`data:image/png;base64,${img}`}
                      alt={`Matplotlib figure ${i + 1}`}
                      className="w-full rounded-lg border border-border"
                    />
                  ))}
                </div>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">Finished in {result.ms}ms</p>
            </>
          ) : (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="size-4" /> {friendly?.title ?? "Error"}
              </p>
              <p className="mt-1.5 text-sm text-foreground">{friendly?.reason}</p>
              {friendly?.suggestions && friendly.suggestions.length > 0 && (
                <ul className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                  {friendly.suggestions.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="text-destructive">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Show raw Python traceback
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-[11px]">
                  {friendly?.technical}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
