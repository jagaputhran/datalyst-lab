export const COURSE = {
  name: "DATA SCIENCE",
  code: "21CSS303T",
  product: "DS VirtualLab",
  subtitle: "Interactive Data Science Learning & Experimentation Platform",
  tagline: "Learn. Experiment. Visualize. Understand.",
};

export interface SyllabusUnit {
  id: "unit-1" | "unit-2" | "unit-3";
  number: number;
  title: string;
  summary: string;
  hours: number;
  sections: { title: string; topics: string[] }[];
  outcomes: string[];
}

export const units: SyllabusUnit[] = [
  {
    id: "unit-1",
    number: 1,
    title: "Introduction to Data Science, NumPy and Pandas",
    summary:
      "Understand what data science is, the facets of data and the end-to-end data science process, then build practical skill with NumPy arrays and Pandas Series/DataFrames.",
    hours: 15,
    sections: [
      {
        title: "Introduction to Data Science",
        topics: ["Facets of Data", "Data Science Process", "Data Science Lifecycle"],
      },
      {
        title: "NumPy",
        topics: [
          "What NumPy is",
          "Creating arrays",
          "Array attributes",
          "Array objects",
          "Basic operations",
          "Joining arrays",
          "Splitting arrays",
          "Searching",
          "Sorting",
          "Indexing",
          "Slicing",
          "Iterating",
          "Copy vs view",
          "Shape manipulation",
          "Identity array and eye()",
        ],
      },
      {
        title: "Pandas",
        topics: [
          "Series",
          "DataFrames",
          "Index objects",
          "Reindexing",
          "Dropping entries",
          "Selecting entries",
          "Data alignment",
          "Ranking",
          "Sorting",
          "Summary statistics",
          "Index hierarchy",
        ],
      },
      {
        title: "Data Acquisition",
        topics: ["Gathering information", "Web APIs", "Open data sources", "Web scraping concepts"],
      },
    ],
    outcomes: [
      "Explain the data science lifecycle with a real dataset",
      "Create, index, slice and reshape NumPy arrays confidently",
      "Build and analyse Pandas Series and DataFrames",
      "Describe how data is acquired from APIs and open data sources",
    ],
  },
  {
    id: "unit-2",
    number: 2,
    title: "Data Wrangling, Data Cleaning and Preparation",
    summary:
      "Handle large volumes of data efficiently, then clean, transform, merge and reshape messy datasets into analysis-ready tables.",
    hours: 15,
    sections: [
      {
        title: "Data Handling",
        topics: [
          "Problems with large data",
          "Techniques for large volumes",
          "Programming practices for big datasets",
        ],
      },
      {
        title: "Data Wrangling",
        topics: [
          "Clean",
          "Transform",
          "Merge",
          "Reshape",
          "Combining datasets",
          "Merging on index",
          "Concatenation",
          "Combining with overlap",
          "Pivoting",
        ],
      },
      {
        title: "Data Cleaning and Preparation",
        topics: [
          "Missing data",
          "Data transformation",
          "String manipulation",
          "Summarizing",
          "Binning and classing",
          "Standardization",
          "Outliers",
          "Noise and anomalies",
        ],
      },
    ],
    outcomes: [
      "Diagnose data quality issues in a raw dataset",
      "Merge, concatenate and reshape multiple tables",
      "Apply binning, standardization and outlier treatment correctly",
      "Justify each cleaning decision with evidence",
    ],
  },
  {
    id: "unit-3",
    number: 3,
    title: "Data Visualization",
    summary:
      "Communicate results with Matplotlib and Seaborn style plots — from basic line and scatter plots to subplots, annotations, styling and 3D surfaces.",
    hours: 15,
    sections: [
      {
        title: "Matplotlib",
        topics: [
          "Introduction to Matplotlib",
          "Plots",
          "Subplots",
          "Axes",
          "Ticks",
          "Labels",
          "Legends",
          "Annotations",
          "Saving plots",
          "Plot styles",
        ],
      },
      {
        title: "Seaborn and chart types",
        topics: [
          "Line plots",
          "Scatter plots",
          "Bar plots",
          "Histograms",
          "Box plots",
          "Pair plots",
          "Heatmaps",
        ],
      },
      {
        title: "Advanced visualization",
        topics: ["Text customization", "Styling", "Multiple plots", "3D surface plots"],
      },
    ],
    outcomes: [
      "Choose the right chart for a question",
      "Compose multi-panel figures with labels, legends and annotations",
      "Style plots to a publication standard",
      "Build interactive visualizations of a dataset",
    ],
  },
];

export interface LifecycleStage {
  id: string;
  title: string;
  meaning: string;
  importance: string;
  example: string;
  mistakes: string[];
  realWorld: string;
}

export const lifecycleStages: LifecycleStage[] = [
  {
    id: "problem",
    title: "Problem",
    meaning:
      "State the question you want to answer in one sentence, with a measurable target and a decision it will support.",
    importance:
      "Every later step — which columns you collect, which chart you draw — is decided by the question. A vague question produces an unusable analysis.",
    example:
      "\"Which factors best explain a student's Final_Score so the department can plan mentoring?\"",
    mistakes: [
      "Starting with a dataset instead of a question",
      "Asking something the available data cannot answer",
      "No definition of success (\"improve results\" is not measurable)",
    ],
    realWorld:
      "A university academic committee wants to identify at-risk students before the semester ends.",
  },
  {
    id: "collection",
    title: "Data Collection",
    meaning:
      "Gather the raw data from sources: internal databases, CSV exports, web APIs, open data portals or surveys.",
    importance: "The ceiling of your analysis is the quality and coverage of the data you collect.",
    example:
      "Export attendance from the ERP, marks from the exam cell, and assignment scores from the LMS, then join them on Student_ID.",
    mistakes: [
      "Collecting only students who passed (survivorship bias)",
      "Ignoring the licence/consent under which data may be used",
      "Not recording when and how the data was captured",
    ],
    realWorld: "A retail chain pulls point-of-sale transactions nightly into a central warehouse.",
  },
  {
    id: "understanding",
    title: "Data Understanding",
    meaning:
      "Inspect shape, column types, ranges and missingness before touching anything: df.shape, df.info(), df.describe().",
    importance: "You cannot clean what you have not measured. This step tells you what is broken.",
    example:
      "20 rows, 7 columns; Attendance ranges 52–99; Final_Score has no nulls; Study_Hours is an integer.",
    mistakes: [
      "Jumping straight to modelling",
      "Assuming column names mean what they sound like",
      "Missing that a numeric column was read as text",
    ],
    realWorld: "A bank profiles a new data feed before onboarding it into its risk pipeline.",
  },
  {
    id: "cleaning",
    title: "Cleaning",
    meaning:
      "Fix missing values, duplicates, inconsistent text, wrong types, impossible values and outliers.",
    importance: "Roughly 60–80% of real project time. Dirty inputs silently corrupt every result.",
    example:
      "'CHARAN', 'bala' and ' divya ' become title-case names; a Score of 999 is flagged as invalid; one duplicated row is dropped.",
    mistakes: [
      "Filling every gap with 0",
      "Deleting rows without checking how many you lose",
      "Removing outliers that are genuine signal",
    ],
    realWorld: "A hospital deduplicates patient records merged from two systems.",
  },
  {
    id: "exploration",
    title: "Exploration",
    meaning:
      "Explore distributions and relationships with summary statistics and plots (EDA) to form hypotheses.",
    importance: "Exploration is where insight is born; it tells you which features matter.",
    example:
      "A scatter of Study_Hours vs Final_Score shows a strong positive relationship (correlation ≈ 0.98).",
    mistakes: [
      "Reading correlation as causation",
      "Only looking at means and ignoring spread",
      "Not plotting the data at all",
    ],
    realWorld: "A streaming service explores which watch-time patterns precede cancellations.",
  },
  {
    id: "features",
    title: "Feature Preparation",
    meaning:
      "Create, encode, bin and scale variables so the analysis or model can use them: Min-Max, Z-score, one-hot encoding, derived ratios.",
    importance:
      "Well-prepared features often improve results more than a more complex algorithm would.",
    example:
      "Add Performance = 'Good' if Final_Score >= 75 else 'Needs Improvement', and standardize Study_Hours.",
    mistakes: [
      "Scaling using statistics computed on the test set (leakage)",
      "Encoding categories as 1, 2, 3 and implying an order",
      "Creating a feature that leaks the answer",
    ],
    realWorld: "A credit scorer bins income into brackets to keep the model stable and explainable.",
  },
  {
    id: "analysis",
    title: "Analysis / Modeling",
    meaning:
      "Answer the question — with statistics, grouping and comparisons, or with a predictive model.",
    importance: "This is the step that turns prepared data into an answer.",
    example:
      "Group by Performance and compare mean Attendance; or fit a regression of Final_Score on Study_Hours and Attendance.",
    mistakes: [
      "Evaluating on the training data",
      "Choosing a complex model when a simple summary would do",
      "Ignoring the baseline",
    ],
    realWorld: "A logistics team forecasts next week's parcel volume per hub.",
  },
  {
    id: "visualization",
    title: "Visualization",
    meaning: "Present the finding in the clearest possible chart, with honest axes and clear labels.",
    importance: "A result nobody understands changes nothing. Charts are the delivery mechanism.",
    example:
      "A bar chart of average Final_Score by attendance band, annotated with the number of students per band.",
    mistakes: [
      "Truncated y-axes that exaggerate differences",
      "Pie charts with twelve slices",
      "No axis labels or units",
    ],
    realWorld: "An executive dashboard tracks weekly KPIs for the leadership team.",
  },
  {
    id: "insights",
    title: "Insights",
    meaning:
      "Translate results into a decision and communicate limitations and next steps to stakeholders.",
    importance: "The project only creates value when someone acts on it.",
    example:
      "\"Students below 70% attendance average 22 marks lower. Start mentoring at week 6 for that group.\"",
    mistakes: [
      "Reporting metrics without a recommendation",
      "Hiding uncertainty and sample size",
      "Over-claiming from a small dataset",
    ],
    realWorld: "A product team ships a change after an A/B test and monitors the effect.",
  },
];

export const facetsOfData = [
  {
    title: "Structured",
    text: "Rows and columns with a fixed schema — the student marks table, SQL tables, spreadsheets.",
  },
  {
    title: "Unstructured",
    text: "Free-form content with no schema — student feedback text, photographs, audio recordings.",
  },
  {
    title: "Natural language",
    text: "Text meant for humans; needs tokenisation and language models to become analysable.",
  },
  {
    title: "Machine-generated",
    text: "High-volume logs and sensor readings produced automatically, e.g. LMS click logs.",
  },
  {
    title: "Graph-based",
    text: "Data about relationships — who studies with whom, citation networks, social graphs.",
  },
  {
    title: "Streaming",
    text: "Data arriving continuously that must be processed as it flows, e.g. live attendance scans.",
  },
];
