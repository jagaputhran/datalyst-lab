export interface QuizAttempt {
  unit: string;
  score: number;
  total: number;
  at: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface StudentProgress {
  completedLessons: string[];
  completedExperiments: string[];
  quizAttempts: QuizAttempt[];
  lastOpenedExperiment?: string;
  recentExperiments: string[];
  labSeconds: number;
  runCount: number;
}

const KEY = "ds-virtual-lab-progress";

export const emptyProgress: StudentProgress = {
  completedLessons: [],
  completedExperiments: [],
  quizAttempts: [],
  recentExperiments: [],
  labSeconds: 0,
  runCount: 0,
};

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
