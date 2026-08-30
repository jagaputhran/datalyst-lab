export interface RunResult {
  success: boolean;
  stdout: string;
  value?: string;
  error?: string;
  images: string[];
  ms: number;
}

export type RuntimeStatus = "idle" | "loading" | "ready" | "error";

type StatusListener = (status: RuntimeStatus, message: string) => void;

let worker: Worker | null = null;
let status: RuntimeStatus = "idle";
let statusMessage = "Python lab not started";
const listeners = new Set<StatusListener>();
const pending = new Map<string, (r: RunResult) => void>();
let counter = 0;

function emit() {
  listeners.forEach((l) => l(status, statusMessage));
}

export function subscribeRuntime(listener: StatusListener) {
  listeners.add(listener);
  listener(status, statusMessage);
  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeStatus() {
  return { status, statusMessage };
}

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../workers/pythonWorker.ts", import.meta.url), { type: "module" });
  status = "loading";
  statusMessage = "Preparing Python Lab…";
  emit();

  worker.onmessage = (event: MessageEvent) => {
    const data = event.data;
    if (data.type === "status") {
      status = "loading";
      statusMessage = data.message;
      emit();
    } else if (data.type === "ready") {
      status = "ready";
      statusMessage = "Python ready";
      emit();
    } else if (data.type === "init-error") {
      status = "error";
      statusMessage =
        typeof data.error === "string" && data.error
          ? data.error
          : "Python lab could not be initialized.";
      emit();
    } else if (data.type === "result") {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve?.(data as RunResult);
    }
  };

  worker.onerror = () => {
    status = "error";
    statusMessage = "The Python worker crashed while starting.";
    emit();
  };

  worker.postMessage({ type: "init" });
  return worker;
}

export function initPython() {
  ensureWorker();
}

export function retryPython() {
  worker?.terminate();
  worker = null;
  pending.clear();
  status = "idle";
  statusMessage = "Restarting Python lab…";
  emit();
  ensureWorker();
}

export function runPython(code: string): Promise<RunResult> {
  const w = ensureWorker();
  const id = `run-${++counter}`;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    w.postMessage({ type: "run", id, code });
  });
}

export interface FriendlyError {
  title: string;
  line?: number | undefined;
  summary: string;
  reason: string;
  suggestions: string[];
  technical: string;
}


const HINTS: { match: RegExp; reason: string; suggestions: string[] }[] = [
  {
    match: /KeyError: ['"](.+?)['"]/,
    reason: 'The DataFrame or dictionary has no entry named "$1".',
    suggestions: [
      "Print df.columns to inspect the available column names",
      "Check capitalisation — 'Score' and 'score' are different",
      "Confirm the column was created before you used it",
    ],
  },
  {
    match: /NameError: name ['"](.+?)['"] is not defined/,
    reason: '"$1" was used before it was created or imported.',
    suggestions: [
      "Check the spelling of the variable name",
      "Make sure the import (e.g. import numpy as np) is present",
      "Run the cell that defines it first",
    ],
  },
  {
    match: /ModuleNotFoundError: No module named ['"](.+?)['"]/,
    reason: 'The package "$1" is not available in this browser Python runtime.',
    suggestions: [
      "This lab ships NumPy, Pandas and Matplotlib",
      "Rewrite the example using one of the available packages",
    ],
  },
  {
    match: /IndexError/,
    reason: "You asked for a position that does not exist in the array or list.",
    suggestions: [
      "Remember indices start at 0",
      "Print len(obj) or arr.shape before indexing",
      "The last valid index is length − 1",
    ],
  },
  {
    match: /ValueError: cannot reshape array of size (\d+) into shape (.+)/,
    reason: "Reshaping must preserve the number of elements ($1 in this case).",
    suggestions: ["Check arr.size", "Use -1 to let NumPy infer one dimension"],
  },
  {
    match: /SyntaxError|IndentationError/,
    reason: "Python could not parse the code — usually a missing colon, bracket or wrong indentation.",
    suggestions: [
      "Check for a missing ':' at the end of if/for/def lines",
      "Use consistent 4-space indentation",
      "Look for an unclosed bracket or quote on the line above",
    ],
  },
  {
    match: /ZeroDivisionError/,
    reason: "A division by zero occurred.",
    suggestions: ["Guard the denominator with an if", "Check for empty groups before averaging"],
  },
  {
    match: /TypeError/,
    reason: "An operation was applied to an incompatible type.",
    suggestions: [
      "Print type(x) to inspect what you actually have",
      "Convert with int(), float() or astype() where appropriate",
    ],
  },
];

export function explainError(raw: string): FriendlyError {
  const lines = raw.trim().split("\n");
  const last = lines[lines.length - 1] ?? raw;
  const lineMatch = raw.match(/line (\d+)/g);
  const lastLineToken = lineMatch?.[lineMatch.length - 1];
  const line = lastLineToken ? Number(lastLineToken.replace("line ", "")) : undefined;

  const title = last.split(":")[0]?.trim() || "Error";

  for (const hint of HINTS) {
    const m = raw.match(hint.match);
    if (m) {
      return {
        title,
        line,
        summary: last.trim(),
        reason: hint.reason.replace("$1", m[1] ?? "").replace("$2", m[2] ?? ""),
        suggestions: hint.suggestions,
        technical: raw,
      };
    }
  }

  return {
    title,
    line,
    summary: last.trim(),
    reason: "Python stopped because it could not complete this statement.",
    suggestions: [
      "Read the last line of the message — it names the error type",
      "Print the objects involved just before the failing line",
      "Try running a smaller part of the code first",
    ],
    technical: raw,
  };
}
