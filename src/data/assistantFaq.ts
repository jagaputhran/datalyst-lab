/** Knowledge base for the dashboard assistant — pure client-side FAQ matching. */

export interface FaqEntry {
  id: string;
  /** Lowercase keywords scored against the user's message. */
  keywords: string[];
  answer: string;
  /** Suggested follow-up questions (shown as tappable chips). */
  followUps: string[];
}

export const GREETING =
  "Hi! I'm the VirtualLab guide. I can explain what this site is, how the labs work, and how to get the most out of the course. What would you like to know?";

export const STARTER_QUESTIONS = [
  "What is this website?",
  "How do I get started?",
  "Do I need to install anything?",
  "How is my progress saved?",
];

export const FALLBACK_ANSWER =
  "I'm a simple offline guide, so I only know about this site — I couldn't match that question. Try one of these:";

export const faqEntries: FaqEntry[] = [
  {
    id: "about",
    keywords: ["what", "website", "site", "about", "this", "virtuallab", "purpose", "platform"],
    answer:
      "DS VirtualLab is an interactive companion for the 21CSS303T Data Science course. You can read lessons, run real Python (NumPy, Pandas, Matplotlib) directly in your browser, explore datasets, build charts, and test yourself with MCQs — all in one place.",
    followUps: ["How do I get started?", "What are the three units?", "How do the Python labs work?"],
  },
  {
    id: "get-started",
    keywords: ["start", "started", "begin", "first", "new", "how do i", "where"],
    answer:
      "Best path: 1) Skim the Course Syllabus to see the three units. 2) Open Learn and read the first lesson — each has a runnable \"Try it\" code cell. 3) Do the matching Virtual Experiment. 4) Finish the topic with a quiz in Practice & MCQs. Your dashboard tracks all of it.",
    followUps: ["What are the three units?", "What are virtual experiments?", "How do quizzes work?"],
  },
  {
    id: "units",
    keywords: ["unit", "units", "three", "syllabus", "topics", "course", "curriculum", "cover"],
    answer:
      "The course has three 15-hour units: Unit 1 — Introduction to Data Science, NumPy and Pandas. Unit 2 — Data Wrangling, Cleaning and Preparation. Unit 3 — Data Visualization. Each unit combines lessons, hands-on experiments and practice questions.",
    followUps: ["How do I get started?", "What are virtual experiments?", "How is my progress saved?"],
  },
  {
    id: "python",
    keywords: ["python", "pyodide", "run", "code", "labs", "execute", "runtime", "numpy", "pandas", "matplotlib"],
    answer:
      "Python runs entirely in your browser via Pyodide (WebAssembly) — no server, no setup. The runtime downloads once from a CDN and is cached. NumPy, Pandas and Matplotlib are available; plots render inline. Your code and data never leave this device.",
    followUps: ["Do I need to install anything?", "Why won't the Python runtime load?", "Is my data private?"],
  },
  {
    id: "install",
    keywords: ["install", "setup", "download", "requirement", "need", "anything", "software", "account", "login", "sign"],
    answer:
      "Nothing to install and no account needed. Everything — lessons, Python execution, datasets, quizzes and progress — runs and stays in your browser. Just an internet connection for the first visit while the Python runtime downloads.",
    followUps: ["How do the Python labs work?", "How is my progress saved?"],
  },
  {
    id: "runtime-error",
    keywords: ["won't", "wont", "error", "load", "fail", "stuck", "slow", "blocked", "not working", "problem", "cdn"],
    answer:
      "The Python runtime downloads from cdn.jsdelivr.net on first use. If it fails: check your connection, then press Retry. On corporate or campus networks that CDN is sometimes blocked — try a different network (e.g. mobile hotspot). Everything else on the site still works without Python.",
    followUps: ["How do the Python labs work?", "Do I need to install anything?"],
  },
  {
    id: "experiments",
    keywords: ["experiment", "experiments", "virtual", "lab", "labs", "hands-on", "practice lab"],
    answer:
      "Virtual Experiments are guided hands-on labs (23 of them) — each states an objective, gives you runnable starter code, and ends with a self-check. They mirror a university lab manual, but with instant feedback in the browser. Start from the Virtual Experiments page or via lesson links.",
    followUps: ["How do I get started?", "How do quizzes work?", "What is the Data Playground?"],
  },
  {
    id: "quizzes",
    keywords: ["quiz", "quizzes", "mcq", "mcqs", "practice", "test", "question", "exam", "accuracy"],
    answer:
      "Practice & MCQs has exam-style multiple-choice questions for each unit. You get instant feedback with explanations, and your accuracy is tracked on the dashboard and Progress page — useful for spotting weak topics before exams.",
    followUps: ["How is my progress saved?", "What are the three units?"],
  },
  {
    id: "playground",
    keywords: ["playground", "dataset", "csv", "upload", "explore", "data playground"],
    answer:
      "The Data Playground lets you explore datasets interactively — load the built-in student performance dataset or your own CSV, inspect rows, filter, and run Pandas on it. Great for experimenting beyond the guided labs.",
    followUps: ["What is the Visualization Studio?", "Is my data private?"],
  },
  {
    id: "studio",
    keywords: ["studio", "visualization", "visualisation", "chart", "charts", "plot", "graph"],
    answer:
      "The Visualization Studio is a chart-building workspace: pick a dataset, choose chart types (bar, line, scatter, histogram and more) and generate the Matplotlib/Plotly code behind them — a fast way to learn Unit 3 concepts by doing.",
    followUps: ["What is the Data Playground?", "What are the three units?"],
  },
  {
    id: "progress",
    keywords: ["progress", "saved", "save", "track", "storage", "history", "resume", "lose", "clear"],
    answer:
      "Progress (completed lessons, experiments, quiz scores, lab time) is stored in your browser's localStorage on this device. Nothing is uploaded. Note: clearing browser data or switching devices/browsers resets it.",
    followUps: ["Is my data private?", "How do quizzes work?"],
  },
  {
    id: "privacy",
    keywords: ["privacy", "private", "data", "secure", "security", "leave", "tracking", "collect"],
    answer:
      "Everything is local: code you run, datasets you load and progress you make stay in your browser. There's no backend, no account and no analytics on your work. The only network use is downloading the site itself and the Python runtime.",
    followUps: ["How is my progress saved?", "Do I need to install anything?"],
  },
];
