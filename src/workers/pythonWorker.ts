/// <reference lib="webworker" />
/* Python execution worker — Pyodide (WebAssembly) runs entirely in the browser. */

const PYODIDE_VERSION = "0.27.7";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

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

const post = (msg: Record<string, unknown>) => (self as unknown as Worker).postMessage(msg);

async function boot(): Promise<Pyodide> {
  if (pyodide) return pyodide;
  if (booting) return booting;

  booting = (async () => {
    post({ type: "status", stage: "runtime", message: "Downloading Python runtime (WebAssembly)…" });
    const mod = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`);
    const instance: Pyodide = await mod.loadPyodide({ indexURL: INDEX_URL });

    post({ type: "status", stage: "packages", message: "Loading NumPy, Pandas and Matplotlib…" });
    await instance.loadPackage(["numpy", "pandas", "matplotlib"]);

    instance.setStdout({ batched: (s: string) => (stdoutBuffer += s + "\n") });
    instance.setStderr({ batched: (s: string) => (stdoutBuffer += s + "\n") });

    post({ type: "status", stage: "configuring", message: "Configuring the plotting backend…" });
    await instance.runPythonAsync(`
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
`);

    pyodide = instance;
    post({ type: "ready" });
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
      post({ type: "init-error", error: String(err) });
    }
    return;
  }

  if (type === "run") {
    const started = performance.now();
    try {
      const py = await boot();
      stdoutBuffer = "";
      let value: unknown = null;
      try {
        value = await py.runPythonAsync(code);
      } finally {
        // nothing
      }
      const figures = (await py.runPythonAsync("__collect_figures()")) as unknown as {
        toJs?: () => string[];
      };
      const images = typeof figures?.toJs === "function" ? figures.toJs() : ((figures as unknown) as string[]);

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
        error: String((err as Error)?.message ?? err),
        images: [],
        ms: Math.round(performance.now() - started),
      });
    }
  }
};
