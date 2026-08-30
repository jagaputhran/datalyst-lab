import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, FlaskConical, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import { lessonById, lessons } from "@/data/lessons";
import { units } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PythonLab } from "@/components/editor/PythonLab";
import { DemoWidget } from "@/components/interactive/DemoWidget";

export const Route = createFileRoute("/learn/$lessonId")({
  loader: ({ params }) => {
    const lesson = lessonById(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.lesson.title ?? "Lesson"} | DS VirtualLab` },
      { name: "description", content: loaderData?.lesson.concept ?? "" },
    ],
  }),
  component: LessonDetail,
});

function LessonDetail() {
  const { lesson } = Route.useLoaderData();
  const { progress, toggleLesson } = useProgress();
  const complete = progress.completedLessons.includes(lesson.id);
  const unit = units.find((u) => u.id === lesson.unit);

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/learn/" className="flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All lessons
        </Link>
        <span>/</span>
        <span>Unit {unit?.number}</span>
      </div>

      <PageHeader
        eyebrow={lesson.group}
        title={lesson.title}
        description={lesson.concept}
        actions={
          <Button onClick={() => toggleLesson(lesson.id)} variant={complete ? "outline" : "default"}>
            {complete ? <CheckCircle2 className="mr-2 size-4 text-success" /> : <Circle className="mr-2 size-4" />}
            {complete ? "Completed" : "Mark complete"}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InfoBlock icon={<Lightbulb className="size-4 text-warning" />} title="Why it matters">
          {lesson.why}
        </InfoBlock>
        <InfoBlock icon={<Sparkles className="size-4 text-info" />} title="Easy example">
          {lesson.example}
        </InfoBlock>
      </div>

      {lesson.demo && (
        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">Interactive demo</h2>
          <DemoWidget kind={lesson.demo} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-base font-semibold tracking-tight">Try it yourself</h2>
        <PythonLab initialCode={lesson.tryIt} />
      </section>

      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
          <AlertTriangle className="size-4" /> Common mistakes
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {lesson.mistakes.map((m) => (
            <li key={m} className="flex gap-2">
              <span className="text-destructive">•</span>
              {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Key takeaway</p>
        <p className="mt-1.5 text-sm">{lesson.takeaway}</p>
      </div>

      {lesson.experimentId && (
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next step</p>
            <p className="mt-1 text-sm font-semibold">Put this into practice with a full virtual experiment.</p>
          </div>
          <Button asChild>
            <Link to="/experiments/$experimentId" params={{ experimentId: lesson.experimentId }}>
              <FlaskConical className="mr-2 size-4" /> Run experiment
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-5">
        {prev ? (
          <Button asChild variant="ghost">
            <Link to="/learn/$lessonId" params={{ lessonId: prev.id }}>
              <ArrowLeft className="mr-2 size-4" /> {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
              {next.title} <ArrowLeft className="ml-2 size-4 rotate-180" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
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
