import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, CheckCircle2, Clock3, FlaskConical, RotateCcw, Trophy } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/common/SectionHeading";
import { units } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress | DS VirtualLab" },
      { name: "description", content: "Track lessons completed, experiments run and quiz performance — stored locally on this device." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { stats, progress, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your record"
        title="Progress"
        description="Completion status for lessons, experiments and quizzes. All records are stored locally in your browser."
        actions={
          confirming ? (
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => { reset(); setConfirming(false); }}>
                Confirm reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
              <RotateCcw className="mr-2 size-4" /> Reset progress
            </Button>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<Trophy className="size-5 text-warning" />} label="Overall progress" value={`${stats.overall}%`} />
        <StatCard icon={<BookOpen className="size-5 text-info" />} label="Lessons completed" value={`${stats.lessonsDone}/${stats.lessonsTotal}`} />
        <StatCard icon={<FlaskConical className="size-5 text-success" />} label="Experiments completed" value={`${stats.experimentsDone}/${stats.experimentsTotal}`} />
        <StatCard icon={<Clock3 className="size-5 text-muted-foreground" />} label="Lab time" value={`${stats.labMinutes}m`} />
      </div>

      <section>
        <SectionTitle hint="Lessons + experiments per unit">Progress by unit</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {units.map((u) => {
            const s = stats.units[u.id as keyof typeof stats.units];
            return (
              <Card key={u.id} className="shadow-panel">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Unit {u.number}</Badge>
                    <span className="text-xs font-semibold">{s.percent}%</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-snug">{u.title}</p>
                  <Progress value={s.percent} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">{s.done} of {s.total} activities done</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle hint="Most recent first">Quiz attempt history</SectionTitle>
        {progress.quizAttempts.length ? (
          <div className="space-y-2">
            {progress.quizAttempts.map((a, i) => (
              <div key={i} className="panel flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  <span className="font-semibold">{a.score}/{a.total}</span>
                  <Badge variant="outline">{a.unit === "all" ? "All units" : a.unit.replace("-", " ")}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</span>
                {a.weakTopics.length > 0 && (
                  <span className="text-xs text-muted-foreground">Review: {a.weakTopics.join(", ")}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center text-sm text-muted-foreground">
            No quiz attempts yet — head to Practice &amp; MCQs to get started.
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
