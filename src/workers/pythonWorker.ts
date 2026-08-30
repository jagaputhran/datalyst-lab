/// <reference lib="webworker" />
/* Python execution worker — Pyodide (WebAssembly) runs entirely in the browser.
 *
 * Boot strategy, optimised for perceived speed:
 *   1. Download only the core interpreter first (smallest possible wait),
 *      then immediately report "ready" so the Run button unlocks.
 *   2. Prefetch NumPy + Pandas in the background right after boot.
 *   3. Any library a snippet needs that isn't loaded yet (incl. Matplotlib)
 *      is fetched on demand, serialized through a single load queue so
 *      concurrent requests can never corrupt the runtime.
 */

const PYODIDE_VERSION = "0.27.7";
// Mirrors tried in order — corporate networks / ad-blockers sometimes block one host.
const CDN_BASES = [
  `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
  `https://fastly.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
  `https://gcore.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
];

type Pyodide = {
  loadPackage: (pkgs: string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (name: string) => unknown };
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

let pyodide: Pyodide | null = null;
let booting: Promise<Pyodide> | null = null;
let stdoutBuffer = "";
const loaded = new Set<string>();
let loadChain: Promise<void> = Promise.resolve();

const post = (msg: Record<string, unknown>) => (self as unknown as Worker).postMessage(msg);

/** Always produce a readable string — never "[object Object]". */
function describeError(err: unknown): string {
  if (err instanceof Error) return err.message || err.name;
  if (typeof err === "string") return err;
  try {
    const json = JSON.stringify(err);
    if (json && json !== "{}") return json;
  } catch {
    /* fall through */
  }
  return Object.prototype.toString.call(err);
}

const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as plt
import io, base64

def __collect_figures():
    images = []
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
        images.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    plt.close("all")
    return images
`;

/** Serialize all package loads through one chain so they never overlap.
 *  A failed load must not poison the chain for future calls. */
function queueLoad(py: Pyodide, pkgs: string[], announce: boolean): Promise<void> {
  const task = loadChain.then(async () => {
    const missing = pkgs.filter((p) => !loaded.has(p));
    if (!missing.length) return;
    if (announce) post({ type: "status", stage: "packages", message: `Loading ${missing.join(", ")}…` });
    await py.loadPackage(missing);
    missing.forEach((p) => loaded.add(p));
    if (missing.includes("matplotlib")) await py.runPythonAsync(MATPLOTLIB_SETUP);
    if (announce) post({ type: "ready" });
  });
  loadChain = task.catch(() => {});
  return task;
}

/** All packages a snippet references (loaded or not). */
function detectPackages(code: string): string[] {
  const pkgs: string[] = [];
  if (/\bnumpy\b|\bnp\b/.test(code)) pkgs.push("numpy");
  if (/\bpandas\b|\bpd\b/.test(code)) pkgs.push("pandas");
  if (/\bmatplotlib\b|\bplt\b/.test(code)) pkgs.push("matplotlib");
  return pkgs;
}

async function boot(): Promise<Pyodide> {
  if (pyodide) return pyodide;
  if (booting) return booting;

  booting = (async () => {
    post({ type: "status", stage: "runtime", message: "Downloading Python runtime…" });

    let instance: Pyodide | null = null;
    let lastError: unknown = null;
    for (const base of CDN_BASES) {
      try {
        const mod = await import(/* @vite-ignore */ `${base}pyodide.mjs`);
        instance = (await mod.loadPyodide({ indexURL: base })) as Pyodide;
        break;
      } catch (err) {
        lastError = err;
        post({ type: "status", stage: "runtime", message: "Retrying via a mirror…" });
      }
    }
    if (!instance) {
      throw new Error(`Could not download the Python runtime (${describeError(lastError)})`);
    }

    instance.setStdout({ batched: (s: string) => (stdoutBuffer += s + "\n") });
    instance.setStderr({ batched: (s: string) => (stdoutBuffer += s + "\n") });

    pyodide = instance;
    post({ type: "ready" });

    // Warm the two libraries almost every lesson uses, without blocking "ready".
    // A failed prefetch is harmless — packages retry on demand at run time.
    queueLoad(instance, ["numpy", "pandas"], false).catch(() => {});
    return instance;
  })();

  try {
    return await booting;
  } catch (err) {
    booting = null;
    throw err;
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, id, code } = event.data ?? {};

  if (type === "init") {
    try {
      await boot();
    } catch (err) {
      post({ type: "init-error", error: describeError(err) });
    }
    return;
  }

  if (type === "run") {
    const started = performance.now();
    try {
      const py = await boot();
      const needed = detectPackages(code);
      const announce = needed.some((p) => !loaded.has(p));
      await queueLoad(py, needed, announce);

      stdoutBuffer = "";
      const value = await py.runPythonAsync(code);

      let images: string[] = [];
      if (loaded.has("matplotlib")) {
        const figures = (await py.runPythonAsync("__collect_figures()")) as unknown as {
          toJs?: () => string[];
        };
        images = typeof figures?.toJs === "function" ? figures.toJs() : ((figures as unknown) as string[]);
      }

      post({
        type: "result",
        id,
        success: true,
        stdout: stdoutBuffer,
        value: value === undefined || value === null ? "" : String(value),
        images: Array.isArray(images) ? images : [],
        ms: Math.round(performance.now() - started),
      });
    } catch (err) {
      post({
        type: "result",
        id,
        success: false,
        stdout: stdoutBuffer,
        error: describeError(err),
        images: [],
        ms: Math.round(performance.now() - started),
      });
    }
  }
};
