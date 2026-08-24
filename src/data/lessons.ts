export interface Lesson {
  id: string;
  unit: "unit-1" | "unit-2" | "unit-3";
  group: string;
  title: string;
  concept: string;
  why: string;
  example: string;
  demo?: "array-grid" | "dataframe-table" | "lifecycle" | "merge-simulator" | "outlier-slider" | "standardize" | "api-simulator" | "chart-preview";
  tryIt: string;
  mistakes: string[];
  takeaway: string;
  experimentId?: string;
}

export const lessons: Lesson[] = [
  {
    id: "intro-ds",
    unit: "unit-1",
    group: "Introduction to Data Science",
    title: "What is Data Science?",
    concept:
      "Data science is the practice of turning raw data into decisions using statistics, programming and domain knowledge. It is a process, not a single algorithm.",
    why: "Universities, hospitals, banks and shops all generate more data than people can read. Data science is how that data becomes an action — mentoring a student, approving a loan, restocking a shelf.",
    example:
      "Our running example is a Student Performance dataset with Study_Hours, Attendance, Previous_Marks, Assignment_Score and Final_Score. Every unit of this course reuses it, so you always know what the numbers mean.",
    demo: "lifecycle",
    tryIt: `import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Final_Score": [65, 84, 72, 91],
})

print(df)
print("\\nWhat question could this data answer?")
print("Correlation of study hours with final score:",
      round(df["Study_Hours"].corr(df["Final_Score"]), 3))
`,
    mistakes: [
      "Treating data science as 'just machine learning' and skipping the problem definition",
      "Believing a bigger dataset automatically means a better answer",
      "Reporting numbers without a recommendation",
    ],
    takeaway:
      "Data science = question → data → cleaning → exploration → analysis → communication. The algorithm is only one step.",
  },
  {
    id: "facets",
    unit: "unit-1",
    group: "Introduction to Data Science",
    title: "Facets of Data",
    concept:
      "Data appears in several forms: structured, unstructured, natural language, machine-generated, graph-based and streaming. Each form needs different tools.",
    why: "Recognising the facet tells you which tool to reach for. A CSV goes to Pandas; feedback text needs NLP; click logs need aggregation before they become a table.",
    example:
      "The marks spreadsheet is structured. Student feedback comments are natural language. LMS click logs are machine-generated. The study-group network is graph data.",
    tryIt: `facets = {
    "Structured": "marks.csv — fixed rows and columns",
    "Unstructured": "answer sheet scans",
    "Natural language": "course feedback comments",
    "Machine-generated": "LMS click logs",
    "Graph-based": "study group network",
    "Streaming": "live attendance scans",
}

for facet, example in facets.items():
    print(f"{facet:20} -> {example}")
`,
    mistakes: [
      "Forcing unstructured data into a spreadsheet without extraction",
      "Ignoring the volume implications of machine-generated data",
    ],
    takeaway: "Identify the facet before choosing the tool.",
  },
  {
    id: "ds-process",
    unit: "unit-1",
    group: "Introduction to Data Science",
    title: "The Data Science Process",
    concept:
      "A repeatable nine-stage lifecycle: Problem → Data Collection → Data Understanding → Cleaning → Exploration → Feature Preparation → Analysis → Visualization → Insights.",
    why: "The process makes work reproducible and auditable, and it prevents the most common failure: a beautiful model built on the wrong question or dirty data.",
    example:
      "For the student dataset: ask which factors explain Final_Score, pull marks and attendance, profile them, clean names and impossible scores, plot relationships, add a Performance band, compare groups, chart the result and recommend early mentoring.",
    demo: "lifecycle",
    tryIt: `stages = ["Problem", "Data Collection", "Data Understanding", "Cleaning",
          "Exploration", "Feature Preparation", "Analysis", "Visualization", "Insights"]

for i, stage in enumerate(stages, start=1):
    print(f"{i}. {stage}")

print("\\nCleaning typically consumes 60-80% of project time.")
`,
    mistakes: [
      "Skipping data understanding and cleaning",
      "Treating the process as strictly linear — you will loop back often",
    ],
    takeaway: "Follow the lifecycle; iterate rather than rush forward.",
  },
  {
    id: "numpy-creating",
    unit: "unit-1",
    group: "NumPy",
    title: "NumPy Arrays: Creating and Inspecting",
    concept:
      "NumPy's ndarray stores same-typed values contiguously, which enables fast vectorised maths. Arrays are created from lists or with generators like zeros, arange and linspace.",
    why: "Pandas, scikit-learn, Matplotlib and almost every scientific library are built on NumPy arrays. Speed and memory efficiency come from this single data structure.",
    example:
      "Four students' study hours become np.array([4, 7, 5, 9]); a 3×3 block of marks becomes a 2D array whose shape is (3, 3).",
    demo: "array-grid",
    tryIt: `import numpy as np

arr = np.array([[10, 20, 30],
                [40, 50, 60],
                [70, 80, 90]])

print("Array:")
print(arr)
print("\\nShape:", arr.shape)
print("Dimensions:", arr.ndim)
print("Data type:", arr.dtype)
print("\\nSecond row:", arr[1])
`,
    mistakes: [
      "Mixing types in one array and losing performance to dtype=object",
      "Confusing shape (dimensions) with size (element count)",
    ],
    takeaway: "One array, one dtype, one contiguous block — that is where the speed comes from.",
    experimentId: "numpy-create",
  },
  {
    id: "numpy-indexing",
    unit: "unit-1",
    group: "NumPy",
    title: "Indexing, Slicing and Iterating",
    concept:
      "Elements are addressed as arr[row, column] with 0-based indices. Slices use start:stop:step where stop is excluded, and boolean masks select by condition.",
    why: "Nearly every data task starts by selecting the right subset. Getting indexing wrong silently produces the wrong analysis.",
    example: "arr[1, 2] is 60 in the 3×3 marks grid; arr[:, 0] takes the whole first column.",
    demo: "array-grid",
    tryIt: `import numpy as np

arr = np.array([[10, 20, 30],
                [40, 50, 60],
                [70, 80, 90]])

print("arr[1, 2] =", arr[1, 2])
print("arr[:, 1] =", arr[:, 1])
print("arr[0:2, 1:] =\\n", arr[0:2, 1:])
print("values > 45:", arr[arr > 45])

for row in arr:
    print("row:", row, "sum:", row.sum())
`,
    mistakes: [
      "Expecting the stop index to be included",
      "Forgetting that a slice is a view — editing it edits the original",
    ],
    takeaway: "Rows first, 0-based, stop excluded, masks return flat arrays.",
    experimentId: "numpy-indexing",
  },
  {
    id: "numpy-copy",
    unit: "unit-1",
    group: "NumPy",
    title: "Views, Copies and Shape Manipulation",
    concept:
      "Basic slicing returns a view onto the same memory; .copy() creates an independent array. reshape reinterprets the same buffer, so the element count must stay constant.",
    why: "Views make NumPy fast and memory-light, but they cause surprising bugs when you modify what you thought was a separate array.",
    example: "sub = arr[0:2]; sub[0, 0] = 999 also changes arr — unless you wrote arr[0:2].copy().",
    demo: "array-grid",
    tryIt: `import numpy as np

arr = np.arange(12)
view = arr[0:4]
copy = arr[0:4].copy()

view[0] = 999
copy[1] = -1

print("arr after editing the view:", arr[:4])
print("copy is independent:", copy)
print("\\nreshape(3,4):\\n", arr.reshape(3, 4))
print("identity:\\n", np.eye(3))
`,
    mistakes: ["Assuming a slice is a copy", "Reshaping to a shape whose element count does not match"],
    takeaway: "Slice = view, .copy() = independent, reshape preserves the element count.",
    experimentId: "numpy-shape",
  },
  {
    id: "pandas-series",
    unit: "unit-1",
    group: "Pandas",
    title: "Series: Labelled 1D Data",
    concept:
      "A Series pairs an array of values with an index of labels, enabling label lookup and automatic alignment during arithmetic.",
    why: "Every DataFrame column is a Series. Understanding alignment explains most 'unexpected NaN' problems beginners hit.",
    example: "scores['Bala'] returns 84 without knowing that Bala sits at position 1.",
    demo: "dataframe-table",
    tryIt: `import pandas as pd

scores = pd.Series([65, 84, 72, 91], index=["Arun", "Bala", "Charan", "Divya"])
print(scores)
print("\\nMean:", scores.mean())
print("Above average:\\n", scores[scores > scores.mean()])
`,
    mistakes: ["Mixing label and position indexing", "Ignoring NaNs produced by alignment"],
    takeaway: "A Series is values + index; the index is what makes Pandas powerful.",
    experimentId: "pandas-series",
  },
  {
    id: "pandas-dataframe",
    unit: "unit-1",
    group: "Pandas",
    title: "DataFrames: The Tabular Workhorse",
    concept:
      "A DataFrame is a set of Series sharing a common index — a table where each column has its own dtype.",
    why: "A marks spreadsheet, a sales export, a survey extract: almost all real analysis starts as a DataFrame.",
    example:
      "The student marks spreadsheet becomes a DataFrame; df.describe() instantly gives the class statistics.",
    demo: "dataframe-table",
    tryIt: `import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Score": [65, 84, 72, 91],
})

df["Performance"] = df["Score"].apply(
    lambda x: "Good" if x >= 75 else "Needs Improvement"
)

print(df)
print("\\nSummary Statistics:")
print(df.describe())
`,
    mistakes: [
      "Chained assignment like df[df.a > 1]['b'] = 0 (use .loc)",
      "Forgetting that most methods return a copy",
    ],
    takeaway: "DataFrame = dictionary of aligned Series; use .loc for assignment.",
    experimentId: "pandas-dataframe",
  },
  {
    id: "pandas-summary",
    unit: "unit-1",
    group: "Pandas",
    title: "Sorting, Ranking and Summary Statistics",
    concept:
      "sort_values orders rows, rank scores them, and describe/mean/median/std summarise them. groupby splits data before aggregating.",
    why: "Ranking and summarising are the fastest route from a table to an answer, long before any model is needed.",
    example: "Ranking students by Final_Score identifies the top and bottom quartile for mentoring.",
    demo: "dataframe-table",
    tryIt: `import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Score": [65, 84, 72, 91],
})

df["Rank"] = df["Score"].rank(ascending=False, method="min").astype(int)
print(df.sort_values("Rank"))
print("\\nMean:", df["Score"].mean(), "| Median:", df["Score"].median(),
      "| Std:", round(df["Score"].std(), 2))
`,
    mistakes: ["Not reassigning the sorted frame", "Reading mean without checking the spread"],
    takeaway: "Summarise and rank before modelling — often it is already the answer.",
    experimentId: "pandas-rank-sort",
  },
  {
    id: "acquisition-apis",
    unit: "unit-1",
    group: "Data Acquisition",
    title: "Data Acquisition: APIs, Open Data and Scraping",
    concept:
      "Data arrives from files, web APIs (usually JSON), open data portals and — as a last resort — scraping HTML pages.",
    why: "Choosing a legal, stable and documented source saves weeks of maintenance compared to scraping a page that changes weekly.",
    example: "An API returns {\"student\": \"Arun\", \"attendance\": 85, \"score\": 78} → dict → DataFrame → analysis.",
    demo: "api-simulator",
    tryIt: `import json
import pandas as pd

payload = '{"student": "Arun", "attendance": 85, "score": 78}'
record = json.loads(payload)
print("Python dict:", record)

df = pd.DataFrame([record])
print("\\nDataFrame:\\n", df)
`,
    mistakes: [
      "Embedding API keys in browser code — anyone can read them",
      "Scraping without checking the terms of use or robots.txt",
      "Assuming any public URL can be fetched from a browser (CORS blocks most)",
    ],
    takeaway:
      "Prefer documented APIs and open data. In a browser-only lab, use sample JSON, local uploads or CORS-enabled endpoints.",
    experimentId: "acquisition-api",
  },
  {
    id: "handling-large",
    unit: "unit-2",
    group: "Data Handling",
    title: "Handling Large Volumes of Data",
    concept:
      "Large datasets break naive code: memory exhaustion, slow loops and long load times. Fixes include chunking, selecting only needed columns, efficient dtypes, vectorisation and columnar formats.",
    why: "A million-row CSV loaded carelessly can use gigabytes of RAM; the same data with category and int32 dtypes may fit in a fraction of that.",
    example:
      "Read 1,000,000 rows in 100,000-row chunks, keep 5 of 40 columns, downcast floats, and aggregate per chunk.",
    tryIt: `import pandas as pd
import numpy as np

rng = np.random.default_rng(0)
big = pd.DataFrame({
    "section": rng.choice(["A", "B", "C"], 50_000),
    "score": rng.integers(0, 100, 50_000).astype("int64"),
})

before = big.memory_usage(deep=True).sum() / 1024

big["section"] = big["section"].astype("category")
big["score"] = pd.to_numeric(big["score"], downcast="unsigned")

after = big.memory_usage(deep=True).sum() / 1024
print(f"Memory before: {before:,.0f} KB")
print(f"Memory after : {after:,.0f} KB")
print(f"Reduction    : {100 * (1 - after / before):.1f}%")
`,
    mistakes: [
      "Looping row by row with iterrows instead of vectorising",
      "Loading every column when you need five",
      "Repeatedly appending to a DataFrame inside a loop",
    ],
    takeaway: "Read less, store smaller, vectorise more — in that order.",
  },
  {
    id: "wrangling-merge",
    unit: "unit-2",
    group: "Data Wrangling",
    title: "Merging, Concatenating and Reshaping",
    concept:
      "merge combines tables on a key (inner/left/right/outer), concat stacks them along an axis, and melt/pivot switch between long and wide layouts.",
    why: "Real data lives in several tables — attendance in one system, marks in another. Joining them correctly is the difference between 3 rows and 4.",
    example: "students (IDs 1,2,3) left-joined to scores (IDs 1,2,4) keeps 3 rows and leaves Charan's score NaN.",
    demo: "merge-simulator",
    tryIt: `import pandas as pd

students = pd.DataFrame({"Student_ID": [1, 2, 3], "Name": ["Arun", "Bala", "Charan"]})
scores = pd.DataFrame({"Student_ID": [1, 2, 4], "Score": [78, 92, 85]})

result = pd.merge(students, scores, on="Student_ID", how="left")
print(result)
print("\\nRows kept:", len(result))
`,
    mistakes: [
      "Not checking row counts before and after a merge",
      "Joining on a key with inconsistent text or type",
      "Using concat when you meant merge",
    ],
    takeaway: "Pick the join type deliberately, then verify the row count.",
    experimentId: "wrangling-merge",
  },
  {
    id: "cleaning-missing",
    unit: "unit-2",
    group: "Data Cleaning",
    title: "Missing Data, Duplicates and Dirty Text",
    concept:
      "Cleaning means detecting and fixing missing values, duplicate rows, inconsistent capitalisation, stray whitespace, impossible values and mixed date formats.",
    why: "Every downstream statistic inherits the errors you leave behind. One duplicated student can shift a class average.",
    example:
      "'bala' with a null Hours value, 'CHARAN' with a Score of 999, and a repeated Arun row must all be handled before any analysis.",
    demo: "dataframe-table",
    tryIt: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Student": ["Arun", "bala", "CHARAN", "Arun", " divya "],
    "Hours": [5, np.nan, 6, 5, 9],
    "Score": [75, 82, 999, 75, 88],
})

df["Student"] = df["Student"].str.strip().str.title()
df["Score"] = df["Score"].replace(999, np.nan)
df["Hours"] = df["Hours"].fillna(df["Hours"].median())
df = df.drop_duplicates()

print(df)
print("\\nRemaining missing values:", int(df.isna().sum().sum()))
`,
    mistakes: [
      "Filling every missing value with 0",
      "Dropping rows before measuring how many you lose",
      "Cleaning text after joining instead of before",
    ],
    takeaway: "Measure the damage first, then choose a documented fix for each issue.",
    experimentId: "cleaning-missing",
  },
  {
    id: "cleaning-outliers",
    unit: "unit-2",
    group: "Data Cleaning",
    title: "Outliers, Noise and Anomalies",
    concept:
      "An outlier sits far from the bulk of the data. The IQR rule flags points outside Q1 − 1.5·IQR and Q3 + 1.5·IQR. Noise is random jitter; an anomaly is a meaningful rare event.",
    why: "Outliers distort means, standard deviations and regression lines — but some outliers are the most interesting data you have.",
    example: "A Score of 999 is a data-entry error. A student scoring 97 with 12 study hours is genuine and must stay.",
    demo: "outlier-slider",
    tryIt: `import pandas as pd

scores = pd.Series([65, 84, 72, 91, 58, 77, 86, 49, 95, 68, 12, 130])
q1, q3 = scores.quantile([0.25, 0.75])
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr

print(f"Q1={q1}  Q3={q3}  IQR={iqr}")
print(f"Bounds: [{low}, {high}]")
print("Outliers:", list(scores[(scores < low) | (scores > high)]))
`,
    mistakes: [
      "Deleting outliers automatically",
      "Using the ±3σ rule on a skewed distribution",
      "Confusing noise with anomaly",
    ],
    takeaway: "Detect, investigate, then decide: keep, cap or remove — and say which you did.",
    experimentId: "cleaning-outliers",
  },
  {
    id: "cleaning-standardize",
    unit: "unit-2",
    group: "Data Cleaning",
    title: "Binning and Standardization",
    concept:
      "Binning converts a continuous variable into categories (cut for fixed edges, qcut for equal counts). Scaling puts variables on a comparable scale: Min-Max to [0,1] or Z-score to mean 0, std 1.",
    why: "Distance-based algorithms are dominated by whichever feature has the largest range. Attendance (0–100) would drown Study_Hours (0–12) without scaling.",
    example: "Study_Hours 4 becomes 0.11 under Min-Max and −0.71 under Z-score for our five-student sample.",
    demo: "standardize",
    tryIt: `import pandas as pd

x = pd.Series([4, 7, 5, 9, 3], name="Study_Hours")

minmax = (x - x.min()) / (x.max() - x.min())
z = (x - x.mean()) / x.std()

print(pd.DataFrame({"Original": x, "MinMax": minmax.round(3), "ZScore": z.round(3)}))
print("\\nBands:\\n", pd.cut(x, bins=[0, 4, 8, 12], labels=["Low", "Medium", "High"]))
`,
    mistakes: [
      "Scaling with statistics from the test set (leakage)",
      "Scaling categorical codes",
      "Binning so coarsely that all signal disappears",
    ],
    takeaway: "Min-Max bounds the range, Z-score centres the distribution; bin only when interpretability matters more than precision.",
    experimentId: "cleaning-standardize",
  },
  {
    id: "viz-matplotlib",
    unit: "unit-3",
    group: "Visualization",
    title: "Matplotlib Fundamentals",
    concept:
      "A Matplotlib Figure contains one or more Axes. You draw on the Axes, decorate with labels, ticks, legends and annotations, then show or save the Figure.",
    why: "Matplotlib is the base layer of Python plotting; Pandas and Seaborn both call into it, so knowing the object model lets you fix any chart.",
    example: "fig, ax = plt.subplots() then ax.plot(...) gives you explicit control over every element.",
    demo: "chart-preview",
    tryIt: `import matplotlib.pyplot as plt

weeks = [1, 2, 3, 4, 5, 6]
average = [58, 62, 65, 69, 72, 76]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(weeks, average, marker="o", color="#2563eb", linewidth=2)
ax.set_xlabel("Week")
ax.set_ylabel("Class average")
ax.set_title("Class Average Over Time")
ax.grid(True, alpha=0.3)
plt.show()
`,
    mistakes: ["Calling plt.show() before drawing", "Leaving axes unlabelled", "Overlapping labels — use tight_layout()"],
    takeaway: "Figure → Axes → plot → decorate → show. Learn the object model, not just the shortcuts.",
    experimentId: "viz-line",
  },
  {
    id: "viz-scatter",
    unit: "unit-3",
    group: "Visualization",
    title: "Choosing the Right Chart",
    concept:
      "Relationship → scatter. Trend over time → line. Category comparison → bar. Distribution of one variable → histogram. Group comparison → box plot. Correlation matrix → heatmap.",
    why: "The wrong chart hides the finding or, worse, implies something false. Chart choice is an analytical decision, not decoration.",
    example: "Study_Hours vs Final_Score is a relationship between two continuous variables — a scatter plot, never a pie chart.",
    demo: "chart-preview",
    tryIt: `import matplotlib.pyplot as plt

hours = [4, 7, 5, 9, 3, 6, 8, 2, 10, 5]
score = [65, 84, 72, 91, 58, 77, 86, 49, 95, 68]

plt.scatter(hours, score, color="#2563eb")
plt.xlabel("Study Hours")
plt.ylabel("Score")
plt.title("Study Hours vs Score")
plt.grid(alpha=0.25)
plt.show()
`,
    mistakes: ["Pie charts with many slices", "Truncated axes on bar charts", "3D effects that add no information"],
    takeaway: "Match the chart to the question first; style it second.",
    experimentId: "viz-scatter",
  },
  {
    id: "viz-subplots",
    unit: "unit-3",
    group: "Visualization",
    title: "Subplots, Styling and Export",
    concept:
      "plt.subplots(nrows, ncols) builds a grid of Axes. Style sheets and rcParams set defaults globally, and savefig exports the result at report quality.",
    why: "Reports need multi-panel figures with consistent styling; doing it manually per chart is slow and inconsistent.",
    example: "A 2×2 grid showing line, scatter, bar and histogram views of the same student dataset.",
    demo: "chart-preview",
    tryIt: `import matplotlib.pyplot as plt

plt.style.use("seaborn-v0_8-whitegrid")
fig, ax = plt.subplots(1, 2, figsize=(9, 3.6))
ax[0].plot([1, 2, 3, 4], [58, 64, 70, 77], marker="o")
ax[0].set_title("Trend")
ax[1].bar(["Arun", "Bala", "Charan"], [65, 84, 72], color="#14b8a6")
ax[1].set_title("Comparison")
plt.tight_layout()
plt.show()
`,
    mistakes: ["Indexing a 2D axes array with a single number", "Forgetting tight_layout", "Exporting at screen DPI for print"],
    takeaway: "One figure, many axes; set the style once and export with dpi and bbox_inches.",
    experimentId: "viz-subplots",
  },
  {
    id: "viz-box",
    unit: "unit-3",
    group: "Visualization",
    title: "Distributions: Histograms and Box Plots",
    concept:
      "A histogram bins one variable to show its shape; a box plot compresses it to quartiles so several groups can be compared side by side.",
    why: "Means hide everything about shape. Two sections with identical averages can have completely different distributions.",
    example: "Three sections with similar means but very different spreads become obvious in one box plot.",
    demo: "chart-preview",
    tryIt: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(5)
a, b = rng.normal(72, 4, 50), rng.normal(72, 14, 50)

fig, ax = plt.subplots(1, 2, figsize=(9, 3.8))
ax[0].hist([a, b], bins=12, label=["Tight", "Spread"])
ax[0].legend(); ax[0].set_title("Histogram")
ax[1].boxplot([a, b], tick_labels=["Tight", "Spread"])
ax[1].set_title("Box plot — same means, different spread")
plt.tight_layout()
plt.show()
`,
    mistakes: ["Reporting only the mean", "Using too few bins", "Ignoring the outlier dots on a box plot"],
    takeaway: "Always look at the distribution, not just the average.",
    experimentId: "viz-box",
  },
];

export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const lessonsByUnit = (unit: string) => lessons.filter((l) => l.unit === unit);
