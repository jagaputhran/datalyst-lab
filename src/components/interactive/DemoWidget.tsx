import { ArrayGrid } from "./ArrayGrid";
import { LifecycleFlow } from "./LifecycleFlow";
import { MergeSimulator } from "./MergeSimulator";
import { OutlierLab } from "./OutlierLab";
import { DataFrameExplorer } from "./DataFrameExplorer";
import { ApiSimulator } from "./ApiSimulator";
import { StandardizeLab } from "./StandardizeLab";
import { ChartPreview } from "./ChartPreview";

export type DemoKind =
  | "array-grid"
  | "dataframe-table"
  | "lifecycle"
  | "merge-simulator"
  | "outlier-slider"
  | "standardize"
  | "api-simulator"
  | "chart-preview"
  | "none"
  | undefined;

/** Central registry mapping a lesson's `demo` / an experiment's `widget` to its live component. */
export function DemoWidget({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "array-grid":
      return <ArrayGrid />;
    case "lifecycle":
      return <LifecycleFlow />;
    case "merge-simulator":
      return <MergeSimulator />;
    case "outlier-slider":
      return <OutlierLab />;
    case "dataframe-table":
      return <DataFrameExplorer />;
    case "api-simulator":
      return <ApiSimulator />;
    case "standardize":
      return <StandardizeLab />;
    case "chart-preview":
      return <ChartPreview />;
    default:
      return null;
  }
}
