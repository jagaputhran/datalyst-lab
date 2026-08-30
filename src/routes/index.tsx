import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Play,
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
import { useTheme } from "@/lib/theme";
import { AssistantWidget } from "@/components/chat/AssistantWidget";

const HeroBlob = lazy(() => import("@/components/three/HeroBlob"));

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

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
  const { theme } = useTheme();
  const last = experiments.find((e) => e.id === progress.lastOpenedExperiment) ?? experiments[0]!;
  const next = experiments.find((e) => !progress.completedExperiments.includes(e.id)) ?? experiments[1]!;

  // Mount the WebGL scene only on the client, after first paint.
  const [showBlob, setShowBlob] = useState(false);
  useEffect(() => setShowBlob(true), []);

  return (
    <motion.div className="space-y-7" variants={stagger} initial="hidden" animate="show">
      <PageHeader
        eyebrow={`${COURSE.code} · ${COURSE.name}`}
        title="Course dashboard"
        description="Track your progress through the syllabus, resume your last lab session, and see what to study next."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={"/syllabus" as never}>View syllabus</Link>
            </Button>
            <Button asChild>
              <Link to={`/experiments/${last.id}` as string}>
                <Play className="mr-2 size-4" /> Continue lab
              </Link>
            </Button>
          </div>
        }
      />

      <motion.section variants={fadeUp}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-panel">
          <div className="aurora" />
          <div className="grid-texture absolute inset-0" />
          <div className="relative grid items-center gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Continue where you left off
              </p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">{last.title}</h2>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{last.objective}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="lg">
                  <Link to={`/experiments/${last.id}` as string}>
                    Resume experiment <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to={"/experiments" as never}>Browse all experiments</Link>
                </Button>
              </div>
            </div>
            <div className="pointer-events-none relative hidden h-[280px] lg:block" aria-hidden>
              {showBlob && (
                <Suspense fallback={null}>
                  <HeroBlob dark={theme === "dark"} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-2">
        <MetricCard icon={<Target className="size-5 text-info" />} label="Overall progress" value={`${stats.overall}%`} detail={`${stats.lessonsDone} lessons · ${stats.experimentsDone} experiments`} progress={stats.overall} />
        <MetricCard icon={<Trophy className="size-5 text-warning" />} label="Practice accuracy" value={stats.accuracy ? `${stats.accuracy}%` : "—"} detail={stats.quizzesDone ? `${stats.quizzesDone} quiz attempts` : "No attempts yet — start a quiz"} progress={stats.accuracy} />
      </motion.section>

      <motion.section variants={fadeUp}>
        <SectionTitle hint="Stored locally on this device">Your course at a glance</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {units.map((unit) => {
            const u = stats.units[unit.id];
            return (
              <Card key={unit.id} className="shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
      </motion.section>

      <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
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
      </motion.section>

      <AssistantWidget />
    </motion.div>
  );
}

function MetricCard({ icon, label, value, detail, progress }: { icon: React.ReactNode; label: string; value: string; detail: string; progress: number }) {
  return <Card className="shadow-panel"><CardContent className="p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}<span>{label}</span></div><p className="tnum mt-4 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p><Progress value={progress} className="mt-5 h-1.5" /></CardContent></Card>;
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="text-center"><div className="mx-auto mb-2 grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">{icon}</div><p className="tnum text-lg font-semibold">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>;
}
