import type { StudentProgress } from "@/services/progress";
import { todayKey } from "@/services/progress";
import { experiments } from "@/data/experiments";
import { lessons } from "@/data/lessons";

/**
 * Gamification layer — everything is DERIVED from stored progress,
 * so no extra persistence or migration is needed.
 */

export const XP_RULES = { lesson: 50, experiment: 100, quizCorrect: 10, run: 2 } as const;

export interface LevelInfo {
  level: number;
  title: string;
  xp: number;
  /** XP where the current level started / next level begins. */
  floor: number;
  ceiling: number;
  /** 0-100 progress within the current level. */
  percent: number;
}

const LEVELS: { at: number; title: string }[] = [
  { at: 0, title: "Data Novice" },
  { at: 200, title: "Data Explorer" },
  { at: 500, title: "Data Analyst" },
  { at: 1000, title: "Data Scientist" },
  { at: 1800, title: "Senior Data Scientist" },
  { at: 3000, title: "Data Science Master" },
];

export function computeXp(p: StudentProgress): number {
  const quizXp = p.quizAttempts.reduce((s, a) => s + a.score * XP_RULES.quizCorrect, 0);
  return (
    p.completedLessons.length * XP_RULES.lesson +
    p.completedExperiments.length * XP_RULES.experiment +
    quizXp +
    Math.min(p.runCount, 200) * XP_RULES.run
  );
}

export function computeLevel(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]!.at) idx = i;
  const floor = LEVELS[idx]!.at;
  const ceiling = idx + 1 < LEVELS.length ? LEVELS[idx + 1]!.at : floor + 1500;
  return {
    level: idx + 1,
    title: LEVELS[idx]!.title,
    xp,
    floor,
    ceiling,
    percent: Math.min(100, Math.round(((xp - floor) / (ceiling - floor)) * 100)),
  };
}

/** Consecutive active days ending today or yesterday. */
export function computeStreak(activeDays: string[]): number {
  if (!activeDays.length) return 0;
  const days = new Set(activeDays);
  const cursor = new Date();
  // A streak survives if the last activity was today OR yesterday.
  if (!days.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
}

export function computeAchievements(p: StudentProgress, streak: number): Achievement[] {
  const unitDone = (unit: string) => {
    const es = experiments.filter((e) => e.unit === unit);
    return es.length > 0 && es.every((e) => p.completedExperiments.includes(e.id));
  };
  const unitLessonsDone = (unit: string) => {
    const ls = lessons.filter((l) => l.unit === unit);
    return ls.length > 0 && ls.every((l) => p.completedLessons.includes(l.id));
  };
  const perfectQuiz = p.quizAttempts.some((a) => a.total >= 5 && a.score === a.total);

  return [
    {
      id: "first-lesson",
      emoji: "🎓",
      title: "First Steps",
      description: "Complete your first lesson",
      earned: p.completedLessons.length >= 1,
    },
    {
      id: "lab-rat",
      emoji: "🧪",
      title: "Lab Rat",
      description: "Complete 5 experiments",
      earned: p.completedExperiments.length >= 5,
    },
    {
      id: "numpy-master",
      emoji: "🏆",
      title: "NumPy & Pandas Master",
      description: "Finish every Unit 1 lesson",
      earned: unitLessonsDone("unit-1"),
    },
    {
      id: "wrangler",
      emoji: "🧹",
      title: "Data Wrangler",
      description: "Finish every Unit 2 experiment",
      earned: unitDone("unit-2"),
    },
    {
      id: "visualist",
      emoji: "📊",
      title: "Visualization Pro",
      description: "Finish every Unit 3 experiment",
      earned: unitDone("unit-3"),
    },
    {
      id: "perfect-quiz",
      emoji: "💯",
      title: "Perfect Score",
      description: "Ace a quiz with 100%",
      earned: perfectQuiz,
    },
    {
      id: "streak-3",
      emoji: "🔥",
      title: "On Fire",
      description: "Learn 3 days in a row",
      earned: streak >= 3,
    },
    {
      id: "runner-50",
      emoji: "⚡",
      title: "Code Runner",
      description: "Run Python 50 times",
      earned: p.runCount >= 50,
    },
  ];
}

/** Activity counts for the last 7 days (oldest → newest) for the analytics chart. */
export function weeklyActivity(p: StudentProgress): { day: string; count: number }[] {
  const out: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = p.activity.filter((a) => todayKey(new Date(a.at)) === key).length;
    out.push({ day: label, count });
  }
  return out;
}
