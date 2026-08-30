import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, FlaskConical, Search } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import { experiments, type Difficulty } from "@/data/experiments";
import { units } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/experiments/")({
  head: () => ({
    meta: [
      { title: "Virtual Experiments | DS VirtualLab" },
      { name: "description", content: "Hands-on, browser-based data science experiments with live Python execution." },
    ],
  }),
  component: ExperimentsIndex,
});

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

function ExperimentsIndex() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState<string | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const { progress } = useProgress();

  const visible = useMemo(
    () =>
      experiments.filter((e) => {
        if (unit !== "all" && e.unit !== unit) return false;
        if (difficulty !== "all" && e.difficulty !== difficulty) return false;
        const haystack = `${e.title} ${e.objective} ${e.tags.join(" ")}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [query, unit, difficulty],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Laboratory"
        title="Virtual experiments"
        description="Guided experiments with executable Python — NumPy, Pandas and Matplotlib run directly in your browser; no installation required."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search experiments…" className="pl-9" />
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit</span>
        <Button size="sm" variant={unit === "all" ? "default" : "outline"} onClick={() => setUnit("all")}>
          All
        </Button>
        {units.map((u) => (
          <Button key={u.id} size="sm" variant={unit === u.id ? "default" : "outline"} onClick={() => setUnit(u.id)}>
            Unit {u.number}
          </Button>
        ))}
        <span className="ml-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</span>
        <Button size="sm" variant={difficulty === "all" ? "default" : "outline"} onClick={() => setDifficulty("all")}>
          All
        </Button>
        {DIFFICULTIES.map((d) => (
          <Button key={d} size="sm" variant={difficulty === d ? "default" : "outline"} onClick={() => setDifficulty(d)}>
            {d}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{visible.length} of {experiments.length} experiments</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((exp) => {
          const done = progress.completedExperiments.includes(exp.id);
          return (
            <Card key={exp.id} className="shadow-panel transition-shadow hover:shadow-lg">
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">Exp {exp.number}</Badge>
                  {done && <CheckCircle2 className="size-4 text-success" />}
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{exp.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{exp.objective}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[11px]">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" /> {exp.minutes} min · {exp.difficulty}
                  </span>
                  <Button asChild size="sm">
                    <Link to="/experiments/$experimentId" params={{ experimentId: exp.id }}>
                      <FlaskConical className="mr-1.5 size-3.5" /> Start
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!visible.length && (
          <div className="panel col-span-full p-10 text-center text-sm text-muted-foreground">
            No experiment matches your filters.
          </div>
        )}
      </div>
    </div>
  );
}
