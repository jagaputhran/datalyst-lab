import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

const PythonEditor = lazy(() => import("./PythonEditor"));

export function CodeEditor({
  value,
  onChange,
  height = "340px",
}: {
  value: string;
  onChange: (v: string) => void;
  height?: string;
}) {
  const fallback = (
    <div className="p-3">
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <PythonEditor value={value} onChange={onChange} height={height} />
      </Suspense>
    </ClientOnly>
  );
}
