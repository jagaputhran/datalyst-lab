export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type WidgetKind =
  | "none"
  | "array-grid"
  | "dataframe-table"
  | "merge-simulator"
  | "outlier-slider"
  | "standardize"
  | "chart-preview"
  | "api-simulator";

export interface Experiment {
  id: string;
  number: number;
  unit: "unit-1" | "unit-2" | "unit-3";
  title: string;
  difficulty: Difficulty;
  minutes: number;
  tags: string[];
  objective: string;
  outcomes: string[];
  theory: string;
  steps: string[];
  code: string;
  widget: WidgetKind;
  observation: string;
  takeaways: string[];
  selfCheck: { question: string; options: string[]; answer: number; explanation: string };
}

const DF = `import pandas as pd

data = {
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Score": [65, 84, 72, 91],
}

df = pd.DataFrame(data)
`;

export const experiments: Experiment[] = [
  {
    id: "numpy-create",
    number: 1,
    unit: "unit-1",
    title: "Creating NumPy Arrays",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["NumPy", "Arrays"],
    objective: "Create 1D and 2D NumPy arrays from Python lists and with built-in generators.",
    outcomes: [
      "Convert a Python list into a NumPy array",
      "Use zeros, ones, arange, linspace and full",
      "Explain why arrays are faster than lists",
    ],
    theory:
      "A NumPy array (ndarray) stores elements of one dtype in a contiguous block of memory. That layout lets NumPy apply an operation to the whole block at once (vectorisation) instead of looping in Python, which is why array maths is 10–100x faster than list maths.",
    steps: [
      "Import NumPy with the conventional alias np",
      "Build a 1D array from a list of study hours",
      "Build a 2D array (matrix) from a list of lists",
      "Generate arrays with zeros, arange and linspace",
      "Print each array and its dtype",
    ],
    code: `import numpy as np

study_hours = np.array([4, 7, 5, 9])
print("1D array:", study_hours)
print("dtype:", study_hours.dtype)

marks = np.array([[10, 20, 30],
                  [40, 50, 60],
                  [70, 80, 90]])
print("\\n2D array:")
print(marks)

print("\\nzeros:", np.zeros((2, 3)))
print("arange:", np.arange(0, 10, 2))
print("linspace:", np.linspace(0, 1, 5))
`,
    widget: "array-grid",
    observation:
      "The 1D array prints without commas, the 2D array prints as a grid, and zeros defaults to float64 while the list-based arrays keep int64.",
    takeaways: [
      "np.array() converts lists; the nesting depth becomes the number of dimensions",
      "zeros/ones/full/arange/linspace generate arrays without writing values by hand",
      "One array = one dtype",
    ],
    selfCheck: {
      question: "What is the dtype of np.zeros((2,3)) by default?",
      options: ["int64", "float64", "object", "bool"],
      answer: 1,
      explanation: "NumPy generators default to float64 unless you pass dtype explicitly.",
    },
  },
  {
    id: "numpy-attributes",
    number: 2,
    unit: "unit-1",
    title: "Array Attributes and Operations",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["NumPy", "Attributes"],
    objective: "Inspect ndim, shape, size, dtype and itemsize, and apply element-wise operations.",
    outcomes: ["Read array metadata", "Apply vectorised arithmetic", "Use aggregation methods"],
    theory:
      "Every ndarray carries metadata: ndim (dimensions), shape (size per dimension), size (total elements), dtype and itemsize (bytes per element). Arithmetic between arrays is element-wise and broadcast when shapes are compatible.",
    steps: [
      "Create a 3x3 array of marks",
      "Print ndim, shape, size, dtype, itemsize",
      "Add 5 marks of grace to every element",
      "Compute row-wise and column-wise means",
    ],
    code: `import numpy as np

marks = np.array([[10, 20, 30],
                  [40, 50, 60],
                  [70, 80, 90]])

print("ndim:", marks.ndim)
print("shape:", marks.shape)
print("size:", marks.size)
print("dtype:", marks.dtype)
print("itemsize:", marks.itemsize, "bytes")

print("\\nAfter +5 grace marks:")
print(marks + 5)

print("\\nRow means:", marks.mean(axis=1))
print("Column means:", marks.mean(axis=0))
`,
    widget: "array-grid",
    observation:
      "axis=1 collapses the columns (giving one value per row) and axis=0 collapses the rows. Adding a scalar touches every element without a loop.",
    takeaways: [
      "shape is a tuple, size is a single number",
      "axis=0 works down the rows, axis=1 works across the columns",
      "Scalar arithmetic broadcasts to the whole array",
    ],
    selfCheck: {
      question: "marks.mean(axis=0) on a 3x3 array returns how many values?",
      options: ["1", "3", "9", "It errors"],
      answer: 1,
      explanation: "axis=0 aggregates down each of the 3 columns, giving 3 values.",
    },
  },
  {
    id: "numpy-indexing",
    number: 3,
    unit: "unit-1",
    title: "Indexing and Slicing",
    difficulty: "Beginner",
    minutes: 20,
    tags: ["NumPy", "Indexing"],
    objective: "Select elements, rows, columns and sub-blocks using indices, slices and boolean masks.",
    outcomes: ["Use arr[row, col]", "Slice with start:stop:step", "Filter with boolean masks"],
    theory:
      "NumPy indexing is 0-based and uses [row, column] for 2D arrays. Slices follow start:stop:step where stop is exclusive. A boolean array of the same shape can be used as a mask to select values that satisfy a condition.",
    steps: [
      "Index a single element",
      "Slice a row, a column and a 2x2 block",
      "Use a boolean mask to select marks above 50",
    ],
    code: `import numpy as np

marks = np.array([[10, 20, 30],
                  [40, 50, 60],
                  [70, 80, 90]])

print("marks[1, 2] =", marks[1, 2])
print("second row  =", marks[1])
print("first column=", marks[:, 0])
print("\\ntop-left 2x2 block:")
print(marks[0:2, 0:2])

mask = marks > 50
print("\\nmask:")
print(mask)
print("values > 50:", marks[mask])
`,
    widget: "array-grid",
    observation:
      "Clicking a cell in the visualiser shows the exact index expression. Note the slice stop value is never included.",
    takeaways: [
      "arr[row, col] — rows first, always 0-based",
      "start:stop:step excludes stop",
      "Boolean masks return a flat 1D array of matching values",
    ],
    selfCheck: {
      question: "What does marks[0:2, 0:2] return for the 3x3 array above?",
      options: ["[[10,20],[40,50]]", "[[10,20,30],[40,50,60]]", "[[50,60],[80,90]]", "10"],
      answer: 0,
      explanation: "Rows 0–1 and columns 0–1 form the top-left 2x2 block.",
    },
  },
  {
    id: "numpy-join-split",
    number: 4,
    unit: "unit-1",
    title: "Joining and Splitting Arrays",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["NumPy", "Reshaping"],
    objective: "Combine arrays with concatenate/stack and break them apart with split.",
    outcomes: ["Join along an axis", "Stack arrays into new dimensions", "Split into equal parts"],
    theory:
      "concatenate joins along an existing axis, while vstack/hstack are convenience wrappers for axis 0 and axis 1. split/array_split reverse the operation; array_split allows uneven parts.",
    steps: ["Create two small arrays", "Join with concatenate, vstack and hstack", "Split back into parts"],
    code: `import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

print("concatenate axis=0:\\n", np.concatenate((a, b), axis=0))
print("\\nconcatenate axis=1:\\n", np.concatenate((a, b), axis=1))
print("\\nvstack:\\n", np.vstack((a, b)))
print("\\nhstack:\\n", np.hstack((a, b)))

joined = np.arange(1, 13)
print("\\nsplit into 3:", np.split(joined, 3))
print("array_split into 5:", np.array_split(joined, 5))
`,
    widget: "none",
    observation:
      "concatenate requires matching sizes on every axis except the joining axis; array_split tolerates uneven divisions while split raises an error.",
    takeaways: [
      "axis=0 stacks vertically, axis=1 stacks horizontally",
      "split needs an equal division; array_split does not",
    ],
    selfCheck: {
      question: "np.split(np.arange(10), 3) will…",
      options: ["Return 3 equal arrays", "Raise a ValueError", "Return 4 arrays", "Return an empty list"],
      answer: 1,
      explanation: "10 is not divisible by 3 — use np.array_split for uneven splits.",
    },
  },
  {
    id: "numpy-search-sort",
    number: 5,
    unit: "unit-1",
    title: "Searching and Sorting",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["NumPy", "Search"],
    objective: "Locate values with where/searchsorted and order arrays with sort/argsort.",
    outcomes: ["Use np.where", "Use argsort to rank", "Sort along an axis"],
    theory:
      "np.where(condition) returns the indices where a condition is true and can also be used as a vectorised if/else. np.sort returns a sorted copy; np.argsort returns the indices that would sort the array — which is how ranking is implemented.",
    steps: ["Find indices of scores above 70", "Sort scores", "Get argsort order", "Vectorised if/else grading"],
    code: `import numpy as np

scores = np.array([65, 84, 72, 91, 58])

print("indices > 70:", np.where(scores > 70)[0])
print("sorted:", np.sort(scores))
print("argsort:", np.argsort(scores))
print("descending:", np.sort(scores)[::-1])

grades = np.where(scores >= 75, "Good", "Needs Improvement")
print("\\ngrades:", grades)
print("insert position for 80:", np.searchsorted(np.sort(scores), 80))
`,
    widget: "none",
    observation:
      "argsort gives positions, not values — scores[np.argsort(scores)] reproduces the sorted array.",
    takeaways: ["np.where doubles as a vectorised ternary", "argsort powers ranking and top-k selection"],
    selfCheck: {
      question: "What does np.argsort return?",
      options: ["Sorted values", "Indices that would sort the array", "The maximum", "A boolean mask"],
      answer: 1,
      explanation: "argsort returns index positions, which you then use to reorder any array.",
    },
  },
  {
    id: "numpy-shape",
    number: 6,
    unit: "unit-1",
    title: "Array Shape Manipulation",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["NumPy", "Reshaping"],
    objective: "Reshape, flatten, transpose and add axes without copying data unnecessarily.",
    outcomes: ["Use reshape with -1", "Distinguish ravel from flatten", "Transpose arrays"],
    theory:
      "reshape changes how the same buffer is interpreted, so the total number of elements must stay the same. -1 lets NumPy infer one dimension. ravel returns a view where possible; flatten always copies.",
    steps: ["Reshape 12 elements to 3x4", "Use -1 inference", "Transpose", "Flatten back to 1D"],
    code: `import numpy as np

arr = np.arange(12)
print("original:", arr)

grid = arr.reshape(3, 4)
print("\\nreshape(3,4):\\n", grid)
print("\\nreshape(-1, 6):\\n", arr.reshape(-1, 6))
print("\\ntranspose:\\n", grid.T)
print("\\nflatten:", grid.flatten())
print("expand dims shape:", np.expand_dims(arr, axis=0).shape)
`,
    widget: "array-grid",
    observation:
      "grid.T swaps the axes so shape (3,4) becomes (4,3); the data is not physically moved, only the strides change.",
    takeaways: ["Element count must be preserved", "-1 infers a dimension", "flatten copies, ravel usually does not"],
    selfCheck: {
      question: "np.arange(12).reshape(5, -1) will…",
      options: ["Give shape (5,2)", "Raise a ValueError", "Give shape (5,3)", "Pad with zeros"],
      answer: 1,
      explanation: "12 cannot be divided into 5 equal rows, so reshape fails.",
    },
  },
  {
    id: "numpy-eye",
    number: 7,
    unit: "unit-1",
    title: "Identity Matrix and eye()",
    difficulty: "Beginner",
    minutes: 10,
    tags: ["NumPy", "Linear Algebra"],
    objective: "Create identity matrices with eye() and identity(), and see why they matter.",
    outcomes: ["Use np.eye with k offsets", "Verify the identity property of matrix multiplication"],
    theory:
      "The identity matrix has 1s on the main diagonal and 0s elsewhere. Multiplying any compatible matrix by I leaves it unchanged — the matrix equivalent of multiplying by 1. np.eye(N, M, k) can also build off-diagonal matrices.",
    steps: ["Create np.eye(3)", "Create an offset diagonal", "Verify A @ I == A"],
    code: `import numpy as np

I = np.eye(3)
print("Identity:\\n", I)
print("\\nnp.identity(3) is the same:\\n", np.identity(3))
print("\\nOffset diagonal np.eye(3, k=1):\\n", np.eye(3, k=1))

A = np.array([[2, 0, 1], [1, 3, 2], [0, 1, 4]])
print("\\nA @ I equals A:", np.array_equal(A @ I, A))
`,
    widget: "array-grid",
    observation: "A @ I returns A exactly, confirming the identity property.",
    takeaways: ["np.eye(n) builds the n×n identity", "k shifts the diagonal up (+) or down (−)"],
    selfCheck: {
      question: "What is the sum of all elements of np.eye(4)?",
      options: ["1", "4", "16", "0"],
      answer: 1,
      explanation: "Four 1s on the diagonal and zeros elsewhere sum to 4.",
    },
  },
  {
    id: "pandas-series",
    number: 8,
    unit: "unit-1",
    title: "Pandas Series",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Pandas", "Series"],
    objective: "Create labelled 1D data with Series and use the index for lookup and alignment.",
    outcomes: ["Build a Series with a custom index", "Select by label and position", "See automatic alignment"],
    theory:
      "A Series is a 1D array plus an index of labels. The index makes lookups readable and enables automatic alignment: arithmetic between two Series matches on the labels, not on position.",
    steps: ["Create a Series of scores keyed by student", "Select by label and by position", "Add two Series with different indexes"],
    code: `import pandas as pd

scores = pd.Series([65, 84, 72, 91], index=["Arun", "Bala", "Charan", "Divya"])
print(scores)

print("\\nBy label:", scores["Bala"])
print("By position:", scores.iloc[1])
print("Above 70:\\n", scores[scores > 70])

bonus = pd.Series([5, 5], index=["Arun", "Divya"])
print("\\nAlignment (note the NaNs):")
print(scores + bonus)
`,
    widget: "dataframe-table",
    observation:
      "Adding Series with different indexes produces NaN wherever a label is missing on one side — this is data alignment, not an error.",
    takeaways: ["A Series = values + index", "Use .loc/.iloc to be explicit", "Alignment happens on labels"],
    selfCheck: {
      question: "scores + bonus produced NaN for Bala because…",
      options: [
        "Bala's score is missing",
        "Bala has no entry in the bonus Series",
        "Series cannot be added",
        "The dtypes differ",
      ],
      answer: 1,
      explanation: "Alignment fills unmatched labels with NaN.",
    },
  },
  {
    id: "pandas-dataframe",
    number: 9,
    unit: "unit-1",
    title: "Pandas DataFrames",
    difficulty: "Beginner",
    minutes: 20,
    tags: ["Pandas", "DataFrame"],
    objective: "Create a DataFrame, inspect it, and add derived columns.",
    outcomes: ["Build a DataFrame from a dict", "Use head/info/describe", "Create computed columns"],
    theory:
      "A DataFrame is a dictionary of Series sharing one index — a table where each column has its own dtype. It is the central object of Pandas.",
    steps: ["Create the student DataFrame", "Inspect with shape, dtypes and describe", "Add a Performance column"],
    code: `${DF}
print(df)
print("\\nShape:", df.shape)
print("\\nData types:\\n", df.dtypes)
print("\\nSummary Statistics:")
print(df.describe())

df["Performance"] = df["Score"].apply(lambda x: "Good" if x >= 75 else "Needs Improvement")
print("\\nWith derived column:")
print(df)
`,
    widget: "dataframe-table",
    observation:
      "describe() only summarises numeric columns, so Student and Performance are excluded automatically.",
    takeaways: ["A DataFrame is columns of Series with a shared index", "apply() maps a function element-wise"],
    selfCheck: {
      question: "Why does df.describe() ignore the Student column?",
      options: [
        "It is the index",
        "It is non-numeric by default",
        "It contains duplicates",
        "It is too short",
      ],
      answer: 1,
      explanation: "By default describe() summarises numeric columns only.",
    },
  },
  {
    id: "pandas-selection",
    number: 10,
    unit: "unit-1",
    title: "Selection, Indexing and Reindexing",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Indexing"],
    objective: "Select columns/rows with loc and iloc, drop entries and reindex a frame.",
    outcomes: ["Use loc vs iloc correctly", "Filter with boolean conditions", "Drop and reindex"],
    theory:
      "loc selects by label and is inclusive of the end label; iloc selects by integer position and is exclusive. drop removes labels along an axis, and reindex conforms a frame to a new index, inserting NaN for missing labels.",
    steps: ["Set Student as the index", "Select with loc and iloc", "Filter rows", "Drop a row and reindex"],
    code: `${DF}
df = df.set_index("Student")
print(df)

print("\\nloc['Bala']:\\n", df.loc["Bala"])
print("\\niloc[0:2]:\\n", df.iloc[0:2])
print("\\nStudy_Hours > 4 and Score > 70:")
print(df[(df["Study_Hours"] > 4) & (df["Score"] > 70)])

print("\\nDrop Charan:\\n", df.drop("Charan"))
print("\\nReindex with a new student:\\n", df.reindex(["Arun", "Bala", "Eshwar"]))
`,
    widget: "dataframe-table",
    observation:
      "Reindexing to an unseen label ('Eshwar') creates a row of NaN rather than raising an error.",
    takeaways: ["loc = labels (inclusive), iloc = positions (exclusive)", "Combine conditions with & and | inside parentheses"],
    selfCheck: {
      question: "df.loc['Arun':'Charan'] includes Charan. True or false?",
      options: ["True", "False"],
      answer: 0,
      explanation: "Label-based slicing with loc is inclusive of the end label.",
    },
  },
  {
    id: "pandas-rank-sort",
    number: 11,
    unit: "unit-1",
    title: "Ranking and Sorting",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Pandas", "Ranking"],
    objective: "Order rows by one or more columns and compute competition ranks.",
    outcomes: ["Use sort_values and sort_index", "Use rank with different tie methods"],
    theory:
      "sort_values orders rows by column values; rank assigns a rank to each value. The method argument controls ties: 'average' (default), 'min' (competition ranking), 'dense' and 'first'.",
    steps: ["Sort by Score descending", "Sort by two keys", "Add rank columns with different methods"],
    code: `${DF}
print("Students ranked by Score:")
print(df.sort_values("Score", ascending=False))

print("\\nSort by Attendance then Score:")
print(df.sort_values(["Attendance", "Score"], ascending=[False, False]))

df["Rank"] = df["Score"].rank(ascending=False, method="min").astype(int)
df["DenseRank"] = df["Score"].rank(ascending=False, method="dense").astype(int)
print("\\nWith ranks:")
print(df.sort_values("Rank"))
`,
    widget: "dataframe-table",
    observation: "sort_values returns a new frame — the original order is untouched unless you reassign.",
    takeaways: ["sort_values for data order, sort_index for label order", "rank(method='min') = competition ranking"],
    selfCheck: {
      question: "Which rank method gives 1, 2, 2, 4 for tied second places?",
      options: ["dense", "min", "average", "first"],
      answer: 1,
      explanation: "method='min' is standard competition ranking and skips the next rank.",
    },
  },
  {
    id: "pandas-summary",
    number: 12,
    unit: "unit-1",
    title: "Summary Statistics and Hierarchical Index",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Statistics"],
    objective: "Compute descriptive statistics, correlations and grouped summaries with a MultiIndex.",
    outcomes: ["Compute mean/median/std", "Interpret correlation", "Build a hierarchical index"],
    theory:
      "Descriptive statistics compress a column into one number. corr() measures the linear relationship between columns (−1 to +1). A MultiIndex lets one axis hold several levels, e.g. Section then Student.",
    steps: ["Compute mean, median and std", "Compute the correlation matrix", "Group by a derived section", "Create a MultiIndex"],
    code: `import pandas as pd

data = {
    "Section": ["A", "A", "B", "B"],
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Score": [65, 84, 72, 91],
}
df = pd.DataFrame(data)

print("Mean score:", df["Score"].mean())
print("Median score:", df["Score"].median())
print("Std deviation:", round(df["Score"].std(), 2))

print("\\nCorrelation:\\n", df[["Study_Hours", "Attendance", "Score"]].corr().round(3))

print("\\nGroup by section:\\n", df.groupby("Section")["Score"].agg(["mean", "max", "count"]))

hier = df.set_index(["Section", "Student"])
print("\\nHierarchical index:\\n", hier)
print("\\nSection A only:\\n", hier.loc["A"])
`,
    widget: "dataframe-table",
    observation:
      "Study_Hours and Score correlate strongly (≈0.99 in this sample), which is why study hours is a useful predictor here.",
    takeaways: ["describe() bundles the common statistics", "corr() near ±1 means a strong linear relationship", "set_index with a list creates a MultiIndex"],
    selfCheck: {
      question: "A correlation of −0.9 between Absences and Score means…",
      options: [
        "No relationship",
        "More absences strongly associate with lower scores",
        "Absences cause low scores",
        "The data is invalid",
      ],
      answer: 1,
      explanation: "Strong negative association — but association is not causation.",
    },
  },
  {
    id: "acquisition-api",
    number: 13,
    unit: "unit-1",
    title: "Data Acquisition Concepts",
    difficulty: "Beginner",
    minutes: 20,
    tags: ["Data Acquisition", "APIs", "JSON"],
    objective: "Turn a JSON API response into a Pandas DataFrame and understand browser limitations.",
    outcomes: ["Parse JSON into Python objects", "Normalise nested JSON", "Explain CORS and API-key risk"],
    theory:
      "Most web APIs return JSON. In Python, json.loads gives a dict, and pd.json_normalize flattens nested structures into a table. In a browser-only lab, requests to third-party hosts are governed by CORS, and any key shipped to the browser is public.",
    steps: ["Load a JSON string", "Convert to a dict", "Normalise into a DataFrame", "Analyse"],
    code: `import json
import pandas as pd

response = '''
[
  {"student": "Arun",   "attendance": 85, "score": 78},
  {"student": "Bala",   "attendance": 92, "score": 84},
  {"student": "Charan", "attendance": 88, "score": 72}
]
'''

records = json.loads(response)
print("Python object type:", type(records))
print("First record:", records[0])

df = pd.json_normalize(records)
print("\\nAs DataFrame:")
print(df)
print("\\nMean score:", df["score"].mean())
`,
    widget: "api-simulator",
    observation:
      "The same data moves through four representations: JSON text → Python list of dicts → DataFrame → analysis result.",
    takeaways: [
      "json.loads parses, pd.json_normalize flattens",
      "CORS can block browser requests to third-party APIs",
      "Never embed API keys in frontend code",
    ],
    selfCheck: {
      question: "Which is safe in a browser-only application?",
      options: [
        "Calling a paid API with your secret key",
        "Reading a local JSON file the user uploaded",
        "Scraping any website directly",
        "Storing a password in localStorage",
      ],
      answer: 1,
      explanation: "Local files never leave the browser and need no secrets.",
    },
  },
  {
    id: "cleaning-missing",
    number: 14,
    unit: "unit-2",
    title: "Handling Missing Values",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Data Cleaning"],
    objective: "Detect missing data and choose between dropping, filling and imputing.",
    outcomes: ["Count nulls per column", "Apply fillna strategies", "Judge when to drop rows"],
    theory:
      "Missing values appear as NaN. isna().sum() counts them per column. Options: drop rows (safe only when few), fill with a constant, fill with mean/median (median resists outliers), or forward/backward fill for time series.",
    steps: ["Inspect missingness", "Drop rows and observe the loss", "Fill with the median", "Compare before and after"],
    code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya", "Elakiya"],
    "Hours": [5, np.nan, 6, 9, 3],
    "Score": [75, 82, np.nan, 91, 58],
})

print("Original:\\n", df)
print("\\nMissing per column:\\n", df.isna().sum())
print("Total missing:", int(df.isna().sum().sum()))

print("\\ndropna() keeps only complete rows:\\n", df.dropna())

filled = df.copy()
filled["Hours"] = filled["Hours"].fillna(filled["Hours"].median())
filled["Score"] = filled["Score"].fillna(filled["Score"].mean().round(1))
print("\\nAfter imputation:\\n", filled)
print("\\nMissing now:", int(filled.isna().sum().sum()))
`,
    widget: "dataframe-table",
    observation:
      "dropna() removes 40% of this tiny dataset; median imputation keeps every row but slightly reduces variance.",
    takeaways: ["Always count nulls first", "Median is safer than mean when outliers exist", "Document the imputation you chose"],
    selfCheck: {
      question: "Which fill strategy is most robust to extreme values?",
      options: ["Mean", "Median", "Zero", "Maximum"],
      answer: 1,
      explanation: "The median is unaffected by how extreme the outliers are.",
    },
  },
  {
    id: "cleaning-duplicates",
    number: 15,
    unit: "unit-2",
    title: "Removing Duplicates",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Pandas", "Data Cleaning"],
    objective: "Find and remove exact and partial duplicate records safely.",
    outcomes: ["Use duplicated() and drop_duplicates()", "Control which copy is kept", "Deduplicate on a subset"],
    theory:
      "duplicated() flags rows already seen; drop_duplicates() removes them. subset restricts the comparison to key columns, and keep controls whether the first, last or no copy survives. Pandas methods return copies — assign the result back.",
    steps: ["Flag duplicates", "Drop exact duplicates", "Deduplicate on Student_ID only"],
    code: `import pandas as pd

df = pd.DataFrame({
    "Student_ID": [1, 2, 3, 1, 2],
    "Student": ["Arun", "Bala", "Charan", "Arun", "Bala"],
    "Score": [75, 82, 99, 75, 88],
})

print("Original rows:", len(df))
print(df)
print("\\nDuplicated mask:\\n", df.duplicated())

exact = df.drop_duplicates()
print("\\nAfter exact drop:", len(exact), "rows\\n", exact)

by_id = df.drop_duplicates(subset=["Student_ID"], keep="last")
print("\\nOne row per student (keep last):\\n", by_id)
`,
    widget: "dataframe-table",
    observation:
      "Row 4 (Arun) is an exact duplicate, but Bala's two rows differ in Score — only subset deduplication removes it, and the keep choice changes the answer.",
    takeaways: ["Exact duplicates ≠ business duplicates", "Assign the result back or use inplace=True"],
    selfCheck: {
      question: "df.drop_duplicates() alone did not change df. Why?",
      options: ["It only marks rows", "It returns a new DataFrame", "Duplicates need SQL", "You must sort first"],
      answer: 1,
      explanation: "Reassign: df = df.drop_duplicates().",
    },
  },
  {
    id: "cleaning-transform",
    number: 16,
    unit: "unit-2",
    title: "Data Transformation",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Transformation"],
    objective: "Map, replace and apply functions to reshape column values.",
    outcomes: ["Use map and replace", "Apply row-wise functions", "Convert dtypes"],
    theory:
      "map applies a dict or function element-wise to a Series, replace swaps specific values, apply runs a function over a Series or across rows with axis=1, and astype converts dtypes.",
    steps: ["Map grades from scores", "Replace invalid sentinel values", "Compute a row-wise weighted total"],
    code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Score": [65, 84, 999, 91],
    "Assignment": [70, 88, 75, 94],
})

df["Score"] = df["Score"].replace(999, np.nan)

def grade(score):
    if pd.isna(score):
        return "Unknown"
    if score >= 85:
        return "A"
    if score >= 70:
        return "B"
    return "C"

df["Grade"] = df["Score"].apply(grade)
df["Total"] = df.apply(lambda r: 0.6 * (r["Score"] if pd.notna(r["Score"]) else 0) + 0.4 * r["Assignment"], axis=1)
print(df)
`,
    widget: "dataframe-table",
    observation: "999 was an invalid sentinel; converting it to NaN before computing keeps the grade honest.",
    takeaways: ["map for lookups, apply for logic, axis=1 for row-wise work", "Handle NaN explicitly inside custom functions"],
    selfCheck: {
      question: "What does axis=1 mean in df.apply(f, axis=1)?",
      options: ["Apply per column", "Apply per row", "Apply to the index", "Apply twice"],
      answer: 1,
      explanation: "axis=1 passes each row (as a Series) to the function.",
    },
  },
  {
    id: "cleaning-strings",
    number: 17,
    unit: "unit-2",
    title: "String Cleaning",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Pandas", "Strings"],
    objective: "Normalise inconsistent text with the .str accessor.",
    outcomes: ["Strip, case-normalise and replace text", "Split text into columns", "Match with contains"],
    theory:
      "Series.str exposes vectorised string methods. Typical cleaning: strip() whitespace, title()/lower() for case, replace() for junk characters, split(expand=True) to break a field into columns.",
    steps: ["Strip and title-case names", "Extract a domain from an email", "Filter with contains"],
    code: `import pandas as pd

df = pd.DataFrame({
    "Student": [" arun ", "BALA", "Charan  ", " divya"],
    "Email": ["arun@uni.edu", "bala@uni.edu", "charan@gmail.com", "divya@uni.edu"],
})

df["Student"] = df["Student"].str.strip().str.title()
df["Domain"] = df["Email"].str.split("@", expand=True)[1]
df["IsUniversity"] = df["Email"].str.contains("uni.edu")
print(df)
print("\\nUniversity accounts:", int(df["IsUniversity"].sum()))
`,
    widget: "dataframe-table",
    observation: "Without strip(), ' arun ' and 'Arun' would be treated as two different students in a group-by.",
    takeaways: ["Always strip and case-normalise key columns before joining or grouping", ".str methods are vectorised"],
    selfCheck: {
      question: "Which sequence normalises ' bala ' to 'Bala'?",
      options: [".str.title().str.strip()", ".str.strip().str.title()", "Both work", "Neither"],
      answer: 2,
      explanation: "Either order works here; strip-then-title is the conventional form.",
    },
  },
  {
    id: "wrangling-merge",
    number: 18,
    unit: "unit-2",
    title: "Merging Datasets",
    difficulty: "Intermediate",
    minutes: 25,
    tags: ["Pandas", "Merge", "Joins"],
    objective: "Combine two tables on a key and choose the correct join type.",
    outcomes: ["Use pd.merge with how=", "Predict row counts", "Merge on index"],
    theory:
      "Joins combine rows from two tables using a key. inner keeps matches only; left keeps all left rows; right keeps all right rows; outer keeps everything. Unmatched cells become NaN.",
    steps: ["Create two frames with partially overlapping IDs", "Merge with each join type", "Inspect NaNs"],
    code: `import pandas as pd

students = pd.DataFrame({
    "Student_ID": [1, 2, 3],
    "Name": ["Arun", "Bala", "Charan"],
})

scores = pd.DataFrame({
    "Student_ID": [1, 2, 4],
    "Score": [78, 92, 85],
})

for how in ["inner", "left", "right", "outer"]:
    result = pd.merge(students, scores, on="Student_ID", how=how)
    print(f"--- {how} ({len(result)} rows) ---")
    print(result, "\\n")
`,
    widget: "merge-simulator",
    observation:
      "inner = 2 rows, left = 3, right = 3, outer = 4. Choosing the join type is a decision about which records you are willing to lose.",
    takeaways: ["Check row counts before and after every merge", "NaNs after a join reveal unmatched keys"],
    selfCheck: {
      question: "Which join guarantees no row from either table is lost?",
      options: ["inner", "left", "right", "outer"],
      answer: 3,
      explanation: "An outer join keeps the union of both key sets.",
    },
  },
  {
    id: "wrangling-concat",
    number: 19,
    unit: "unit-2",
    title: "Concatenating DataFrames",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Pandas", "Combining"],
    objective: "Stack frames vertically and horizontally, and combine with overlap.",
    outcomes: ["Use pd.concat on both axes", "Reset the index", "Use combine_first for overlap"],
    theory:
      "concat glues frames along an axis without matching on a key. Use ignore_index=True to renumber rows. combine_first fills missing values in one frame from another — useful for patching partial data.",
    steps: ["Concat two batches of students", "Concat columns", "Patch missing values with combine_first"],
    code: `import pandas as pd
import numpy as np

batch1 = pd.DataFrame({"Student": ["Arun", "Bala"], "Score": [75, 82]})
batch2 = pd.DataFrame({"Student": ["Charan", "Divya"], "Score": [72, 91]})

stacked = pd.concat([batch1, batch2], ignore_index=True)
print("Vertical concat:\\n", stacked)

extra = pd.DataFrame({"Attendance": [80, 92, 88, 96]})
print("\\nHorizontal concat:\\n", pd.concat([stacked, extra], axis=1))

primary = pd.DataFrame({"Score": [75, np.nan, np.nan]})
backup = pd.DataFrame({"Score": [70, 82, 65]})
print("\\ncombine_first (patch gaps):\\n", primary.combine_first(backup))
`,
    widget: "dataframe-table",
    observation: "Without ignore_index the index repeats 0,1,0,1 — a classic source of later bugs.",
    takeaways: ["concat = stacking, merge = key matching", "combine_first patches holes from a fallback frame"],
    selfCheck: {
      question: "What does ignore_index=True do in pd.concat?",
      options: ["Drops the index column", "Renumbers rows 0..n-1", "Sorts the index", "Nothing"],
      answer: 1,
      explanation: "It rebuilds a clean sequential index.",
    },
  },
  {
    id: "wrangling-reshape",
    number: 20,
    unit: "unit-2",
    title: "Reshaping Data",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Reshape"],
    objective: "Move between wide and long formats using melt, pivot, stack and unstack.",
    outcomes: ["Melt wide to long", "Pivot long to wide", "Use stack/unstack with a MultiIndex"],
    theory:
      "Wide format has one column per measure; long (tidy) format has one row per observation. melt goes wide→long, pivot goes long→wide. stack/unstack do the same on the index levels.",
    steps: ["Start wide", "Melt to long", "Pivot back", "Try stack/unstack"],
    code: `import pandas as pd

wide = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan"],
    "Maths": [75, 82, 68],
    "Physics": [70, 88, 74],
})
print("Wide:\\n", wide)

long = wide.melt(id_vars="Student", var_name="Subject", value_name="Marks")
print("\\nLong (tidy):\\n", long)

back = long.pivot(index="Student", columns="Subject", values="Marks")
print("\\nPivoted back:\\n", back)
print("\\nStacked:\\n", back.stack())
`,
    widget: "dataframe-table",
    observation: "Long format is what most plotting and grouping tools expect; wide format is what humans read.",
    takeaways: ["melt = wide→long, pivot = long→wide", "Tidy data: one observation per row"],
    selfCheck: {
      question: "Which format has one row per Student-Subject pair?",
      options: ["Wide", "Long", "Both", "Neither"],
      answer: 1,
      explanation: "Long/tidy format stores one measurement per row.",
    },
  },
  {
    id: "wrangling-pivot",
    number: 21,
    unit: "unit-2",
    title: "Pivot Tables",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Aggregation"],
    objective: "Summarise data across two dimensions with pivot_table and crosstab.",
    outcomes: ["Aggregate with pivot_table", "Add margins", "Use crosstab for counts"],
    theory:
      "pivot_table groups by index and columns and aggregates the values with a function (mean by default). margins=True adds totals. crosstab is a shortcut for frequency tables.",
    steps: ["Build a longer dataset", "Pivot mean scores by section and subject", "Add margins", "Cross-tabulate counts"],
    code: `import pandas as pd

df = pd.DataFrame({
    "Section": ["A", "A", "B", "B", "A", "B"],
    "Subject": ["Maths", "Physics", "Maths", "Physics", "Maths", "Maths"],
    "Student": ["Arun", "Bala", "Charan", "Divya", "Elakiya", "Faizal"],
    "Score": [75, 82, 68, 91, 88, 72],
})

pt = pd.pivot_table(df, index="Section", columns="Subject", values="Score", aggfunc="mean", margins=True)
print("Mean score pivot:\\n", pt.round(1))

print("\\nCount of students:\\n", pd.crosstab(df["Section"], df["Subject"]))
`,
    widget: "dataframe-table",
    observation: "The All row/column shows the grand mean, letting you sanity-check each cell against the total.",
    takeaways: ["pivot_table = group by two keys + aggregate", "crosstab is the frequency-count shortcut"],
    selfCheck: {
      question: "What is the default aggfunc of pivot_table?",
      options: ["sum", "mean", "count", "max"],
      answer: 1,
      explanation: "pivot_table averages the values unless told otherwise.",
    },
  },
  {
    id: "cleaning-binning",
    number: 22,
    unit: "unit-2",
    title: "Binning and Categorization",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Pandas", "Binning"],
    objective: "Convert continuous values into meaningful categories with cut and qcut.",
    outcomes: ["Use pd.cut with explicit edges", "Use pd.qcut for equal-sized groups", "Label bins"],
    theory:
      "cut splits a range into fixed intervals you define (grade bands), while qcut splits into quantiles so each bin has roughly the same number of rows. Binning trades precision for interpretability.",
    steps: ["Define grade bands with cut", "Create quartile groups with qcut", "Count members per bin"],
    code: `import pandas as pd

scores = pd.Series([41, 49, 58, 63, 65, 68, 70, 72, 75, 77, 81, 84, 86, 88, 91, 95, 97],
                   name="Final_Score")

bands = pd.cut(scores, bins=[0, 50, 60, 70, 80, 90, 100],
               labels=["F", "E", "D", "C", "B", "A"])
print("Grade bands:\\n", bands.value_counts().sort_index())

quartiles = pd.qcut(scores, q=4, labels=["Q1", "Q2", "Q3", "Q4"])
print("\\nQuartile groups:\\n", quartiles.value_counts().sort_index())

print("\\nTable:\\n", pd.DataFrame({"Score": scores, "Band": bands, "Quartile": quartiles}).head(8))
`,
    widget: "dataframe-table",
    observation: "cut produces uneven group sizes based on the score distribution; qcut forces roughly equal counts.",
    takeaways: ["cut = fixed edges, qcut = equal counts", "Always label bins for readable output"],
    selfCheck: {
      question: "You want four groups of equal size. Which do you use?",
      options: ["pd.cut", "pd.qcut", "pd.melt", "pd.pivot"],
      answer: 1,
      explanation: "qcut splits by quantiles, so each bin holds about the same number of rows.",
    },
  },
  {
    id: "cleaning-standardize",
    number: 23,
    unit: "unit-2",
    title: "Standardization and Scaling",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Preprocessing", "Scaling"],
    objective: "Compare Min-Max scaling with Z-score standardization on the same column.",
    outcomes: ["Apply both formulas", "Interpret the resulting statistics", "Choose the right scaler"],
    theory:
      "Min-Max maps values to [0, 1] with x' = (x − min)/(max − min) and preserves the shape but is sensitive to outliers. Z-score gives z = (x − μ)/σ, producing mean 0 and std 1, and is preferred when the data is roughly bell-shaped.",
    steps: ["Compute min, max, mean and std", "Apply both transforms", "Compare the resulting statistics"],
    code: `import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya", "Elakiya"],
    "Study_Hours": [4, 7, 5, 9, 3],
})

x = df["Study_Hours"]
df["MinMax"] = ((x - x.min()) / (x.max() - x.min())).round(3)
df["ZScore"] = ((x - x.mean()) / x.std()).round(3)

print(df)
print("\\nOriginal  -> mean:", round(x.mean(), 2), " std:", round(x.std(), 2))
print("MinMax    -> min:", df['MinMax'].min(), " max:", df['MinMax'].max())
print("ZScore    -> mean:", round(df['ZScore'].mean(), 3), " std:", round(df['ZScore'].std(), 3))
`,
    widget: "standardize",
    observation: "Min-Max always lands in [0,1]; Z-score always ends with mean ≈ 0 and std ≈ 1 but is unbounded.",
    takeaways: ["Scale features before distance-based algorithms", "Fit the scaler on training data only"],
    selfCheck: {
      question: "Which scaler is more affected by a single extreme outlier?",
      options: ["Min-Max", "Z-score", "Both equally", "Neither"],
      answer: 0,
      explanation: "Min-Max depends entirely on the min and max, so one outlier squashes everything else.",
    },
  },
  {
    id: "cleaning-outliers",
    number: 24,
    unit: "unit-2",
    title: "Outlier Detection with IQR",
    difficulty: "Intermediate",
    minutes: 25,
    tags: ["Statistics", "Outliers"],
    objective: "Detect outliers using the IQR rule and decide how to treat them.",
    outcomes: ["Compute Q1, Q3 and IQR", "Apply the 1.5 × IQR fences", "Compare removal vs capping"],
    theory:
      "IQR = Q3 − Q1 covers the middle 50% of the data. Points below Q1 − k·IQR or above Q3 + k·IQR are flagged as outliers, with k = 1.5 as the convention (k = 3 for extreme outliers). The rule is distribution-free, unlike the ±3σ rule.",
    steps: ["Compute the quartiles", "Derive the fences", "Flag outliers", "Compare drop vs cap (winsorize)"],
    code: `import pandas as pd

scores = pd.Series([65, 84, 72, 91, 58, 77, 86, 49, 95, 68, 12, 130])

q1, q3 = scores.quantile(0.25), scores.quantile(0.75)
iqr = q3 - q1
k = 1.5
lower, upper = q1 - k * iqr, q3 + k * iqr

print(f"Q1 = {q1}, Q3 = {q3}, IQR = {iqr}")
print(f"Bounds: [{lower}, {upper}]")

outliers = scores[(scores < lower) | (scores > upper)]
print("\\nOutliers:", list(outliers))

cleaned = scores[(scores >= lower) & (scores <= upper)]
capped = scores.clip(lower, upper)
print("\\nMean original:", round(scores.mean(), 2))
print("Mean after removal:", round(cleaned.mean(), 2))
print("Mean after capping:", round(capped.mean(), 2))
`,
    widget: "outlier-slider",
    observation:
      "Lowering the multiplier flags more points. Removing outliers shrinks the sample; capping keeps every row but pulls extremes to the fence.",
    takeaways: ["IQR = Q3 − Q1; fences are Q1 − k·IQR and Q3 + k·IQR", "An outlier is not automatically an error"],
    selfCheck: {
      question: "Increasing the IQR multiplier from 1.5 to 3.0 will…",
      options: ["Flag more outliers", "Flag fewer outliers", "Change the median", "Have no effect"],
      answer: 1,
      explanation: "Wider fences mean fewer points fall outside them.",
    },
  },
  {
    id: "cleaning-noise",
    number: 25,
    unit: "unit-2",
    title: "Noise and Anomaly Exploration",
    difficulty: "Advanced",
    minutes: 25,
    tags: ["Statistics", "Anomalies"],
    objective: "Distinguish random noise from genuine anomalies and smooth a noisy series.",
    outcomes: ["Add and measure noise", "Smooth with a rolling mean", "Flag anomalies with Z-scores"],
    theory:
      "Noise is random variation around the true signal; an anomaly is a point generated by a different process. Rolling averages suppress noise; Z-score or IQR rules surface anomalies. Smoothing too aggressively hides real events.",
    steps: ["Generate a signal with noise", "Inject an anomaly", "Smooth with rolling()", "Flag |z| > 3"],
    code: `import numpy as np
import pandas as pd

rng = np.random.default_rng(21)
weeks = np.arange(1, 25)
signal = 60 + 1.2 * weeks
noisy = signal + rng.normal(0, 2.5, len(weeks))
noisy[14] = 120  # injected anomaly

s = pd.Series(noisy, index=weeks).round(2)
smooth = s.rolling(window=3, center=True).mean().round(2)

z = (s - s.mean()) / s.std()
anomalies = s[abs(z) > 2.5]

print("Noise std (approx):", round((s - signal).std(), 2))
print("\\nSmoothed head:\\n", smooth.head(6))
print("\\nAnomalies detected:\\n", anomalies)
`,
    widget: "chart-preview",
    observation:
      "The rolling mean follows the trend while ignoring jitter, and the injected week-15 spike is the only |z| > 2.5 point.",
    takeaways: ["Noise is everywhere; anomalies are rare and meaningful", "Smoothing window size is a trade-off"],
    selfCheck: {
      question: "A rolling mean with a very large window will…",
      options: ["Reveal more detail", "Hide genuine short events", "Increase noise", "Do nothing"],
      answer: 1,
      explanation: "Over-smoothing averages away real short-lived signals.",
    },
  },
  {
    id: "viz-line",
    number: 26,
    unit: "unit-3",
    title: "Line Plot",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Matplotlib", "Line"],
    objective: "Plot a trend over an ordered axis with labels and a grid.",
    outcomes: ["Create a line plot", "Label axes and title", "Add markers and grid"],
    theory:
      "Line plots connect ordered points and are the default choice for trends over time or another ordered variable. The connection implies continuity, so never use a line for unordered categories.",
    steps: ["Prepare weekly averages", "Plot with markers", "Label everything", "Show the figure"],
    code: `import matplotlib.pyplot as plt

weeks = [1, 2, 3, 4, 5, 6, 7, 8]
class_average = [58, 61, 63, 66, 68, 71, 74, 77]

plt.figure(figsize=(7, 4))
plt.plot(weeks, class_average, marker="o", linewidth=2, color="#2563eb")
plt.xlabel("Week")
plt.ylabel("Class average score")
plt.title("Class Average Over the Semester")
plt.grid(True, alpha=0.3)
plt.show()
`,
    widget: "chart-preview",
    observation: "The upward slope shows steady improvement; the grid makes it easy to read values off the chart.",
    takeaways: ["Lines imply order", "Always label axes with units"],
    selfCheck: {
      question: "When is a line plot the wrong choice?",
      options: ["Time series", "Ordered measurements", "Unordered categories", "Trends"],
      answer: 2,
      explanation: "Connecting unordered categories suggests a progression that does not exist.",
    },
  },
  {
    id: "viz-scatter",
    number: 27,
    unit: "unit-3",
    title: "Scatter Plot",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Matplotlib", "Scatter"],
    objective: "Show the relationship between two continuous variables.",
    outcomes: ["Create a scatter plot", "Encode a third variable with colour/size", "Read correlation visually"],
    theory:
      "A scatter plot maps each observation to a point. Slope indicates the direction of the relationship, tightness indicates strength, and colour or marker size can encode a third variable.",
    steps: ["Plot Study_Hours against Score", "Colour by attendance", "Add a colourbar and labels"],
    code: `import matplotlib.pyplot as plt

study_hours = [4, 7, 5, 9, 3, 6, 8, 2, 10, 5]
score = [65, 84, 72, 91, 58, 77, 86, 49, 95, 68]
attendance = [80, 92, 88, 96, 68, 84, 90, 60, 98, 76]

plt.figure(figsize=(7, 4.5))
sc = plt.scatter(study_hours, score, c=attendance, s=90, cmap="viridis", edgecolor="white")
plt.colorbar(sc, label="Attendance %")
plt.xlabel("Study Hours")
plt.ylabel("Score")
plt.title("Study Hours vs Score")
plt.grid(True, alpha=0.25)
plt.show()
`,
    widget: "chart-preview",
    observation: "Points rise from bottom-left to top-right and the brightest (highest attendance) points sit highest.",
    takeaways: ["Scatter = relationship between two continuous variables", "c and s encode extra dimensions"],
    selfCheck: {
      question: "Points forming a tight upward band indicate…",
      options: ["No relationship", "A strong positive relationship", "A negative relationship", "An error"],
      answer: 1,
      explanation: "Tight and upward means strong and positive.",
    },
  },
  {
    id: "viz-bar",
    number: 28,
    unit: "unit-3",
    title: "Bar Plot",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Matplotlib", "Bar"],
    objective: "Compare a measure across categories, including grouped bars.",
    outcomes: ["Create vertical and grouped bars", "Annotate values", "Sort for readability"],
    theory:
      "Bar charts compare a numeric value across discrete categories. Bars must start at zero, otherwise differences are visually exaggerated. Sorting bars by value usually makes the comparison easier.",
    steps: ["Plot scores per student", "Add value labels", "Draw grouped bars for two subjects"],
    code: `import matplotlib.pyplot as plt
import numpy as np

students = ["Arun", "Bala", "Charan", "Divya"]
maths = [65, 84, 72, 91]
physics = [70, 88, 68, 87]

x = np.arange(len(students))
width = 0.38

fig, ax = plt.subplots(figsize=(7, 4.5))
b1 = ax.bar(x - width / 2, maths, width, label="Maths", color="#2563eb")
b2 = ax.bar(x + width / 2, physics, width, label="Physics", color="#14b8a6")
ax.bar_label(b1, padding=2, fontsize=8)
ax.bar_label(b2, padding=2, fontsize=8)
ax.set_xticks(x, students)
ax.set_ylabel("Marks")
ax.set_title("Marks by Subject")
ax.legend()
plt.show()
`,
    widget: "chart-preview",
    observation: "Grouped bars make within-student comparison easy while keeping students comparable to each other.",
    takeaways: ["Bars start at zero", "bar_label removes the need to squint at the axis"],
    selfCheck: {
      question: "Why must a bar chart's y-axis start at zero?",
      options: ["Convention only", "Bar length encodes the value", "Matplotlib requires it", "It does not matter"],
      answer: 1,
      explanation: "Length is the visual encoding; truncating the axis distorts the ratio.",
    },
  },
  {
    id: "viz-hist",
    number: 29,
    unit: "unit-3",
    title: "Histogram",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Matplotlib", "Distribution"],
    objective: "Show the distribution of one continuous variable and study the effect of bin width.",
    outcomes: ["Create a histogram", "Change bin counts", "Overlay the mean"],
    theory:
      "A histogram buckets a continuous variable and plots the count per bucket. Bin count controls the story: too few hides structure, too many shows noise.",
    steps: ["Plot scores with 6 bins", "Add mean and median lines", "Compare with 15 bins"],
    code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(7)
scores = np.clip(rng.normal(72, 12, 300), 0, 100)

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
for ax, bins in zip(axes, [6, 20]):
    ax.hist(scores, bins=bins, color="#2563eb", edgecolor="white", alpha=0.85)
    ax.axvline(scores.mean(), color="#ef4444", linestyle="--", label=f"mean {scores.mean():.1f}")
    ax.set_title(f"{bins} bins")
    ax.set_xlabel("Score")
    ax.set_ylabel("Students")
    ax.legend()
plt.tight_layout()
plt.show()
`,
    widget: "chart-preview",
    observation: "Both panels show the same data; the 6-bin version reads as a smooth hill, the 20-bin version exposes sampling noise.",
    takeaways: ["Histogram = distribution of one variable", "Always try more than one bin width"],
    selfCheck: {
      question: "A histogram shows the distribution of how many variables?",
      options: ["One", "Two", "Three", "Any number"],
      answer: 0,
      explanation: "One continuous variable per histogram.",
    },
  },
  {
    id: "viz-box",
    number: 30,
    unit: "unit-3",
    title: "Box Plot",
    difficulty: "Intermediate",
    minutes: 15,
    tags: ["Matplotlib", "Distribution"],
    objective: "Compare distributions across groups and spot outliers.",
    outcomes: ["Read the five-number summary", "Compare groups side by side", "Identify outlier points"],
    theory:
      "A box plot draws Q1, median and Q3 as a box, whiskers to 1.5 × IQR, and individual points beyond that as outliers. It compresses a distribution into a shape you can compare across many groups.",
    steps: ["Build three section samples", "Draw the box plot", "Interpret medians and spread"],
    code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(3)
section_a = rng.normal(72, 8, 40)
section_b = np.append(rng.normal(65, 12, 39), 130)
section_c = rng.normal(80, 5, 40)

plt.figure(figsize=(7, 4.5))
plt.boxplot([section_a, section_b, section_c], tick_labels=["Section A", "Section B", "Section C"])
plt.ylabel("Final Score")
plt.title("Score Distribution by Section")
plt.grid(True, axis="y", alpha=0.25)
plt.show()
`,
    widget: "outlier-slider",
    observation: "Section C has the highest median and the smallest spread; Section B shows one clear outlier above the whisker.",
    takeaways: ["Box = IQR, line = median, dots = outliers", "Great for comparing many groups at once"],
    selfCheck: {
      question: "The line inside the box is the…",
      options: ["Mean", "Median", "Mode", "Maximum"],
      answer: 1,
      explanation: "Box plots are quartile-based; the central line is the median.",
    },
  },
  {
    id: "viz-subplots",
    number: 31,
    unit: "unit-3",
    title: "Multiple Subplots",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Matplotlib", "Layout"],
    objective: "Compose a multi-panel figure with a shared narrative.",
    outcomes: ["Use plt.subplots grids", "Share axes", "Apply tight_layout"],
    theory:
      "plt.subplots(nrows, ncols) returns a Figure and an array of Axes. Each Axes is drawn independently. sharex/sharey keep scales comparable, and tight_layout prevents label overlap.",
    steps: ["Create a 2x2 grid", "Draw four different chart types", "Add a suptitle and tidy the layout"],
    code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(11)
hours = np.array([4, 7, 5, 9, 3, 6, 8, 2, 10, 5])
score = np.array([65, 84, 72, 91, 58, 77, 86, 49, 95, 68])

fig, ax = plt.subplots(2, 2, figsize=(10, 6))
ax[0, 0].plot(sorted(hours), sorted(score), marker="o"); ax[0, 0].set_title("Line")
ax[0, 1].scatter(hours, score, color="#14b8a6"); ax[0, 1].set_title("Scatter")
ax[1, 0].bar(range(len(score)), score, color="#2563eb"); ax[1, 0].set_title("Bar")
ax[1, 1].hist(rng.normal(72, 10, 200), bins=15, color="#8b5cf6"); ax[1, 1].set_title("Histogram")

fig.suptitle("Four Views of Student Performance", fontsize=13)
plt.tight_layout()
plt.show()
`,
    widget: "chart-preview",
    observation: "Four perspectives on one dataset in a single figure — each answers a different question.",
    takeaways: ["ax is a 2D array; index it as ax[row, col]", "tight_layout fixes overlapping labels"],
    selfCheck: {
      question: "plt.subplots(2, 3) creates how many Axes?",
      options: ["5", "6", "2", "3"],
      answer: 1,
      explanation: "2 rows × 3 columns = 6 Axes.",
    },
  },
  {
    id: "viz-labels",
    number: 32,
    unit: "unit-3",
    title: "Labels, Ticks and Legends",
    difficulty: "Beginner",
    minutes: 15,
    tags: ["Matplotlib", "Axes"],
    objective: "Control axis labels, tick positions, limits and legend placement.",
    outcomes: ["Set custom ticks", "Control axis limits", "Position the legend"],
    theory:
      "Axes decorations are what make a chart readable: set_xticks/set_xticklabels control the scale marks, set_xlim/set_ylim frame the data, and legend(loc=...) explains the series.",
    steps: ["Plot two series", "Set custom ticks and limits", "Place the legend outside the plot area"],
    code: `import matplotlib.pyplot as plt

weeks = list(range(1, 9))
section_a = [58, 61, 63, 66, 68, 71, 74, 77]
section_b = [62, 63, 64, 64, 66, 67, 69, 70]

fig, ax = plt.subplots(figsize=(7.5, 4.2))
ax.plot(weeks, section_a, marker="o", label="Section A")
ax.plot(weeks, section_b, marker="s", label="Section B")

ax.set_xticks(weeks)
ax.set_xticklabels([f"W{w}" for w in weeks])
ax.set_ylim(50, 85)
ax.set_xlabel("Semester week")
ax.set_ylabel("Average score")
ax.set_title("Section Comparison")
ax.legend(loc="lower right", frameon=True)
ax.grid(True, alpha=0.25)
plt.show()
`,
    widget: "chart-preview",
    observation: "Custom tick labels (W1…W8) communicate the unit without a separate note, and the y-limit keeps both series comparable.",
    takeaways: ["Ticks and labels carry the units", "A legend is mandatory with multiple series"],
    selfCheck: {
      question: "Which call fixes the visible y-range?",
      options: ["set_yticks", "set_ylim", "set_ylabel", "legend"],
      answer: 1,
      explanation: "set_ylim sets the displayed range; set_yticks only places marks.",
    },
  },
  {
    id: "viz-annotate",
    number: 33,
    unit: "unit-3",
    title: "Plot Annotations",
    difficulty: "Intermediate",
    minutes: 15,
    tags: ["Matplotlib", "Annotation"],
    objective: "Highlight the important point in a chart with text and arrows.",
    outcomes: ["Use ax.annotate with arrows", "Add reference lines", "Shade regions"],
    theory:
      "Annotation moves a chart from data display to communication: annotate() attaches text (optionally with an arrow) to a data point, axhline draws thresholds, and axvspan shades a region of interest.",
    steps: ["Plot the trend", "Annotate the peak", "Add a pass threshold line", "Shade the revision period"],
    code: `import matplotlib.pyplot as plt

weeks = list(range(1, 11))
scores = [58, 61, 63, 60, 66, 71, 74, 77, 82, 80]
peak = max(scores)
peak_week = weeks[scores.index(peak)]

fig, ax = plt.subplots(figsize=(7.5, 4.2))
ax.plot(weeks, scores, marker="o", color="#2563eb")
ax.annotate(f"Peak: {peak}",
            xy=(peak_week, peak), xytext=(peak_week - 3, peak + 4),
            arrowprops=dict(arrowstyle="->", color="#ef4444"), color="#ef4444")
ax.axhline(65, color="#f59e0b", linestyle="--", label="Pass threshold")
ax.axvspan(7, 9, color="#14b8a6", alpha=0.12, label="Revision weeks")
ax.set_xlabel("Week"); ax.set_ylabel("Average score")
ax.set_title("Where the Class Improved")
ax.legend()
plt.show()
`,
    widget: "chart-preview",
    observation: "The arrow and shaded band direct attention to the finding instead of leaving the reader to hunt for it.",
    takeaways: ["Annotate the one thing you want remembered", "axhline/axvspan add context cheaply"],
    selfCheck: {
      question: "In annotate, what does xy specify?",
      options: ["Text position", "The point being annotated", "Figure size", "Arrow colour"],
      answer: 1,
      explanation: "xy is the data point; xytext is where the text sits.",
    },
  },
  {
    id: "viz-style",
    number: 34,
    unit: "unit-3",
    title: "Advanced Styling and Saving",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Matplotlib", "Styling"],
    objective: "Apply style sheets, custom rcParams and export a publication-ready figure.",
    outcomes: ["Use plt.style", "Set rcParams", "Save at high DPI"],
    theory:
      "Style sheets change many defaults at once; rcParams tweaks individual settings. savefig(dpi=300, bbox_inches='tight') exports a crisp figure for reports — in this browser lab it writes to the virtual filesystem.",
    steps: ["List available styles", "Apply one", "Adjust rcParams", "Save the figure"],
    code: `import matplotlib.pyplot as plt

print("Some available styles:", plt.style.available[:8])

plt.style.use("seaborn-v0_8-whitegrid")
plt.rcParams.update({
    "axes.titlesize": 14,
    "axes.titleweight": "bold",
    "axes.labelsize": 11,
    "lines.linewidth": 2.4,
})

weeks = list(range(1, 9))
scores = [58, 61, 63, 66, 68, 71, 74, 77]

fig, ax = plt.subplots(figsize=(7.5, 4.2))
ax.plot(weeks, scores, marker="o", color="#0f766e")
ax.set_title("Styled Class Average")
ax.set_xlabel("Week"); ax.set_ylabel("Score")
fig.savefig("class_average.png", dpi=200, bbox_inches="tight")
print("\\nFigure saved to the browser's virtual filesystem as class_average.png")
plt.show()
`,
    widget: "chart-preview",
    observation: "One style call changes grid, fonts and colours across the whole figure — far more maintainable than styling each element.",
    takeaways: ["Set the style once at the top of a notebook", "dpi and bbox_inches decide export quality"],
    selfCheck: {
      question: "What does bbox_inches='tight' do in savefig?",
      options: ["Increases DPI", "Trims surrounding whitespace", "Compresses the file", "Adds a border"],
      answer: 1,
      explanation: "It crops the figure to its drawn content.",
    },
  },
  {
    id: "viz-pairplot",
    number: 35,
    unit: "unit-3",
    title: "Pair Plot Concepts",
    difficulty: "Advanced",
    minutes: 25,
    tags: ["Seaborn", "EDA"],
    objective: "Build a scatter-matrix to inspect every pairwise relationship at once.",
    outcomes: ["Construct a pair grid", "Read the diagonal", "Spot collinearity"],
    theory:
      "A pair plot draws a scatter for every pair of numeric columns with distributions on the diagonal — the fastest way to survey a dataset. With many columns it becomes unreadable, so restrict it to the variables you care about.",
    steps: ["Select three numeric columns", "Build the grid manually with subplots", "Read the diagonal and off-diagonal panels"],
    code: `import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    "Study_Hours": [4, 7, 5, 9, 3, 6, 8, 2, 10, 5],
    "Attendance": [80, 92, 88, 96, 68, 84, 90, 60, 98, 76],
    "Score": [65, 84, 72, 91, 58, 77, 86, 49, 95, 68],
})

cols = df.columns
fig, axes = plt.subplots(len(cols), len(cols), figsize=(8, 8))
for i, yc in enumerate(cols):
    for j, xc in enumerate(cols):
        ax = axes[i, j]
        if i == j:
            ax.hist(df[xc], bins=6, color="#2563eb", alpha=0.8)
        else:
            ax.scatter(df[xc], df[yc], s=22, color="#14b8a6")
        if i == len(cols) - 1:
            ax.set_xlabel(xc, fontsize=9)
        if j == 0:
            ax.set_ylabel(yc, fontsize=9)
        ax.tick_params(labelsize=7)

fig.suptitle("Pair Plot of Student Features")
plt.tight_layout()
plt.show()

print(df.corr().round(3))
`,
    widget: "chart-preview",
    observation: "All three variables move together; Study_Hours and Score are almost collinear, which matters when modelling.",
    takeaways: ["Diagonal = distribution, off-diagonal = relationship", "Limit to a handful of columns"],
    selfCheck: {
      question: "What is usually drawn on the diagonal of a pair plot?",
      options: ["Scatter of x vs x", "The distribution of that variable", "Nothing", "The correlation value"],
      answer: 1,
      explanation: "A histogram or KDE of the variable is shown, since x vs x is a useless straight line.",
    },
  },
  {
    id: "viz-interactive",
    number: 36,
    unit: "unit-3",
    title: "Interactive Data Visualization",
    difficulty: "Intermediate",
    minutes: 20,
    tags: ["Interactive", "Plotly"],
    objective: "Understand when interactivity adds value and generate the matching Python code.",
    outcomes: ["Compare static vs interactive", "Aggregate before plotting", "Export chart-ready data"],
    theory:
      "Interactive charts let a reader hover, zoom and filter — valuable for exploration and dashboards, unnecessary for a printed report. In this lab the chart is rendered by Plotly in the browser while the equivalent Matplotlib code is shown for your report.",
    steps: ["Aggregate scores per attendance band", "Print the tidy table Plotly consumes", "Compare with the static equivalent"],
    code: `import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya", "Elakiya", "Faizal", "Gowri", "Harish"],
    "Attendance": [80, 92, 88, 96, 68, 84, 90, 60],
    "Score": [65, 84, 72, 91, 58, 77, 86, 49],
})

df["Band"] = pd.cut(df["Attendance"], bins=[0, 70, 85, 100], labels=["<70%", "70-85%", ">85%"])
summary = df.groupby("Band", observed=True)["Score"].agg(["mean", "count"]).round(1)
print("Chart-ready data:\\n", summary)
print("\\nGap between highest and lowest band:", round(summary['mean'].max() - summary['mean'].min(), 1), "marks")
`,
    widget: "chart-preview",
    observation: "Aggregate first, plot second — interactive charts built on raw rows quickly become unreadable.",
    takeaways: ["Interactivity helps exploration, not printed reports", "Always aggregate to the level of your question"],
    selfCheck: {
      question: "When is interactivity least useful?",
      options: ["Exploratory analysis", "A printed report", "A dashboard", "A large dataset"],
      answer: 1,
      explanation: "Paper cannot be hovered or zoomed.",
    },
  },
  {
    id: "viz-3d",
    number: 37,
    unit: "unit-3",
    title: "3D Surface Visualization",
    difficulty: "Advanced",
    minutes: 25,
    tags: ["Matplotlib", "3D"],
    objective: "Render a 3D surface of predicted score against study hours and attendance.",
    outcomes: ["Build a meshgrid", "Plot a surface", "Judge when 3D helps"],
    theory:
      "A surface plot shows z = f(x, y) over a grid built with np.meshgrid. 3D is genuinely useful for smooth functions and response surfaces, but for scattered observations a heatmap or contour is usually clearer.",
    steps: ["Create the meshgrid", "Evaluate the model surface", "Plot with plot_surface", "Add a colourbar"],
    code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 12, 40)
attendance = np.linspace(50, 100, 40)
H, A = np.meshgrid(hours, attendance)

# A simple illustrative model of predicted score
Z = 20 + 3.2 * H + 0.45 * A - 0.12 * H ** 2

fig = plt.figure(figsize=(8, 5.5))
ax = fig.add_subplot(111, projection="3d")
surf = ax.plot_surface(H, A, Z, cmap="viridis", edgecolor="none", alpha=0.95)
ax.set_xlabel("Study Hours")
ax.set_ylabel("Attendance %")
ax.set_zlabel("Predicted Score")
ax.set_title("Predicted Score Surface")
fig.colorbar(surf, shrink=0.6, label="Score")
plt.show()
`,
    widget: "chart-preview",
    observation:
      "The surface rises with both inputs but flattens at high study hours — the negative quadratic term models diminishing returns.",
    takeaways: ["meshgrid builds the x/y grid for z = f(x, y)", "Prefer a contour/heatmap when 3D adds no insight"],
    selfCheck: {
      question: "What does np.meshgrid produce?",
      options: ["A 3D plot", "Coordinate matrices for a grid", "A random sample", "A DataFrame"],
      answer: 1,
      explanation: "It expands two 1D axes into two 2D coordinate matrices.",
    },
  },
];

export const experimentById = (id: string) => experiments.find((e) => e.id === id);
export const experimentsByUnit = (unit: string) => experiments.filter((e) => e.unit === unit);
