import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ListChecks, RotateCcw, Trophy, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import { quizQuestions, type QuizQuestion } from "@/data/quizzes";
import { units } from "@/data/syllabus";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice & MCQs | DS VirtualLab" },
      { name: "description", content: "Test your understanding with scored practice quizzes across every unit." },
    ],
  }),
  component: PracticePage,
});

type Phase = "setup" | "quiz" | "results";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function PracticePage() {
  const { recordQuiz, progress, stats } = useProgress();
  const [phase, setPhase] = useState<Phase>("setup");
  const [unit, setUnit] = useState<string | "all">("all");
  const [set, setSet] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ q: QuizQuestion; correct: boolean }[]>([]);

  const pool = useMemo(() => (unit === "all" ? quizQuestions : quizQuestions.filter((q) => q.unit === unit)), [unit]);

  const start = () => {
    const s = shuffle(pool);
    setSet(s);
    setIndex(0);
    setPicked([]);
    setSubmitted(false);
    setResults([]);
    setPhase("quiz");
  };

  const current = set[index];

  const toggle = (i: number) => {
    if (submitted) return;
    if (current?.kind === "multi") {
      setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
    } else {
      setPicked([i]);
    }
  };

  const isCorrectPick = (q: QuizQuestion, pick: number[]) =>
    pick.length === q.answer.length && pick.every((p) => q.answer.includes(p));

  const submit = () => {
    if (!current) return;
    setSubmitted(true);
    setResults((r) => [...r, { q: current, correct: isCorrectPick(current, picked) }]);
  };

  const nextQuestion = () => {
    if (index + 1 < set.length) {
      setIndex((i) => i + 1);
      setPicked([]);
      setSubmitted(false);
    } else {
      const score = results.filter((r) => r.correct).length;
      const weak = [...new Set(results.filter((r) => !r.correct).map((r) => r.q.topic))];
      const strong = [...new Set(results.filter((r) => r.correct).map((r) => r.q.topic))];
      recordQuiz({ unit, score, total: set.length, at: Date.now(), weakTopics: weak, strongTopics: strong });
      setPhase("results");
    }
  };

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Assessment"
          title="Practice questions"
          description="Scored multiple-choice quizzes for each unit, with an explanation for every option — correct and incorrect."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Attempts so far" value={String(stats.quizzesDone)} icon={<ListChecks className="size-5 text-info" />} />
          <SummaryCard label="Overall accuracy" value={stats.accuracy ? `${stats.accuracy}%` : "—"} icon={<Trophy className="size-5 text-warning" />} />
          <SummaryCard label="Questions available" value={String(quizQuestions.length)} icon={<CheckCircle2 className="size-5 text-success" />} />
          <SummaryCard label="Last attempt" value={progress.quizAttempts[0] ? `${progress.quizAttempts[0].score}/${progress.quizAttempts[0].total}` : "—"} icon={<RotateCcw className="size-5 text-muted-foreground" />} />
        </div>

        <div className="panel p-6">
          <p className="text-sm font-semibold">Choose a scope</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant={unit === "all" ? "default" : "outline"} onClick={() => setUnit("all")}>
              All units ({quizQuestions.length})
            </Button>
            {units.map((u) => (
              <Button key={u.id} variant={unit === u.id ? "default" : "outline"} onClick={() => setUnit(u.id)}>
                Unit {u.number} ({quizQuestions.filter((q) => q.unit === u.id).length})
              </Button>
            ))}
          </div>
          <Button className="mt-5" onClick={start} disabled={!pool.length}>
            Start quiz <ListChecks className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const score = results.filter((r) => r.correct).length;
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Session complete" title="Your results" />
        <div className="panel p-8 text-center">
          <p className="text-5xl font-bold">{score}/{set.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">{Math.round((score / set.length) * 100)}% correct</p>
          <Progress value={(score / set.length) * 100} className="mx-auto mt-4 max-w-xs" />
        </div>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
              {r.correct ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : <XCircle className="size-4 shrink-0 text-destructive" />}
              <span className="flex-1">{r.q.prompt}</span>
              <Badge variant="outline">{r.q.topic}</Badge>
            </div>
          ))}
        </div>
        <Button onClick={() => setPhase("setup")}>
          <RotateCcw className="mr-2 size-4" /> New quiz
        </Button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Question ${index + 1} of ${set.length}`}
        title={current.topic}
        actions={<Badge variant="outline">{current.unit.replace("-", " ")}</Badge>}
      />
      <Progress value={((index + (submitted ? 1 : 0)) / set.length) * 100} />

      <div className="panel p-6">
        <p className="text-sm font-semibold">{current.prompt}</p>
        {current.code && (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[12px] leading-relaxed">{current.code}</pre>
        )}

        <div className="mt-4 space-y-2">
          {current.options.map((opt, i) => {
            const isPicked = picked.includes(i);
            const isAnswer = current.answer.includes(i);
            return (
              <button
                key={opt}
                onClick={() => toggle(i)}
                className={cn(
                  "block w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                  !submitted && isPicked && "border-primary bg-primary/5",
                  !submitted && !isPicked && "border-border hover:border-primary/40",
                  submitted && isAnswer && "border-success bg-success/10",
                  submitted && isPicked && !isAnswer && "border-destructive bg-destructive/10",
                  submitted && !isPicked && !isAnswer && "border-border opacity-60",
                )}
              >
                {opt}
                {submitted && !isAnswer && isPicked && current.whyWrong[i] && (
                  <span className="mt-1 block text-xs text-destructive/80">{current.whyWrong[i]}</span>
                )}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">{current.explanation}</div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          {!submitted ? (
            <Button onClick={submit} disabled={!picked.length}>
              Submit answer
            </Button>
          ) : (
            <Button onClick={nextQuestion}>{index + 1 < set.length ? "Next question" : "Finish"}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
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
