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
    options: ["96", "120", "108", "84"],
    answer: [1],
    explanation: "IQR = 84 − 60 = 24, so the upper bound is Q3 + 1.5 × IQR = 84 + 36 = 120.",
    whyWrong: {
      0: "96 uses 0.5 × IQR instead of 1.5 × IQR.",
      2: "108 comes from 1.0 × IQR added to Q3.",
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
  {
    id: "q16",
    unit: "unit-1",
    kind: "mcq",
    topic: "NumPy copying",
    prompt:
      "An analyst wants to modify a sales array while keeping the original unchanged. Which approach guarantees the original array is unaffected?",
    code: "sales = np.array([52000, 48000, 61000])",
    options: [
      "backup = sales (assignment operator)",
      "backup = np.copy(sales)",
      "backup = sales.view()",
      "backup = np.empty_like(sales)",
    ],
    answer: [1],
    explanation:
      "np.copy() creates an independent deep copy — modifying it never touches the original. Assignment and view() both share the same underlying data.",
    whyWrong: {
      0: "Assignment only creates a new reference to the same array — changes affect both names.",
      2: "A view shares memory with the original; writes propagate back.",
      3: "np.empty_like() allocates an uninitialised array of the same shape — it does not copy the values.",
    },
    lessonId: "numpy-copy",
  },
  {
    id: "q17",
    unit: "unit-1",
    kind: "mcq",
    topic: "Identity matrices",
    prompt:
      "For a 4-component mixture simulation you need a 4×4 identity matrix. Which statement about np.eye() and np.identity() is TRUE?",
    options: [
      "np.identity(4) can place the ones on any diagonal; np.eye(4) cannot",
      "np.eye(4) allows an offset diagonal via k=, while np.identity(4) always builds a square identity matrix",
      "np.eye() returns a list, np.identity() returns an ndarray",
      "They cannot produce the same matrix",
    ],
    answer: [1],
    explanation:
      "np.eye(N, M=None, k=0) is the general version — it supports rectangular shapes and a shifted diagonal via k. np.identity(n) is a shortcut restricted to square matrices with the main diagonal.",
    whyWrong: {
      0: "It is the other way round — eye() has the k offset parameter.",
      2: "Both return ndarrays.",
      3: "np.eye(4) and np.identity(4) produce identical 4×4 identity matrices.",
    },
    lessonId: "numpy-creating",
  },
  {
    id: "q18",
    unit: "unit-1",
    kind: "output",
    topic: "Reshaping and aggregation",
    prompt: "A teacher stores 40 marks in a 1D array. What does the code below print?",
    code: "marks = np.arange(1, 41)\ngrid = marks.reshape(8, 5)\nprint(grid.shape, grid[0].size)",
    options: ["(8, 5) 5", "(5, 8) 8", "(8, 5) 40", "Error — 40 elements cannot fill (8, 5)"],
    answer: [0],
    explanation:
      "reshape(8, 5) needs 8 × 5 = 40 elements — exactly what we have. grid[0] is the first row with 5 marks.",
    whyWrong: {
      1: "The shape tuple is used in the given order: 8 rows, 5 columns.",
      2: "grid[0].size counts one row (5), not the whole array (40).",
      3: "8 × 5 = 40 matches the element count, so reshape succeeds.",
    },
    lessonId: "numpy-copy",
  },
  {
    id: "q19",
    unit: "unit-1",
    kind: "mcq",
    topic: "Conditional filtering and sorting",
    prompt:
      "Monthly sales are stored in a NumPy array. Which snippet extracts values greater than ₹50,000 and sorts the array in DESCENDING order?",
    options: [
      "sales[sales > 50000] and np.sort(sales)[::-1]",
      "sales.filter(> 50000) and sales.sort_desc()",
      "np.where(sales) and np.sort(sales)",
      "sales > 50000 and reversed(sales)",
    ],
    answer: [0],
    explanation:
      "Boolean masking (sales[sales > 50000]) selects matching values; np.sort() is ascending, so [::-1] reverses it to descending.",
    whyWrong: {
      1: "NumPy arrays have no .filter() or .sort_desc() methods.",
      2: "np.where(sales) returns indices of non-zero values, not a filtered array.",
      3: "sales > 50000 alone returns a Boolean mask, and reversed() doesn't sort.",
    },
    lessonId: "numpy-indexing",
  },
  {
    id: "q20",
    unit: "unit-1",
    kind: "mcq",
    topic: "DataFrame filtering",
    prompt:
      "An employee DataFrame has columns Employee_ID, Department, Salary, Years_of_Experience. How do you show only employees with more than 5 years of experience?",
    options: [
      'df[df["Years_of_Experience"] > 5]',
      'df.filter("Years_of_Experience > 5")',
      'df.loc["Years_of_Experience" > 5]',
      'df.query(Years_of_Experience > 5)',
    ],
    answer: [0],
    explanation:
      "Boolean indexing with a condition on the column is the standard idiom. (df.query('Years_of_Experience > 5') also works — but the expression must be a string.)",
    whyWrong: {
      1: ".filter() selects rows/columns by label name, not by condition.",
      2: "That compares the string literal to 5 — not the column.",
      3: "query() needs the condition as a quoted string.",
    },
    lessonId: "pandas-dataframe",
  },
  {
    id: "q21",
    unit: "unit-2",
    kind: "mcq",
    topic: "Cleaning + aggregation",
    prompt:
      "You must remove rows with missing Salary values, then compute the average salary per department. Which pair of statements does this?",
    options: [
      'df.dropna(subset=["Salary"]) then df.groupby("Department")["Salary"].mean()',
      'df.fillna("Salary") then df.mean("Department")',
      'df.dropna(axis=1) then df.agg("Salary").groupby()',
      'df.drop("Salary") then df.pivot("Department")',
    ],
    answer: [0],
    explanation:
      "dropna(subset=['Salary']) removes only rows where Salary is NaN; groupby('Department')['Salary'].mean() gives per-department averages.",
    whyWrong: {
      1: "fillna replaces missing values (and needs a fill value), it doesn't drop rows; df.mean() doesn't take a group column.",
      2: "dropna(axis=1) drops whole COLUMNS containing any NaN.",
      3: "df.drop('Salary') deletes the column entirely.",
    },
    lessonId: "cleaning-missing",
  },
  {
    id: "q22",
    unit: "unit-2",
    kind: "mcq",
    topic: "GroupBy and ranking",
    prompt:
      "A university DataFrame has Student_Name, Course, Marks. Which snippet computes the average marks for each Course?",
    options: [
      'df.groupby("Course")["Marks"].mean()',
      'df.mean().groupby("Course")',
      'df["Course"].mean("Marks")',
      'df.rank("Course", "Marks")',
    ],
    answer: [0],
    explanation:
      "groupby('Course') partitions the rows, then ['Marks'].mean() averages within each group — the split-apply-combine pattern.",
    whyWrong: {
      1: "df.mean() aggregates first, leaving nothing to group.",
      2: "A Series has no mean(column) signature.",
      3: "rank() assigns per-row ranks; it does not aggregate.",
    },
    lessonId: "pandas-summary",
  },
  {
    id: "q23",
    unit: "unit-2",
    kind: "mcq",
    topic: "Combining datasets",
    prompt: "Which method fills missing values in one DataFrame using values from another, matched by index?",
    options: ["combine_first()", "merge(how='inner')", "concat(axis=0)", "join(how='left')"],
    answer: [0],
    explanation:
      "df1.combine_first(df2) patches the holes in df1 with corresponding values from df2 — designed exactly for overlap-filling.",
    whyWrong: {
      1: "An inner merge keeps only matching keys; it doesn't patch NaNs.",
      2: "concat stacks rows — overlapping values are duplicated, not merged.",
      3: "join attaches columns; existing NaNs in df1 remain NaN.",
    },
    lessonId: "wrangling-merge",
  },
  {
    id: "q24",
    unit: "unit-2",
    kind: "output",
    topic: "String manipulation",
    prompt: "What is printed?",
    code: 'text = " apple,banana,grape "\nfruits = text.strip().split(",")\nprint("-".join(fruits))',
    options: [
      "apple-banana-grape",
      " apple-banana-grape ",
      "['apple', 'banana', 'grape']",
      "apple,banana,grape",
    ],
    answer: [0],
    explanation:
      "strip() removes the outer spaces, split(',') produces ['apple','banana','grape'], and '-'.join() glues them with hyphens.",
    whyWrong: {
      1: "strip() already removed the leading/trailing spaces.",
      2: "That's what print(fruits) would show — join() returns a single string.",
      3: "join uses the separator it is called on ('-'), not the original commas.",
    },
    lessonId: "string-manipulation",
  },
  {
    id: "q25",
    unit: "unit-2",
    kind: "multi",
    topic: "Data cleansing",
    prompt:
      "A healthcare dataset has missing Treatment Cost values, ages like 180 years, and duplicate entries. Select ALL appropriate cleansing steps.",
    options: [
      "Impute missing Treatment Cost with the column median",
      "Apply a sanity check (e.g. 0 < Age < 120) and flag violations for review",
      "Remove duplicate rows with drop_duplicates()",
      "Delete the entire Age column because it has some bad values",
    ],
    answer: [0, 1, 2],
    explanation:
      "Median imputation is robust to skew, range checks catch impossible ages, and drop_duplicates() removes repeated records. Deleting a whole column throws away good data with the bad.",
    whyWrong: {
      3: "One bad value doesn't justify losing the variable — fix or flag the invalid entries instead.",
    },
    lessonId: "cleaning-missing",
  },
  {
    id: "q26",
    unit: "unit-3",
    kind: "mcq",
    topic: "Annotations",
    prompt: "In plt.annotate('Peak', xy=(3, 5), xytext=(4, 6), arrowprops=dict(arrowstyle='->')), what does xy specify?",
    options: [
      "The position of the annotation text",
      "The data point being annotated (where the arrow points)",
      "The size of the annotation in points",
      "The offset between text and arrow",
    ],
    answer: [1],
    explanation:
      "xy is the point being annotated — the arrow tip. xytext is where the text is placed; the arrow is drawn from the text toward xy.",
    whyWrong: {
      0: "That is xytext, not xy.",
      2: "Neither parameter controls size.",
      3: "There is no offset parameter here — the two coordinates define both ends.",
    },
    lessonId: "viz-annotations",
  },
  {
    id: "q27",
    unit: "unit-3",
    kind: "mcq",
    topic: "Legends",
    prompt: "You called ax.plot(x, y) twice and then ax.legend(), but the legend is empty. What is the most likely cause?",
    options: [
      "legend() must be called before plot()",
      "Neither plot() call passed a label= argument",
      "Legends only work with scatter plots",
      "The figure has no grid enabled",
    ],
    answer: [1],
    explanation:
      "legend() collects the label= text from each plotted series. With no labels, there is nothing to show — pass label='...' to each plot() call (or pass a list of labels to legend()).",
    whyWrong: {
      0: "Order doesn't matter as long as legend() comes after the plots exist.",
      2: "Legends work with every plot type.",
      3: "Grids and legends are independent.",
    },
    lessonId: "viz-annotations",
  },
  {
    id: "q28",
    unit: "unit-3",
    kind: "mcq",
    topic: "Seaborn",
    prompt: "Which Seaborn call turns a correlation matrix into a colour-coded grid with the values printed in each cell?",
    options: [
      "sns.heatmap(df.corr(), annot=True)",
      "sns.pairplot(df.corr())",
      "sns.boxplot(data=df.corr())",
      "sns.scatterplot(df.corr(), grid=True)",
    ],
    answer: [0],
    explanation:
      "heatmap() maps matrix values to colours; annot=True prints each value inside its cell — the standard one-liner for correlation matrices.",
    whyWrong: {
      1: "pairplot draws pairwise scatter plots from raw data, not from a matrix.",
      2: "boxplot shows distributions, not a matrix.",
      3: "scatterplot plots points and has no grid= argument.",
    },
    lessonId: "viz-seaborn",
  },
  {
    id: "q29",
    unit: "unit-3",
    kind: "mcq",
    topic: "3D plots",
    prompt: "What is required before calling ax.plot_surface(X, Y, Z) for a surface plot?",
    options: [
      "X and Y must be built with np.meshgrid so all three arrays are 2D grids",
      "Z must be a 1D sorted array",
      "The figure must use plt.subplot(2, 2, 1)",
      "seaborn must be imported first",
    ],
    answer: [0],
    explanation:
      "plot_surface needs 2D coordinate grids: np.meshgrid expands the x and y vectors into matrices, and Z is computed element-wise over them. The axes also need projection='3d'.",
    whyWrong: {
      1: "Z must be 2D, matching the meshgrid shape.",
      2: "Any axes created with projection='3d' works.",
      3: "mplot3d is part of Matplotlib — Seaborn is not involved.",
    },
    lessonId: "viz-3d",
  },
];

export const quizQuestionsByUnit = (unit: string) => quizQuestions.filter((q) => q.unit === unit);
