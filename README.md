# Lab Data Science

Build a Professional Interactive Data Science Virtual Laboratory

Create a complete, highly professional, modern, responsive Data Science Virtual Laboratory and Learning Platform for university students.

This should NOT look like a simple course website or static LMS.

The platform should function like an interactive virtual laboratory where students can:

Study concepts in a structured manner.

Understand theory with simple explanations and visual examples.

Perform experiments interactively.

Write and modify Python code.

Execute Python code completely in the browser.

Upload CSV files and analyze them locally.

Visualize outputs using interactive graphs.

Change parameters and immediately observe changes.

Practice through MCQs and concept checks.

Track their learning and experiment progress locally.

CRITICAL ARCHITECTURE REQUIREMENT

The entire application must be frontend-only.

Do NOT build:

Any backend server.

Node.js API endpoints.

Python backend.

FastAPI.

Flask.

Database server.

Authentication server.

Supabase dependency.

Firebase dependency.

Cloud functions.

Server-side code execution.

Everything must run inside the student's browser.

Recommended frontend architecture

Use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide icons

Pyodide for in-browser Python execution

WebAssembly-based Python runtime

Web Worker for Python execution

Plotly.js for interactive visualizations

Monaco Editor or CodeMirror for the Python editor

localStorage or IndexedDB for progress persistence

Python code must execute locally in the browser using Pyodide.

Heavy Python execution must happen inside a Web Worker whenever possible so the main UI remains responsive.

The application must never send uploaded datasets or student code to a server.

Student CSV files should be processed entirely locally.

PRODUCT NAME

Use a professional name:

DS VirtualLab

Subtitle:

Interactive Data Science Learning & Experimentation Platform

Optional tagline:

Learn. Experiment. Visualize. Understand.

DESIGN DIRECTION

The UI must be extremely polished and suitable for a university-level academic platform.

Visual style:

Modern.

Clean.

Minimal.

Professional.

Premium academic technology platform.

Easy for beginners but powerful enough for experimentation.

Generous whitespace.

Excellent typography.

Clear visual hierarchy.

Responsive on desktop, tablet and mobile.

Dark mode and light mode.

Accessible colors and good contrast.

Avoid excessive gradients.

Avoid a childish design.

Avoid clutter.

Use a professional dashboard-style layout.

Desktop layout:

┌──────────────────────────────────────────────────────────────┐
│ Logo       Search       Course Progress        Theme/Profile │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│  Navigation   │              Main Learning Area              │
│               │                                              │
│  Dashboard    │                                              │
│  Syllabus     │                                              │
│  Learn        │                                              │
│  Experiments  │                                              │
│  Practice     │                                              │
│  Progress     │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘


Use a collapsible sidebar.

MAIN NAVIGATION

Create the following primary navigation:

Dashboard

Course Syllabus

Learn

Virtual Experiments

Data Playground

Visualization Studio

Practice & MCQs

Progress

COURSE INFORMATION

Course:

DATA SCIENCE

Course Code:

21CSS303T

The course structure should follow these syllabus units.

UNIT 1 — INTRODUCTION TO DATA SCIENCE, NUMPY AND PANDAS

Topics:

Introduction to Data Science

Include:

Facets of Data

Data Science Process

Interactive Data Science lifecycle

Create an interactive visual workflow:

Problem
   ↓
Data Collection
   ↓
Data Understanding
   ↓
Cleaning
   ↓
Exploration
   ↓
Feature Preparation
   ↓
Analysis / Modeling
   ↓
Visualization
   ↓
Insights


Each stage should be clickable.

When clicked, show:

What the stage means.

Why it is important.

Simple example.

Common mistakes.

Real-world application.

Use an easy example throughout the course such as:

Student Performance Dataset

Columns:

Student_ID
Study_Hours
Attendance
Previous_Marks
Assignment_Score
Final_Score


Reuse this dataset in multiple experiments so students understand how all concepts connect.

NumPy Learning Section

Create interactive lessons and experiments for:

What NumPy is.

Creating arrays.

Array attributes.

NumPy array objects.

Basic operations.

Array joining.

Array splitting.

Searching.

Sorting.

Indexing.

Slicing.

Iterating.

Copying arrays.

Array shape manipulation.

Identity array.

eye() function.

For every topic use the structure:

1. Learn

Short explanation.

2. Visualize

Show an animated or interactive representation.

For example, for a 2D array:

[[10, 20, 30],
 [40, 50, 60],
 [70, 80, 90]]


Allow students to click cells and see:

Array[row, column]


3. Experiment

Provide executable Python code.

Example:

import numpy as np

arr = np.array([[10, 20, 30],
                [40, 50, 60],
                [70, 80, 90]])

print("Array:")
print(arr)

print("\nShape:")
print(arr.shape)

print("\nSecond row:")
print(arr[1])


Include a Run Experiment button.

Display:

Standard output.

Errors.

Array visualization.

Shape.

Dimension.

Data type.

Allow students to modify the code and run it again.

PANDAS SECTION

Create detailed interactive experiments for:

Series.

DataFrames.

Index objects.

Reindexing.

Dropping entries.

Selecting entries.

Data alignment.

Ranking.

Sorting.

Summary statistics.

Index hierarchy.

Provide a dataset preview.

Example:

StudentStudy HoursAttendanceScoreArun48065Bala79284Charan58872Divya99691

Allow students to:

Select columns.

Filter rows.

Sort data.

Rank students.

Calculate mean.

Calculate median.

Calculate standard deviation.

Add derived columns.

Example experiment:

import pandas as pd

data = {
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Score": [65, 84, 72, 91]
}

df = pd.DataFrame(data)

print(df)
print("\nSummary Statistics:")
print(df.describe())

print("\nStudents ranked by Score:")
print(df.sort_values("Score", ascending=False))


Render DataFrames beautifully as interactive tables.

Do not display raw HTML tables with poor styling.

DATA ACQUISITION SECTION

Create a learning section covering:

Gathering information from different sources.

Web APIs.

Open Data Sources.

Web scraping concepts.

IMPORTANT:

Because this application is frontend-only, clearly handle browser limitations.

Do NOT pretend arbitrary web scraping can always work from the browser.

Explain that:

Some APIs may be blocked by CORS.

Some websites prevent browser-based scraping.

API keys must never be embedded in the frontend.

Demonstrations should use sample JSON, local files, or public CORS-enabled endpoints only.

Create an interactive API learning simulator where students can inspect:

{
  "student": "Arun",
  "attendance": 85,
  "score": 78
}


Show the transformation:

JSON API Response
       ↓
Python Dictionary
       ↓
Pandas DataFrame
       ↓
Analysis


Include a local JSON upload option.

UNIT 2 — DATA WRANGLING, DATA CLEANING AND PREPARATION

Create a complete learning module for:

Data Handling

Include:

Problems when handling large data.

General techniques for handling large volumes of data.

General programming practices for large datasets.

Create a visual comparison:

Raw Data
1,000,000 rows
       ↓
Memory Issues
Slow Processing
Missing Values
Duplicates
Inconsistent Formats
       ↓
Chunking / Filtering / Efficient Types
       ↓
Clean Analysis Dataset


Data Wrangling

Create experiments for:

Clean.

Transform.

Merge.

Reshape.

Combining datasets.

Merging on index.

Concatenate.

Combining with overlap.

Pivoting.

Create a visual DataFrame merge simulator.

Allow students to select:

Inner Join
Left Join
Right Join
Outer Join


Then visually show how rows from two datasets are combined.

Include executable code:

import pandas as pd

students = pd.DataFrame({
    "Student_ID": [1, 2, 3],
    "Name": ["Arun", "Bala", "Charan"]
})

scores = pd.DataFrame({
    "Student_ID": [1, 2, 4],
    "Score": [78, 92, 85]
})

result = pd.merge(
    students,
    scores,
    on="Student_ID",
    how="left"
)

print(result)


Allow the student to change the join type using a UI control and automatically update the visualization.

Data Cleaning and Preparation

Create interactive experiments for:

Missing data.

Data transformation.

String manipulation.

Summarizing.

Binning.

Classing / categorization.

Standardization.

Outliers.

Noise.

Anomalies.

Create a Data Cleaning Challenge.

Show students a dirty dataset containing:

Missing values.

Duplicate rows.

Invalid values.

Different date formats.

Inconsistent capitalization.

Outliers.

Example:

StudentHoursScoreArun575balanull82CHARAN6999Arun575

Students should choose operations such as:

Fill Missing Values
Drop Missing Values
Remove Duplicates
Normalize Text
Handle Outliers
Standardize Features


After every operation:

Show Before.

Show After.

Explain exactly what changed.

Explain why it matters.

INTERACTIVE OUTLIER EXPERIMENT

Create an interactive graph.

Generate sample data.

Display a scatter plot or box plot.

Provide a slider for the outlier threshold.

Example controls:

IQR Multiplier: [ 1.5 ]


As the slider changes:

Recalculate outliers.

Highlight detected outliers.

Update statistics.

Show the formula.

Use:

IQR = Q3 - Q1

Lower Bound = Q1 - 1.5 × IQR
Upper Bound = Q3 + 1.5 × IQR


Make the explanation intuitive.

STANDARDIZATION EXPERIMENT

Create a feature scaling experiment.

Allow students to compare:

Original Data
Min-Max Scaling
Z-Score Standardization


Display formulas:

Min-Max:

x' = (x - min(x)) / (max(x) - min(x))


Z-Score:

z = (x - μ) / σ


Show:

Original distribution.

Transformed distribution.

Mean.

Standard deviation.

Use interactive Plotly charts.

UNIT 3 — DATA VISUALIZATION

Create a powerful visualization module.

Topics:

Introduction to Matplotlib.

Plots.

Subplots.

Axes.

Ticks.

Labels.

Legends.

Annotations.

Saving plots.

Plot styles.

Seaborn concepts.

Line plots.

Scatter plots.

Bar plots.

Histograms.

Box plots.

Pair plots.

Text customization.

Styling.

Multiple plots.

3D surface plots.

VISUALIZATION STUDIO

Create a dedicated interactive page called:

Visualization Studio

Layout:

┌───────────────────────────────────────────────────────────┐
│ Dataset Source                                            │
│ [Sample Dataset] [Upload CSV]                            │
├───────────────┬───────────────────────────────────────────┤
│ Controls      │              Interactive Chart            │
│               │                                           │
│ Chart Type    │                                           │
│ X Column      │                                           │
│ Y Column      │                                           │
│ Color         │                                           │
│ Group         │                                           │
│ Title         │                                           │
│               │                                           │
└───────────────┴───────────────────────────────────────────┘


Allow students to choose:

Line chart.

Scatter plot.

Bar chart.

Histogram.

Box plot.

Pair plot style visualization.

Heatmap.

3D surface plot where feasible.

Controls:

Chart Type
X Axis
Y Axis
Color Group
Aggregation
Title
Show Legend
Show Grid
Marker Size


Charts must update interactively.

Use Plotly.

Provide a generated Python code panel corresponding to the student's selections.

Example:

import matplotlib.pyplot as plt

plt.scatter(
    df["Study_Hours"],
    df["Score"]
)

plt.xlabel("Study Hours")
plt.ylabel("Score")
plt.title("Study Hours vs Score")
plt.show()


Students should be able to copy the code into the experiment editor and modify it.

VIRTUAL EXPERIMENT ENGINE

Create a reusable experiment template.

Every experiment should have:

Experiment Title
↓
Objective
↓
Learning Outcomes
↓
Theory
↓
Algorithm / Steps
↓
Interactive Controls
↓
Python Code Editor
↓
Run Experiment
↓
Output
↓
Visualization
↓
Observation
↓
Key Takeaways
↓
Self Check


The experiment workspace should look professional:

┌───────────────────────────────────────────────────────────────┐
│ Experiment: Pandas Data Cleaning                              │
├───────────────────────────────┬───────────────────────────────┤
│ Instructions                  │ Python Editor                 │
│                               │                               │
│ Objective                     │ import pandas as pd           │
│ Theory                        │                               │
│ Steps                         │ df = ...                      │
│                               │                               │
│ [Hints]                       │                               │
│                               │        [Run Experiment]       │
├───────────────────────────────┴───────────────────────────────┤
│ Output / Error Console                                      │
├───────────────────────────────────────────────────────────────┤
│ Interactive Visualization                                    │
├───────────────────────────────────────────────────────────────┤
│ Observation and Explanation                                  │
└───────────────────────────────────────────────────────────────┘


PYTHON EXECUTION REQUIREMENTS

Use Pyodide.

The execution architecture should be:

flowchart LR
    A[Student Browser] --> B[React Application]
    B --> C[Code Editor]
    C --> D[Web Worker]
    D --> E[Pyodide / WebAssembly]
    E --> F[NumPy]
    E --> G[Pandas]
    E --> H[Matplotlib]
    E --> I[Python Output]
    I --> B
    B --> J[Interactive Plotly Visualization]
    B --> K[localStorage / IndexedDB]


The Pyodide runtime should be loaded lazily.

Do not load all heavy packages on the initial page load.

Suggested behavior:

Initial App Load
       ↓
Fast React UI
       ↓
Student opens an experiment
       ↓
Load Pyodide only when needed
       ↓
Show "Preparing Python Lab..."
       ↓
Initialize Web Worker
       ↓
Load required Python packages
       ↓
Ready


Cache the initialized runtime when practical.

Show a proper loading state.

CODE EXECUTION UX

The code editor must include:

Syntax highlighting.

Line numbers.

Run button.

Reset button.

Restore original code.

Copy code.

Clear output.

Loading indicator.

Execution timer.

Error display.

When Python fails, do not show only a raw technical stack trace.

Show:

Something went wrong

Line 8:
KeyError: 'Score'

Possible reason:
The selected DataFrame does not contain a column named "Score".

Suggestions:
• Check available column names.
• Verify capitalization.
• Use df.columns to inspect columns.


Also provide an expandable section:

View Technical Error


for advanced students.

DATA PLAYGROUND

Create a page where students can upload their own CSV file.

Everything must remain inside the browser.

Features:

Drag and drop CSV.

File information.

Dataset preview.

Number of rows.

Number of columns.

Column names.

Data types.

Missing values.

Duplicate rows.

Summary statistics.

Display a professional data profile dashboard.

Example:

Dataset: student_performance.csv

Rows: 1,250
Columns: 8
Missing Values: 34
Duplicates: 5
Memory Usage: 78 KB


Create interactive operations:

Select columns.

Filter.

Sort.

Missing value handling.

Drop duplicates.

Rename columns.

Group by.

Summary statistics.

Basic visualization.

Include a clear privacy message:

Your data stays in your browser and is never uploaded to a server.

LEARNING MODE

Each topic should have a visually structured learning experience.

Use:

Concept

Short explanation.

Why it matters

Real-world reason.

Easy Example

Use a simple student dataset.

Interactive Demo

Allow changing values.

Try it Yourself

Executable experiment.

Common Mistakes

Show common student errors.

Key Takeaway

Short summary.

Example:

Concept

A Pandas DataFrame is useful for working with tabular data.

Easy Example

A marks spreadsheet can be represented as a DataFrame.

Try it Yourself

Allow the student to add a new column:

df["Performance"] = df["Score"].apply(
    lambda x: "Good" if x >= 75 else "Needs Improvement"
)


PRACTICE AND MCQ SECTION

Create interactive quizzes for every unit.

Question types:

Multiple choice.

Multiple select.

Predict the output.

Find the error.

Arrange the steps.

Complete the Python code.

Example:

What will be the shape of:

np.zeros((3, 4))

A. (4, 3)
B. (3, 4)
C. 12
D. Error


After submission:

Show correct/incorrect.

Explain why.

Explain why the other options are wrong.

Link to the relevant lesson.

Do not make the quiz UI look basic.

Show:

Question 3 of 10

██████████░░░░░░░░░░ 30%


At completion show:

Score: 8 / 10
Accuracy: 80%
Strong Areas
Areas to Review
Recommended Next Topic


Store results locally.

PROGRESS TRACKING

Create a professional student dashboard.

Show:

Course Progress: 42%


Then:

Unit 1     ████████████████░░░░ 75%
Unit 2     ██████░░░░░░░░░░░░░░ 30%
Unit 3     ██░░░░░░░░░░░░░░░░░░ 10%


Track:

Lessons completed.

Experiments completed.

Quizzes completed.

Quiz accuracy.

Time spent in labs.

Recently opened experiments.

Use localStorage or IndexedDB only.

No login required.

EXPERIMENT CATALOG

Create experiment cards for at least these areas.

Unit 1

Creating NumPy Arrays

Array Attributes and Operations

Indexing and Slicing

Joining and Splitting Arrays

Searching and Sorting

Array Shape Manipulation

Identity Matrix and eye()

Pandas Series

Pandas DataFrames

Selection and Indexing

Ranking and Sorting

Summary Statistics

Data Acquisition Concepts

Unit 2

Handling Missing Values

Removing Duplicates

Data Transformation

String Cleaning

Merging Datasets

Concatenating DataFrames

Reshaping Data

Pivot Tables

Binning and Categorization

Standardization

Outlier Detection

Noise and Anomaly Exploration

Unit 3

Line Plot

Scatter Plot

Bar Plot

Histogram

Box Plot

Multiple Subplots

Labels and Legends

Plot Annotations

Advanced Styling

Pair Plot Concepts

Interactive Data Visualization

3D Surface Visualization

Each experiment card should display:

Experiment Number
Title
Difficulty
Estimated Time
Concept Tags
Completion Status


Example:

Experiment 14

Handling Missing Values

Intermediate
20 minutes

[Pandas] [Data Cleaning]

[Start Experiment →]


DASHBOARD

Create a premium landing dashboard.

Top section:

Good Morning 👋

Continue your Data Science learning journey.


Show:

Overall course progress.

Continue learning card.

Recent experiment.

Unit progress.

Recommended experiment.

Quiz performance.

Quick access to Data Playground.

Add a visually appealing:

Continue Where You Left Off

section.

FRONTEND FILE STRUCTURE

Organize the project cleanly.

Suggested structure:

src/
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── syllabus/
│   ├── experiments/
│   ├── editor/
│   ├── visualization/
│   ├── quizzes/
│   └── ui/
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Syllabus.tsx
│   ├── Learn.tsx
│   ├── Experiments.tsx
│   ├── ExperimentWorkspace.tsx
│   ├── DataPlayground.tsx
│   ├── VisualizationStudio.tsx
│   ├── Practice.tsx
│   └── Progress.tsx
│
├── data/
│   ├── syllabus.ts
│   ├── experiments.ts
│   ├── quizzes.ts
│   └── datasets.ts
│
├── hooks/
│   ├── usePyodide.ts
│   ├── useExperimentProgress.ts
│   └── useLocalStorage.ts
│
├── workers/
│   └── pythonWorker.ts
│
├── services/
│   ├── pyodideService.ts
│   └── localStorageService.ts
│
└── utils/


EXAMPLE PYODIDE EXECUTION SERVICE

Implement the architecture approximately like this:

let pyodideInstance: any = null;

export async function initializePython() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  const { loadPyodide } = await import("pyodide");

  pyodideInstance = await loadPyodide();

  await pyodideInstance.loadPackage([
    "numpy",
    "pandas",
    "matplotlib"
  ]);

  return pyodideInstance;
}

export async function executePython(code: string) {
  const pyodide = await initializePython();

  try {
    const result = await pyodide.runPythonAsync(code);

    return {
      success: true,
      output: String(result ?? "")
    };
  } catch (error) {
    return {
      success: false,
      error: String(error)
    };
  }
}


Improve this implementation where necessary for proper frontend performance and isolation.

Prefer Web Worker-based execution for the actual production implementation.

EXAMPLE LOCAL PROGRESS STORAGE

Use browser storage.

Example:

interface StudentProgress {
  completedLessons: string[];
  completedExperiments: string[];
  quizScores: Record<string, number>;
  lastOpenedExperiment?: string;
}

export function saveProgress(progress: StudentProgress) {
  localStorage.setItem(
    "ds-virtual-lab-progress",
    JSON.stringify(progress)
  );
}

export function loadProgress(): StudentProgress {
  const saved = localStorage.getItem(
    "ds-virtual-lab-progress"
  );

  return saved
    ? JSON.parse(saved)
    : {
        completedLessons: [],
        completedExperiments: [],
        quizScores: {}
      };
}


IMPORTANT PERFORMANCE REQUIREMENTS

The website must remain fast.

Requirements:

Do not initialize Pyodide on the first page unless necessary.

Lazy load heavy components.

Use React code splitting.

Run Python execution outside the main UI thread when possible.

Limit unnecessarily large datasets.

Show progress while Python packages initialize.

Avoid reloading the Python runtime for every experiment.

Use Plotly only where interactive visualization adds value.

Keep static educational content lightweight.

Store only necessary progress information locally.

FAILURE HANDLING

Handle these cases professionally:

Python runtime loading failure

Show:

Python Lab could not be initialized.

Please refresh the page and try again.


With:

[Retry]


Package loading failure

Show the package that failed and provide retry.

CSV parsing failure

Explain:

Invalid CSV.

Unsupported encoding.

Malformed rows.

Large file warning

For very large files:

This dataset may affect browser performance.

Rows detected: XXXXX

[Continue] [Cancel]


CORS/API limitation

Clearly explain that some external APIs cannot be accessed directly because this is a browser-only lab.

Never silently fail.

SECURITY AND PRIVACY

Since this is frontend-only:

Never expose API keys.

Never ask students for secret credentials.

Never send datasets to an external server.

Sanitize any rendered HTML.

Do not use dangerouslySetInnerHTML for student-generated content unless properly sanitized.

Keep uploaded datasets entirely in memory or browser storage.

Clearly state that Python execution happens locally in the browser.

RESPONSIVENESS

Desktop should provide the full lab experience.

Tablet should remain usable.

Mobile should support:

Learning content.

Quizzes.

Progress.

Basic experiment viewing.

For code editing on mobile, provide an optimized experience or horizontal workspace handling.

Do not simply shrink the desktop layout.

EMPTY AND LOADING STATES

Create polished states for:

No experiment selected.

No CSV uploaded.

Python runtime loading.

Experiment executing.

No quiz attempts.

No recent activity.

No search results.

Use skeleton loaders where appropriate.

SEARCH

Add global search.

Students should be able to search:

Concepts.

Lessons.

Experiments.

NumPy topics.

Pandas topics.

Visualization topics.

Example:

Search "missing values"


Should return:

Lesson.

Relevant experiment.

Quiz questions.

Related concepts.

FINAL QUALITY REQUIREMENT

This must feel like a real production-ready university virtual laboratory.

Do not generate a simple landing page with placeholder cards.

Build actual interactive functionality.

At minimum, the first version must have fully working:

Dashboard.

Course syllabus.

Unit-based learning pages.

Interactive NumPy demonstrations.

Interactive Pandas demonstrations.

CSV upload and local analysis.

Python code editor.

In-browser Python execution architecture.

Missing value experiment.

Data merge experiment.

Outlier detection experiment.

Standardization experiment.

Visualization Studio.

Interactive charts.

MCQ system.

Local progress tracking.

Use realistic sample datasets.

Do not use lorem ipsum.

All content must be meaningful and educational.

Use the student performance dataset as the consistent easy-to-understand example across the platform wherever possible.

The final application should answer this student journey:

"I don't understand the concept"
            ↓
Learn it visually
            ↓
See a simple example
            ↓
Run the provided experiment
            ↓
Modify the code
            ↓
Observe what changes
            ↓
Visualize the result
            ↓
Test myself
            ↓
Track my progress


Make the website visually impressive, technically functional, clean, highly intuitive, and suitable for a professional university Data Science Virtual Lab.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8f935bc0-2f83-4596-b3cc-92bdc010faaf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
