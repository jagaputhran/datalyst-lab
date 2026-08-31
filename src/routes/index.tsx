import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  FlaskConical,
  GraduationCap,
  ListChecks,
  Play,
  Sparkle,
  TerminalSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionTitle } from "@/components/common/SectionHeading";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experiments } from "@/data/experiments";
import { units, COURSE } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { useTheme } from "@/lib/theme";
import { AssistantWidget } from "@/components/chat/AssistantWidget";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/services/progress";

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
  const upcoming = experiments.filter((e) => !progress.completedExperiments.includes(e.id)).slice(0, 3);

  // Client-only bits (WebGL, time-of-day greeting) mount after first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hour = mounted ? new Date().getHours() : 12;
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const earned = stats.achievements.filter((a) => a.earned);

  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
      {/* ---------- HERO ---------- */}
      <motion.section variants={fadeUp}>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
          <div className="aurora" />
          <div className="grid-texture absolute inset-0" />
          <div className="relative grid items-center gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_300px]">
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground">
                {greeting}, welcome back 👋 · {COURSE.code}
              </p>
              <h1 className="mt-2 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Continue your Data Science journey
              </h1>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Up next: <span className="font-medium text-foreground">{last.title}</span> — {last.objective}
              </p>

              {/* Gamification chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Sparkle className="size-3.5" /> Level {stats.level.level} · {stats.level.title}
                </span>
                <span className="tnum inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning-foreground dark:text-warning">
                  <Zap className="size-3.5" /> {stats.xp.toLocaleString()} XP
                </span>
                <span
                  className={cn(
                    "tnum inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                    stats.streak > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Flame className="size-3.5" />
                  {stats.streak > 0 ? `${stats.streak} day streak` : "Start your streak today"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="lg">
                  <Link to={`/experiments/${last.id}` as string}>
                    <Play className="mr-2 size-4" /> Resume learning
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to={"/syllabus" as never}>View syllabus</Link>
                </Button>
              </div>
            </div>
            <div className="pointer-events-none relative hidden h-[270px] lg:block" aria-hidden>
              {mounted && (
                <Suspense fallback={null}>
                  <HeroBlob dark={theme === "dark"} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ---------- KPI ROW ---------- */}
      <motion.section variants={fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Course progress</p>
              <p className="tnum mt-2 text-2xl font-bold">{stats.overall}%</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {stats.lessonsDone + stats.experimentsDone} of {stats.lessonsTotal + stats.experimentsTotal} activities
              </p>
            </div>
            <ProgressRing percent={stats.overall} size={72} stroke={7} />
          </CardContent>
        </Card>
        <KpiCard
          icon={<FlaskConical className="size-4" />}
          tone="text-accent bg-accent/12"
          label="Labs completed"
          value={`${stats.experimentsDone}`}
          detail={`of ${stats.experimentsTotal} experiments`}
        />
        <KpiCard
          icon={<Clock3 className="size-4" />}
          tone="text-info bg-info/12"
          label="Hours spent"
          value={stats.labMinutes >= 60 ? `${(stats.labMinutes / 60).toFixed(1)}h` : `${stats.labMinutes}m`}
          detail={`${stats.runCount} code runs`}
        />
        <KpiCard
          icon={<Flame className="size-4" />}
          tone="text-destructive bg-destructive/12"
          label="Current streak"
          value={`${stats.streak} ${stats.streak === 1 ? "day" : "days"}`}
          detail={stats.streak > 0 ? "Keep it going!" : "Complete anything today"}
        />
      </motion.section>

      {/* ---------- MODULES + LEVEL + ACHIEVEMENTS ---------- */}
      <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-panel">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Module completion</h2>
              <Link to={"/syllabus" as never} className="text-xs font-medium text-primary hover:underline">
                Full syllabus
              </Link>
            </div>
            <div className="space-y-4">
              {units.map((unit) => {
                const u = stats.units[unit.id];
                return (
                  <Link
                    key={unit.id}
                    to={`/learn?unit=${unit.id}` as string}
                    className="group block rounded-lg p-2 -m-2 transition-colors hover:bg-muted/60"
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <p className="text-[13px] font-medium leading-snug">
                        <span className="text-muted-foreground">Unit {unit.number} · </span>
                        {unit.title}
                      </p>
                      <span className="tnum text-xs font-semibold">{u.percent}%</span>
                    </div>
                    <Progress value={u.percent} className="h-2" />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {u.done} of {u.total} activities · {unit.hours}h
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Level progression */}
            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">
                  Level {stats.level.level} — {stats.level.title}
                </p>
                <p className="tnum text-[11px] text-muted-foreground">
                  {stats.xp} / {stats.level.ceiling} XP
                </p>
              </div>
              <Progress value={stats.level.percent} className="mt-2 h-2" />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {stats.level.ceiling - stats.xp} XP to level {stats.level.level + 1} · earn XP by finishing lessons
                (+50), labs (+100) and quiz answers (+10)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-panel">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Award className="size-4 text-warning" /> Achievements
              </h2>
              <span className="tnum text-xs text-muted-foreground">
                {earned.length}/{stats.achievements.length} earned
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {stats.achievements.map((a) => (
                <div
                  key={a.id}
                  title={a.description}
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    a.earned
                      ? "border-warning/40 bg-warning/8"
                      : "border-border bg-muted/40 opacity-55 grayscale",
                  )}
                >
                  <span className="text-xl">{a.emoji}</span>
                  <p className="mt-1.5 text-xs font-semibold leading-tight">{a.title}</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{a.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ---------- ANALYTICS + ACTIVITY ---------- */}
      <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-panel">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-primary" /> Learning analytics
              </h2>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <div className="h-[190px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weekly} margin={{ top: 16, right: 4, left: -26, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)" }}
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 10,
                        fontSize: 12,
                        color: "var(--color-popover-foreground)",
                      }}
                    />
                    <Bar dataKey="count" name="Activities" fill="var(--color-primary)" radius={[5, 5, 0, 0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-border pt-4">
              <MiniStat icon={<BookOpen />} label="Lessons" value={`${stats.lessonsDone}/${stats.lessonsTotal}`} />
              <MiniStat icon={<ListChecks />} label="Quiz accuracy" value={stats.accuracy ? `${stats.accuracy}%` : "—"} />
              <MiniStat icon={<CheckCircle2 />} label="Experiments" value={`${stats.experimentsDone}/${stats.experimentsTotal}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-panel">
          <CardContent className="p-5">
            <h2 className="mb-4 text-sm font-semibold">Recent activity</h2>
            {progress.activity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <GraduationCap className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No activity yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete a lesson or run some Python — your learning timeline will appear here.
                </p>
              </div>
            ) : (
              <ol className="space-y-1">
                {progress.activity.slice(0, 7).map((a, i) => (
                  <TimelineItem key={`${a.at}-${i}`} event={a} last={i === Math.min(6, progress.activity.length - 1)} />
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* ---------- RECOMMENDED + UPCOMING ---------- */}
      <motion.section variants={fadeUp} className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <SectionTitle hint="A curated next step">Recommended for you</SectionTitle>
          <Card className="shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-foreground dark:text-accent">
                  <FlaskConical className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Experiment {next.number}</Badge>
                    <span className="text-xs text-muted-foreground">{next.minutes} min · +100 XP</span>
                  </div>
                  <h3 className="mt-1 font-semibold">{next.title}</h3>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{next.objective}</p>
                </div>
              </div>
              <Button asChild>
                <Link to={`/experiments/${next.id}` as string}>
                  Start <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionTitle hint="Queued next">Upcoming labs</SectionTitle>
          <Card className="shadow-panel">
            <CardContent className="divide-y divide-border p-2">
              {upcoming.map((e) => (
                <Link
                  key={e.id}
                  to={`/experiments/${e.id}` as string}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
                >
                  <span className="tnum grid size-8 shrink-0 place-items-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                    {e.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{e.title}</span>
                    <span className="text-[11px] text-muted-foreground">{e.minutes} min · +100 XP</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <AssistantWidget />
    </motion.div>
  );
}

function KpiCard({
  icon,
  tone,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <span className={cn("grid size-8 place-items-center rounded-lg", tone)}>{icon}</span>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
        <p className="tnum mt-3 text-2xl font-bold">{value}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

const ACTIVITY_META: Record<ActivityEvent["type"], { icon: React.ReactNode; tone: string }> = {
  lesson: { icon: <BookOpen className="size-3.5" />, tone: "bg-primary/12 text-primary" },
  experiment: { icon: <FlaskConical className="size-3.5" />, tone: "bg-accent/15 text-accent-foreground dark:text-accent" },
  quiz: { icon: <ListChecks className="size-3.5" />, tone: "bg-warning/15 text-warning-foreground dark:text-warning" },
  run: { icon: <TerminalSquare className="size-3.5" />, tone: "bg-muted text-muted-foreground" },
};

function timeAgo(at: number): string {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

function TimelineItem({ event, last }: { event: ActivityEvent; last: boolean }) {
  const meta = ACTIVITY_META[event.type];
  return (
    <li className="relative flex gap-3 pb-1">
      <div className="flex flex-col items-center">
        <span className={cn("z-10 grid size-7 shrink-0 place-items-center rounded-full", meta.tone)}>{meta.icon}</span>
        {!last && <span className="w-px flex-1 bg-border" />}
      </div>
      <div className="min-w-0 pb-3 pt-1">
        <p className="truncate text-[13px] leading-snug">{event.label}</p>
        <p className="text-[11px] text-muted-foreground">{timeAgo(event.at)}</p>
      </div>
    </li>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-2 grid size-8 place-items-center rounded-md bg-muted text-muted-foreground [&>svg]:size-4">
        {icon}
      </div>
      <p className="tnum text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
