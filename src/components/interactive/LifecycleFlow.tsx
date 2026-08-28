import { useState } from "react";
import { ArrowDown, Lightbulb, AlertTriangle, Building2 } from "lucide-react";
import { lifecycleStages } from "@/data/syllabus";
import { cn } from "@/lib/utils";

export function LifecycleFlow() {
  const [activeId, setActiveId] = useState(lifecycleStages[0]!.id);
  const active = lifecycleStages.find((s) => s.id === activeId)!;

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="panel p-3">
        {lifecycleStages.map((stage, i) => (
          <div key={stage.id}>
            <button
              onClick={() => setActiveId(stage.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                stage.id === activeId
                  ? "bg-primary/12 font-semibold text-primary"
                  : "hover:bg-muted text-foreground/80",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                  stage.id === activeId ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {i + 1}
              </span>
              {stage.title}
            </button>
            {i < lifecycleStages.length - 1 && (
              <div className="flex justify-start pl-[26px]">
                <ArrowDown className="size-3 text-muted-foreground/50" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Stage {lifecycleStages.findIndex((s) => s.id === activeId) + 1} of {lifecycleStages.length}
        </p>
        <h3 className="mt-1 text-xl font-bold">{active.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.meaning}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Block icon={<Lightbulb className="size-4 text-warning" />} title="Why it matters">
            {active.importance}
          </Block>
          <Block icon={<Building2 className="size-4 text-info" />} title="Real-world application">
            {active.realWorld}
          </Block>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Simple example — Student Performance dataset
          </p>
          <p className="mt-1.5 text-sm">{active.example}</p>
        </div>

        <div className="mt-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
            <AlertTriangle className="size-4" /> Common mistakes
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {active.mistakes.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-destructive">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
