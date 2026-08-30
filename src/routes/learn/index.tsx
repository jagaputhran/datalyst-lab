import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Play, Search } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { lessons } from "@/data/lessons";
import { units } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/learn/")({
  validateSearch: (search: Record<string, unknown>) => ({ unit: typeof search.unit === "string" ? search.unit : undefined }),
  head: () => ({ meta: [
    { title: "Learn Data Science | DS VirtualLab" },
    { name: "description", content: "Study data science concepts with simple explanations, visual examples and executable browser-based lessons." },
    { property: "og:title", content: "Learn Data Science | DS VirtualLab" },
    { property: "og:description", content: "Concepts, examples and interactive demos for DATA SCIENCE 21CSS303T." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LearnPage,
});

function LearnPage() {
  const { unit } = useSearch({ from: "/learn/" });
  const [query, setQuery] = useState("");
  const [activeUnit, setActiveUnit] = useState(unit ?? "unit-1");
  const { progress, toggleLesson } = useProgress();
  const visible = useMemo(() => lessons.filter((l) => l.unit === activeUnit && `${l.title} ${l.group} ${l.concept}`.toLowerCase().includes(query.toLowerCase())), [activeUnit, query]);
  return <div className="space-y-6">
    <PageHeader eyebrow="Course lessons" title="Lessons" description="Structured lessons covering the full syllabus — each moves from concept to worked example to an executable lab." actions={<div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter this unit…" className="pl-9" /></div>} />
    <div className="flex gap-2 overflow-auto pb-1">{units.map((u) => <Button key={u.id} variant={activeUnit === u.id ? "default" : "outline"} onClick={() => setActiveUnit(u.id)} className="shrink-0">Unit {u.number}<span className="ml-1 hidden sm:inline">· {u.title.split(",")[0]}</span></Button>)}</div>
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="panel h-fit p-3"><p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{visible.length} lessons</p>{visible.map((l) => <Link key={l.id} to="/learn/$lessonId" params={{ lessonId: l.id }} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"><span className="shrink-0">{progress.completedLessons.includes(l.id) ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4 text-muted-foreground/60" />}</span><span className="truncate">{l.title}</span></Link>)}</aside>
      <div className="space-y-4"><SectionTitle hint="Each lesson ends with a lab">Unit {units.find((u) => u.id === activeUnit)?.number} topics</SectionTitle>{visible.length ? visible.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} complete={progress.completedLessons.includes(lesson.id)} onToggle={() => toggleLesson(lesson.id)} />) : <div className="panel p-10 text-center text-sm text-muted-foreground">No lesson matches “{query}”.</div>}</div>
    </div>
  </div>;
}

function LessonCard({ lesson, complete, onToggle }: { lesson: (typeof lessons)[number]; complete: boolean; onToggle: () => void }) { return <Card className="shadow-panel"><CardContent className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Badge variant="outline">{lesson.group}</Badge>{complete && <Badge className="bg-success text-success-foreground">Completed</Badge>}</div><h2 className="mt-2 text-xl font-bold">{lesson.title}</h2></div><button onClick={onToggle} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">{complete ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4" />}{complete ? "Completed" : "Mark complete"}</button></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{lesson.concept}</p><div className="mt-5 grid gap-3 md:grid-cols-3"><Info title="Why it matters" text={lesson.why} /><Info title="Easy example" text={lesson.example} /><Info title="Key takeaway" text={lesson.takeaway} /></div><div className="mt-5 flex flex-wrap gap-2"><Button asChild><Link to="/learn/$lessonId" params={{ lessonId: lesson.id }}>Open lesson <ArrowRight className="ml-2 size-4" /></Link></Button>{lesson.experimentId && <Button asChild variant="outline"><Link to="/experiments/$experimentId" params={{ experimentId: lesson.experimentId }}><Play className="mr-2 size-4" /> Run experiment</Link></Button>}</div></CardContent></Card>; }
function Info({ title, text }: { title: string; text: string }) { return <div className="rounded-xl border border-border bg-muted/35 p-3.5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p><p className="mt-1.5 text-sm leading-relaxed">{text}</p></div>; }
