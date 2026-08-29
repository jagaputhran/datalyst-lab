import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experiments } from "@/data/experiments";
import { units, COURSE } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DS VirtualLab Dashboard | Data Science" },
      { name: "description", content: "Your interactive data science learning dashboard with browser-based Python labs, progress tracking and practice." },
      { property: "og:title", content: "DS VirtualLab Dashboard" },
      { property: "og:description", content: "Continue learning, run experiments and track your data science journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { stats, progress } = useProgress();
  const last = experiments.find((e) => e.id === progress.lastOpenedExperiment) ?? experiments[0]!;
  const next = experiments.find((e) => !progress.completedExperiments.includes(e.id)) ?? experiments[1]!;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`${COURSE.code} · ${COURSE.name}`}
        title="Good morning, learner."
        description="Continue your Data Science learning journey — one concept, experiment and observation at a time."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/syllabus">View syllabus</Link>
            </Button>
            <Button asChild>
              <Link to={`/experiments/${last.id}` as string}>
                <Play className="mr-2 size-4" /> Continue lab
              </Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-panel">
          <div className="absolute -right-10 -top-10 size-40 rounded-full border-[24px] border-primary-foreground/10" />
          <div className="absolute -bottom-20 right-20 size-44 rounded-full border-[20px] border-primary-foreground/5" />
          <Sparkles className="relative size-5 text-accent" />
          <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
            Continue where you left off
          </p>
          <h2 className="relative mt-2 max-w-md text-2xl font-bold">{last.title}</h2>
          <p className="relative mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/75">
            {last.objective}
          </p>
          <Button asChild className="relative mt-5 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to={`/experiments/${last.id}` as string}>
              Resume experiment <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <MetricCard icon={<Target className="size-5 text-info" />} label="Overall progress" value={`${stats.overall}%`} detail={`${stats.lessonsDone} lessons · ${stats.experimentsDone} experiments`} progress={stats.overall} />
        <MetricCard icon={<Trophy className="size-5 text-warning" />} label="Practice accuracy" value={stats.accuracy ? `${stats.accuracy}%` : "—"} detail={stats.quizzesDone ? `${stats.quizzesDone} quiz attempts` : "No attempts yet — start a quiz"} progress={stats.accuracy} />
      </section>

      <section>
        <SectionTitle hint="Stored locally on this device">Your course at a glance</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {units.map((unit) => {
            const u = stats.units[unit.id];
            return (
              <Card key={unit.id} className="shadow-panel transition-shadow hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Unit {unit.number}</Badge>
                    <span className="text-xs text-muted-foreground">{unit.hours} hours</span>
                  </div>
                  <CardTitle className="pt-1 text-base leading-snug">{unit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>{u.done} of {u.total} activities</span><span className="font-semibold text-foreground">{u.percent}%</span>
                  </div>
                  <Progress value={u.percent} className="h-2" />
                  <Button asChild variant="ghost" size="sm" className="mt-4 px-0 text-primary hover:bg-transparent hover:text-primary/80">
                    <Link to={`/learn?unit=${unit.id}` as string}>Explore unit <ArrowRight className="ml-1 size-3.5" /></Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionTitle hint="A curated next step">Recommended experiment</SectionTitle>
          <Card className="shadow-panel">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-foreground"><FlaskConical className="size-5" /></div>
                <div><div className="flex items-center gap-2"><Badge variant="secondary">Experiment {next.number}</Badge><span className="text-xs text-muted-foreground">{next.minutes} min</span></div><h3 className="mt-1 font-semibold">{next.title}</h3><p className="mt-1 max-w-xl text-sm text-muted-foreground">{next.objective}</p></div>
              </div>
              <Button asChild><Link to={`/experiments/${next.id}` as string}>Start <ArrowRight className="ml-2 size-4" /></Link></Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionTitle hint="Your local activity">Learning rhythm</SectionTitle>
          <Card className="shadow-panel"><CardContent className="grid grid-cols-3 gap-3 p-5"><MiniStat icon={<BookOpen />} label="Lessons" value={`${stats.lessonsDone}/${stats.lessonsTotal}`} /><MiniStat icon={<CheckCircle2 />} label="Experiments" value={`${stats.experimentsDone}/${stats.experimentsTotal}`} /><MiniStat icon={<Clock3 />} label="Lab time" value={`${stats.labMinutes}m`} /></CardContent></Card>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, detail, progress }: { icon: React.ReactNode; label: string; value: string; detail: string; progress: number }) {
  return <Card className="shadow-panel"><CardContent className="p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}<span>{label}</span></div><p className="mt-4 text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p><Progress value={progress} className="mt-5 h-1.5" /></CardContent></Card>;
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="text-center"><div className="mx-auto mb-2 grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">{icon}</div><p className="text-lg font-bold">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>;
}
