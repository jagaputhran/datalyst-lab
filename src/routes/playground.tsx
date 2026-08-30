import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { Database, Upload } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Row } from "@/components/common/DataTable";
import { PythonLab } from "@/components/editor/PythonLab";
import { sampleCsv } from "@/data/datasets";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Data Playground | DS VirtualLab" },
      { name: "description", content: "Upload or paste any CSV and analyse it with real Pandas — entirely in your browser." },
    ],
  }),
  component: PlaygroundPage,
});

function buildCode(csv: string) {
  return `import pandas as pd
import io

csv_data = """${csv.trim()}"""

df = pd.read_csv(io.StringIO(csv_data))
print("Shape:", df.shape)
print(df.head())
print("\\nSummary statistics:")
print(df.describe())
`;
}

function PlaygroundPage() {
  const [csv, setCsv] = useState(sampleCsv);
  const [draft, setDraft] = useState(sampleCsv);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo<Row[]>(() => {
    const parsed = Papa.parse<Row>(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
    return parsed.data.slice(0, 200);
  }, [csv]);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setDraft(text);
      setCsv(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Work with your own data"
        title="Data playground"
        description="Upload or paste a CSV file, preview it as a table, and analyse it with Pandas — all processing happens locally in your browser."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CSV source</p>
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 size-3.5" /> Upload CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setDraft(sampleCsv); setCsv(sampleCsv); }}>
                <Database className="mr-1.5 size-3.5" /> Sample dataset
              </Button>
            </div>
          </div>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="mt-3 h-40 font-mono text-xs"
            placeholder="Paste CSV text here…"
          />
          <Button className="mt-3" size="sm" onClick={() => setCsv(draft)}>
            Load into playground
          </Button>
        </div>

        <div>
          <SectionTitle hint={`${rows.length} rows previewed`}>Preview</SectionTitle>
          <DataTable rows={rows} maxHeight={340} />
        </div>
      </div>

      <section>
        <SectionTitle hint="Real Pandas, no backend">Analyse with Python</SectionTitle>
        <PythonLab key={csv} initialCode={buildCode(csv)} height="360px" />
      </section>
    </div>
  );
}
