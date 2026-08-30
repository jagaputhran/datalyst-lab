import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Eye, Lightbulb, ListChecks, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import { experiments } from "@/data/experiments";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PythonLab } from "@/components/editor/PythonLab";
import { DemoWidget } from "@/components/interactive/DemoWidget";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/experiments/$experimentId")({
  loader: ({ params }) => {
    const experiment = experiments.find((e) => e.id === params.experimentId);
    if (!experiment) throw notFound();
    return { experiment };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.experiment.title ?? "Experiment"} | DS VirtualLab` },
      { name: "description", content: loaderData?.experiment.objective ?? "" },
    ],
  }),
  component: ExperimentDetail,
});

function ExperimentDetail() {
  const { experiment } = Route.useLoaderData();
  const { progress, completeExperiment, openExperiment, recordRun } = useProgress();
  const [showObservation, setShowObservation] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const done = progress.completedExperiments.includes(experiment.id);
  const idx = experiments.findIndex((e) => e.id === experiment.id);
  const prev = experiments[idx - 1];
  const next = experiments[idx + 1];

  useEffect(() => {
    openExperiment(experiment.id);
    setShowObservation(false);
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiment.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/experiments/" className="flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All experiments
        </Link>
        <span>/</span>
        <span>Experiment {experiment.number}</span>
      </div>

      <PageHeader
        eyebrow={`${experiment.difficulty} · ${experiment.minutes} min`}
        title={experiment.title}
        description={experiment.objective}
        actions={
          <Button
            variant={done ? "outline" : "default"}
            onClick={() => {
              completeExperiment(experiment.id);
              recordRun(0);
            }}
          >
            {done ? <CheckCircle2 className="mr-2 size-4 text-success" /> : <Circle className="mr-2 size-4" />}
            {done ? "Completed" : "Mark complete"}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {experiment.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Lightbulb className="size-4 text-warning" /> Theory
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{experiment.theory}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ListChecks className="size-4 text-info" /> Learning outcomes
          </p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {experiment.outcomes.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-info">•</span> {o}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Steps</p>
        <ol className="space-y-1.5 text-sm">
          {experiment.steps.map((s, i) => (
            <li key={s} className="flex gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted font-mono text-[11px] font-semibold">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold tracking-tight">Run the lab</h2>
        <PythonLab initialCode={experiment.code} height="360px" onRun={() => setShowObservation(true)} />
      </section>

      {experiment.widget !== "none" && (
        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">Interactive widget</h2>
          <DemoWidget kind={experiment.widget} />
        </section>
      )}

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-4" /> Observation
          </p>
          {!showObservation && (
            <Button size="sm" variant="outline" onClick={() => setShowObservation(true)}>
              <Eye className="mr-1.5 size-3.5" /> Reveal
            </Button>
          )}
        </div>
        {showObservation ? (
          <p className="mt-2 text-sm">{experiment.observation}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Run the lab above, or click reveal, to see the expected observation.</p>
        )}
      </div>

      <div className="panel p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key takeaways</p>
        <ul className="space-y-1.5 text-sm">
          {experiment.takeaways.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-primary">•</span> {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Self check</p>
        <p className="mt-2 text-sm font-semibold">{experiment.selfCheck.question}</p>
        <div className="mt-3 space-y-2">
          {experiment.selfCheck.options.map((opt, i) => {
            const isCorrect = i === experiment.selfCheck.answer;
            const isSelected = selected === i;
            return (
              <button
                key={opt}
                onClick={() => setSelected(i)}
                className={cn(
                  "block w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                  selected === null && "border-border hover:border-primary/40",
                  selected !== null && isCorrect && "border-success bg-success/10",
                  selected !== null && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                  selected !== null && !isSelected && !isCorrect && "border-border opacity-60",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <p className="mt-3 rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
            {experiment.selfCheck.explanation}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        {prev ? (
          <Button asChild variant="ghost">
            <Link to="/experiments/$experimentId" params={{ experimentId: prev.id }}>
              <ArrowLeft className="mr-2 size-4" /> {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to="/experiments/$experimentId" params={{ experimentId: next.id }}>
              {next.title} <ArrowLeft className="ml-2 size-4 rotate-180" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
