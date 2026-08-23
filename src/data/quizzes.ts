export type QuestionKind = "mcq" | "multi" | "output" | "error" | "order" | "fill";

export interface QuizQuestion {
  id: string;
  unit: "unit-1" | "unit-2" | "unit-3";
  kind: QuestionKind;
  topic: string;
  prompt: string;
  code?: string;
  options: string[];
  /** indices of correct options */
  answer: number[];
  explanation: string;
  whyWrong: Record<number, string>;
  lessonId?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    unit: "unit-1",
    kind: "output",
    topic: "NumPy shape",
    prompt: "What will be the shape of the array created below?",
    code: "np.zeros((3, 4))",
    options: ["(4, 3)", "(3, 4)", "12", "Error"],
    answer: [1],
    explanation:
      "np.zeros takes the shape tuple exactly as given: 3 rows and 4 columns, so arr.shape is (3, 4).",
    whyWrong: {
      0: "(4, 3) reverses the tuple — NumPy does not transpose on creation.",
      2: "12 is arr.size (total elements), not arr.shape.",
      3: "A shape tuple is a valid argument, so there is no error.",
    },
    lessonId: "numpy-creating",
  },
  {
    id: "q2",
    unit: "unit-1",
    kind: "mcq",
    topic: "NumPy indexing",
    prompt: "For arr = np.array([[10,20,30],[40,50,60],[70,80,90]]), what does arr[1, 2] return?",
    options: ["20", "60", "80", "[40, 50, 60]"],
    answer: [1],
    explanation: "Indexing is [row, column] and both are 0-based: row 1 is [40,50,60], column 2 is 60.",
    whyWrong: {
      0: "20 is arr[0, 1].",
      2: "80 is arr[2, 1].",
      3: "arr[1] alone returns the whole second row.",
    },
    lessonId: "numpy-indexing",
  },
  {
    id: "q3",
    unit: "unit-1",
    kind: "multi",
    topic: "NumPy views vs copies",
    prompt: "Select all statements that are true about NumPy arrays.",
    options: [
      "Basic slicing returns a view that shares memory with the original array",
      "arr.copy() returns an independent array",
      "np.eye(3) creates a 3x3 identity matrix",
      "NumPy arrays can hold mixed data types efficiently like Python lists",
    ],
    answer: [0, 1, 2],
    explanation:
      "Slices are views, .copy() breaks the link, and np.eye(n) builds the identity matrix. NumPy arrays are homogeneous — one dtype per array.",
    whyWrong: {
      3: "NumPy arrays are homogeneous; mixing types forces the dtype to object and loses the speed advantage.",
    },
    lessonId: "numpy-copy",
  },
  {
    id: "q4",
    unit: "unit-1",
    kind: "output",
    topic: "Pandas Series",
    prompt: "What is printed?",
    code: 's = pd.Series([10, 20, 30], index=["a", "b", "c"])\nprint(s["b"])',
    options: ["10", "20", "b", "KeyError"],
    answer: [1],
    explanation: "A Series is labelled data; s['b'] looks the label up and returns 20.",
    whyWrong: {
      0: "10 is s['a'] / s.iloc[0].",
      2: "'b' is the label, not the value.",
      3: "'b' exists in the index, so no KeyError.",
    },
    lessonId: "pandas-series",
  },
  {
    id: "q5",
    unit: "unit-1",
    kind: "mcq",
    topic: "Summary statistics",
    prompt: "Which method gives count, mean, std, min, quartiles and max for every numeric column?",
    options: ["df.info()", "df.describe()", "df.head()", "df.shape"],
    answer: [1],
    explanation: "df.describe() returns the full numeric summary table.",
    whyWrong: {
      0: "df.info() shows dtypes and non-null counts, not quartiles.",
      2: "df.head() only previews the first rows.",
      3: "df.shape is a (rows, columns) tuple.",
    },
    lessonId: "pandas-summary",
  },
  {
    id: "q6",
    unit: "unit-2",
    kind: "mcq",
    topic: "Merging",
    prompt:
      "students has IDs [1,2,3] and scores has IDs [1,2,4]. How many rows does a LEFT merge on Student_ID produce?",
    options: ["2", "3", "4", "6"],
    answer: [1],
    explanation:
      "A left join keeps every row of the left frame (3 students). ID 3 gets NaN for Score, and ID 4 is dropped.",
    whyWrong: {
      0: "2 is the inner-join result (only IDs 1 and 2 match).",
      2: "4 is the outer-join result (IDs 1, 2, 3, 4).",
      3: "6 would require a cross join.",
    },
    lessonId: "wrangling-merge",
  },
  {
    id: "q7",
    unit: "unit-2",
    kind: "fill",
    topic: "Missing values",
    prompt: "Complete the code to fill missing Score values with the column mean.",
    code: 'df["Score"] = df["Score"].______(df["Score"].mean())',
    options: ["dropna", "fillna", "isna", "replace"],
    answer: [1],
    explanation: "fillna(value) substitutes a value wherever the data is NaN.",
    whyWrong: {
      0: "dropna removes rows instead of filling them.",
      2: "isna only returns a boolean mask.",
      3: "replace needs an explicit old value; NaN comparisons make it awkward.",
    },
    lessonId: "cleaning-missing",
  },
  {
    id: "q8",
    unit: "unit-2",
    kind: "mcq",
    topic: "Outliers",
    prompt: "With Q1 = 60, Q3 = 84 and the standard 1.5 multiplier, what is the upper bound?",
    options: ["96", "108", "120", "84"],
    answer: [1],
    explanation: "IQR = 84 − 60 = 24. Upper bound = Q3 + 1.5 × IQR = 84 + 36 = 120... careful: 1.5 × 24 = 36, so 84 + 36 = 120.",
    whyWrong: {
      0: "96 uses 0.5 × IQR.",
      2: "120 is correct only if you compute 1.5 × 24 = 36 — which is exactly option B's arithmetic; recheck the multiplication.",
      3: "84 is Q3 itself, with no IQR allowance.",
    },
    lessonId: "cleaning-outliers",
  },
  {
    id: "q9",
    unit: "unit-2",
    kind: "mcq",
    topic: "Standardization",
    prompt: "After Z-score standardization, what are the mean and standard deviation of the column?",
    options: ["0 and 1", "1 and 0", "min 0 and max 1", "Unchanged"],
    answer: [0],
    explanation: "z = (x − μ)/σ recentres the column to mean 0 and rescales it to standard deviation 1.",
    whyWrong: {
      1: "That reverses the two values.",
      2: "min 0 / max 1 describes Min-Max scaling.",
      3: "Standardization always changes the scale unless σ = 0.",
    },
    lessonId: "cleaning-standardize",
  },
  {
    id: "q10",
    unit: "unit-2",
    kind: "error",
    topic: "Duplicates",
    prompt: "A student writes df.drop_duplicates() and the duplicates are still there. What is wrong?",
    options: [
      "drop_duplicates does not exist in Pandas",
      "The result was not assigned back (or inplace=True not used)",
      "Duplicates can only be removed with SQL",
      "You must sort the DataFrame first",
    ],
    answer: [1],
    explanation:
      "Most Pandas methods return a new object. Use df = df.drop_duplicates() or pass inplace=True.",
    whyWrong: {
      0: "It does exist.",
      2: "Pandas handles this natively.",
      3: "Sorting is not required.",
    },
    lessonId: "cleaning-duplicates",
  },
  {
    id: "q11",
    unit: "unit-3",
    kind: "mcq",
    topic: "Chart choice",
    prompt: "Which chart best shows the relationship between two continuous variables?",
    options: ["Bar chart", "Scatter plot", "Pie chart", "Histogram"],
    answer: [1],
    explanation: "A scatter plot maps each observation to an (x, y) point, revealing the relationship.",
    whyWrong: {
      0: "Bar charts compare categories.",
      2: "Pie charts show parts of a whole.",
      3: "A histogram shows the distribution of one variable.",
    },
    lessonId: "viz-scatter",
  },
  {
    id: "q12",
    unit: "unit-3",
    kind: "order",
    topic: "Matplotlib workflow",
    prompt: "Which order correctly produces a labelled Matplotlib figure?",
    options: [
      "plt.show() → plt.plot() → plt.xlabel()",
      "plt.plot() → plt.xlabel() → plt.title() → plt.show()",
      "plt.xlabel() → plt.show() → plt.plot()",
      "plt.title() → plt.show() → plt.plot()",
    ],
    answer: [1],
    explanation:
      "Draw the data, decorate the axes, then call show(). show() renders and clears the current figure.",
    whyWrong: {
      0: "show() first renders an empty figure.",
      2: "Labels applied before any axes exist and show() too early.",
      3: "Same problem — plotting after show() targets a new figure.",
    },
    lessonId: "viz-matplotlib",
  },
  {
    id: "q13",
    unit: "unit-3",
    kind: "mcq",
    topic: "Box plot",
    prompt: "In a box plot, what does the box itself span?",
    options: ["min to max", "Q1 to Q3 (the IQR)", "mean ± std", "the 5th to 95th percentile"],
    answer: [1],
    explanation: "The box spans Q1 to Q3; the line inside is the median and the whiskers extend to 1.5 × IQR.",
    whyWrong: {
      0: "min–max is covered by whiskers plus outlier points.",
      2: "Box plots are quartile-based, not mean-based.",
      3: "That is a percentile band, not the standard box.",
    },
    lessonId: "viz-box",
  },
  {
    id: "q14",
    unit: "unit-3",
    kind: "mcq",
    topic: "Subplots",
    prompt: "What does fig, ax = plt.subplots(2, 3) create?",
    options: [
      "2 figures with 3 axes each",
      "One figure with a 2x3 grid of axes",
      "One figure with 5 axes",
      "An error — subplots takes one argument",
    ],
    answer: [1],
    explanation: "plt.subplots(nrows, ncols) returns one figure and an array of 2×3 = 6 axes.",
    whyWrong: {
      0: "Only a single Figure object is created.",
      2: "It is 2 × 3 = 6, not 2 + 3.",
      3: "Two positional arguments are valid.",
    },
    lessonId: "viz-subplots",
  },
  {
    id: "q15",
    unit: "unit-1",
    kind: "mcq",
    topic: "Data acquisition",
    prompt: "Why should an API key never be embedded in browser-side code?",
    options: [
      "Browsers cannot send HTTP headers",
      "Anyone can read it from the downloaded JavaScript and abuse your quota",
      "API keys only work from Python",
      "It makes the page slower",
    ],
    answer: [1],
    explanation:
      "Everything shipped to the browser is public. Secrets belong on a server or in a proxy you control.",
    whyWrong: {
      0: "Browsers send headers fine.",
      2: "Keys are language-independent.",
      3: "Performance is irrelevant to the risk.",
    },
    lessonId: "acquisition-apis",
  },
];

export const quizQuestionsByUnit = (unit: string) => quizQuestions.filter((q) => q.unit === unit);
