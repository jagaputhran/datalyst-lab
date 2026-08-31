export interface QuizAttempt {
  unit: string;
  score: number;
  total: number;
  at: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface ActivityEvent {
  type: "lesson" | "experiment" | "quiz" | "run";
  label: string;
  at: number;
}

export interface StudentProgress {
  completedLessons: string[];
  completedExperiments: string[];
  quizAttempts: QuizAttempt[];
  lastOpenedExperiment?: string;
  recentExperiments: string[];
  labSeconds: number;
  runCount: number;
  /** Recent activity feed, newest first (capped). */
  activity: ActivityEvent[];
  /** ISO dates (YYYY-MM-DD) with any learning activity (capped). */
  activeDays: string[];
}

const KEY = "ds-virtual-lab-progress";

export const emptyProgress: StudentProgress = {
  completedLessons: [],
  completedExperiments: [],
  quizAttempts: [],
  recentExperiments: [],
  labSeconds: 0,
  runCount: 0,
  activity: [],
  activeDays: [],
};

/** Today's local date as YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Merge an activity event + today's date into a progress object. */
export function withActivity(p: StudentProgress, event: ActivityEvent): StudentProgress {
  const day = todayKey(new Date(event.at));
  return {
    ...p,
    activity: [event, ...p.activity].slice(0, 40),
    activeDays: p.activeDays.includes(day) ? p.activeDays : [...p.activeDays, day].slice(-90),
  };
}

export function loadProgress(): StudentProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (!saved) return emptyProgress;
    return { ...emptyProgress, ...(JSON.parse(saved) as Partial<StudentProgress>) };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StudentProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("ds-progress-changed"));
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("ds-progress-changed"));
}
