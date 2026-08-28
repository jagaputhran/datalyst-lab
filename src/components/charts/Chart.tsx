import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlotlyChartProps } from "./PlotlyChart";

const PlotlyChart = lazy(() => import("./PlotlyChart"));

export function Chart(props: PlotlyChartProps) {
  const fallback = <Skeleton className="w-full rounded-xl" style={{ height: props.height ?? 380 }} />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <PlotlyChart {...props} />
      </Suspense>
    </ClientOnly>
  );
}
