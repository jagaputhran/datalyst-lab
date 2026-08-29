import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Check, ChevronRight, Clock3, FlaskConical, Target } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { units } from "@/data/syllabus";
import { lessonsByUnit } from "@/data/lessons";
import { experimentsByUnit } from "@/data/experiments";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/syllabus")({
  head: () => ({ meta: [
    { title: "Course Syllabus | DS VirtualLab" },
    { name: "description", content: "Explore the DATA SCIENCE 21CSS303T syllabus across NumPy, Pandas, data cleaning and visualization." },
    { property: "og:title", content: "Course Syllabus | DS VirtualLab" },
    { property: "og:description", content: "A structured, experiment-led Data Science curriculum." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SyllabusPage,
});

function SyllabusPage() {
  const { stats } = useProgress();
  return <div className="space-y-7">
    <PageHeader eyebrow="Course map" title="Course syllabus" description="A 45-hour, experiment-led path from data foundations to polished visual communication." actions={<Button asChild><Link to={"/learn" as never}><BookOpen className="mr-2 size-4" /> Start learning</Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat icon={<Target />} label="Learning activities" value={`${stats.lessonsTotal + stats.experimentsTotal}`} detail="lessons + experiments" />
      <Stat icon={<FlaskConical />} label="Hands-on labs" value={`${stats.experimentsTotal}`} detail="with editable Python" />
      <Stat icon={<Clock3 />} label="Course workload" value="45h" detail="across three units" />
    </div>
    <section className="space-y-4">
      <SectionTitle hint="Follow in order or jump to any topic">Three units</SectionTitle>
      {units.map((unit) => {
        const u = stats.units[unit.id];
        const lessons = lessonsByUnit(unit.id);
        const exps = experimentsByUnit(unit.id);
        return <Card key={unit.id} className="overflow-hidden shadow-panel">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-[260px_1fr]">
              <div className="border-b border-border bg-muted/35 p-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between"><Badge>Unit {unit.number}</Badge><span className="text-xs text-muted-foreground">{unit.hours} hours</span></div>
                <h2 className="mt-4 text-lg font-bold leading-snug">{unit.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{unit.summary}</p>
                <div className="mt-5 flex justify-between text-xs"><span>{u.done} / {u.total} complete</span><b>{u.percent}%</b></div><Progress value={u.percent} className="mt-2 h-2" />
              </div>
              <div className="p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Learn</p><div className="space-y-1.5">{lessons.map((lesson) => <Link key={lesson.id} to={`/learn/${lesson.id}` as never} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"><span className={u.done && ""}>{lesson.title}</span><ChevronRight className="ml-auto size-3.5 text-muted-foreground" /></Link>)}</div></div>
                  <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experiment</p><div className="space-y-1.5">{exps.map((exp) => <Link key={exp.id} to={`/experiments/${exp.id}` as never} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"><span className="grid size-5 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{exp.number}</span><span className="truncate">{exp.title}</span><ChevronRight className="ml-auto size-3.5 shrink-0 text-muted-foreground" /></Link>)}</div></div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-5"><Link to={`/learn?unit=${unit.id}` as never}>Open Unit {unit.number}</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>;
      })}
    </section>
    <div className="panel flex flex-wrap items-center gap-3 bg-info/5 p-4 text-sm"><Check className="size-5 text-info" /><span><b>Suggested path:</b> read a concept, interact with its demo, run the experiment, then test yourself in Practice.</span></div>
  </div>;
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <Card className="shadow-panel"><CardContent className="p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{icon}<span>{label}</span></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-0.5 text-xs text-muted-foreground">{detail}</p></CardContent></Card>; }
