import { useCallback, useEffect, useState } from "react";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  resetProgress,
  type QuizAttempt,
  type StudentProgress,
} from "@/services/progress";
import { lessons } from "@/data/lessons";
import { experiments } from "@/data/experiments";

export function useProgress() {
  const [progress, setProgress] = useState<StudentProgress>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
    const sync = () => setProgress(loadProgress());
    window.addEventListener("ds-progress-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ds-progress-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (p: StudentProgress) => StudentProgress) => {
    setProgress((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleLesson = useCallback(
    (id: string) =>
      update((p) => ({
        ...p,
        completedLessons: p.completedLessons.includes(id)
          ? p.completedLessons.filter((l) => l !== id)
          : [...p.completedLessons, id],
      })),
    [update],
  );

  const completeExperiment = useCallback(
    (id: string) =>
      update((p) => ({
        ...p,
        completedExperiments: p.completedExperiments.includes(id)
          ? p.completedExperiments.filter((e) => e !== id)
          : [...p.completedExperiments, id],
      })),
    [update],
  );

  const openExperiment = useCallback(
    (id: string) =>
      update((p) => ({
        ...p,
        lastOpenedExperiment: id,
        recentExperiments: [id, ...p.recentExperiments.filter((e) => e !== id)].slice(0, 6),
      })),
    [update],
  );

  const recordRun = useCallback(
    (seconds: number) =>
      update((p) => ({
        ...p,
        runCount: p.runCount + 1,
        labSeconds: Math.round(p.labSeconds + seconds),
      })),
    [update],
  );

  const recordQuiz = useCallback(
    (attempt: QuizAttempt) => update((p) => ({ ...p, quizAttempts: [attempt, ...p.quizAttempts].slice(0, 30) })),
    [update],
  );

  return {
    progress,
    hydrated,
    toggleLesson,
    completeExperiment,
    openExperiment,
    recordRun,
    recordQuiz,
    reset: resetProgress,
    stats: computeStats(progress),
  };
}

export function computeStats(p: StudentProgress) {
  const unitStat = (unit: string) => {
    const ls = lessons.filter((l) => l.unit === unit);
    const es = experiments.filter((e) => e.unit === unit);
    const done =
      ls.filter((l) => p.completedLessons.includes(l.id)).length +
      es.filter((e) => p.completedExperiments.includes(e.id)).length;
    const total = ls.length + es.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  };

  const units = {
    "unit-1": unitStat("unit-1"),
    "unit-2": unitStat("unit-2"),
    "unit-3": unitStat("unit-3"),
  };

  const totalItems = lessons.length + experiments.length;
  const doneItems = p.completedLessons.length + p.completedExperiments.length;
  const attempts = p.quizAttempts;
  const accuracy = attempts.length
    ? Math.round(
        (attempts.reduce((s, a) => s + a.score, 0) / attempts.reduce((s, a) => s + a.total, 0)) * 100,
      )
    : 0;

  return {
    units,
    overall: totalItems ? Math.round((doneItems / totalItems) * 100) : 0,
    lessonsDone: p.completedLessons.length,
    lessonsTotal: lessons.length,
    experimentsDone: p.completedExperiments.length,
    experimentsTotal: experiments.length,
    quizzesDone: attempts.length,
    accuracy,
    labMinutes: Math.round(p.labSeconds / 60),
    runCount: p.runCount,
  };
}
