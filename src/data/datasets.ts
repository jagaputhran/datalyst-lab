export interface StudentRow {
  Student_ID: number;
  Student: string;
  Study_Hours: number;
  Attendance: number;
  Previous_Marks: number;
  Assignment_Score: number;
  Final_Score: number;
}

/** The single consistent teaching dataset used across the whole platform. */
export const studentPerformance: StudentRow[] = [
  { Student_ID: 1, Student: "Arun", Study_Hours: 4, Attendance: 80, Previous_Marks: 62, Assignment_Score: 70, Final_Score: 65 },
  { Student_ID: 2, Student: "Bala", Study_Hours: 7, Attendance: 92, Previous_Marks: 80, Assignment_Score: 88, Final_Score: 84 },
  { Student_ID: 3, Student: "Charan", Study_Hours: 5, Attendance: 88, Previous_Marks: 70, Assignment_Score: 75, Final_Score: 72 },
  { Student_ID: 4, Student: "Divya", Study_Hours: 9, Attendance: 96, Previous_Marks: 88, Assignment_Score: 94, Final_Score: 91 },
  { Student_ID: 5, Student: "Elakiya", Study_Hours: 3, Attendance: 68, Previous_Marks: 55, Assignment_Score: 60, Final_Score: 58 },
  { Student_ID: 6, Student: "Faizal", Study_Hours: 6, Attendance: 84, Previous_Marks: 74, Assignment_Score: 80, Final_Score: 77 },
  { Student_ID: 7, Student: "Gowri", Study_Hours: 8, Attendance: 90, Previous_Marks: 82, Assignment_Score: 86, Final_Score: 86 },
  { Student_ID: 8, Student: "Harish", Study_Hours: 2, Attendance: 60, Previous_Marks: 48, Assignment_Score: 52, Final_Score: 49 },
  { Student_ID: 9, Student: "Iniya", Study_Hours: 10, Attendance: 98, Previous_Marks: 92, Assignment_Score: 96, Final_Score: 95 },
  { Student_ID: 10, Student: "Jeyanth", Study_Hours: 5, Attendance: 76, Previous_Marks: 66, Assignment_Score: 68, Final_Score: 68 },
  { Student_ID: 11, Student: "Kavya", Study_Hours: 7, Attendance: 86, Previous_Marks: 78, Assignment_Score: 82, Final_Score: 81 },
  { Student_ID: 12, Student: "Lokesh", Study_Hours: 1, Attendance: 52, Previous_Marks: 40, Assignment_Score: 45, Final_Score: 41 },
  { Student_ID: 13, Student: "Meena", Study_Hours: 6, Attendance: 82, Previous_Marks: 72, Assignment_Score: 79, Final_Score: 75 },
  { Student_ID: 14, Student: "Naveen", Study_Hours: 8, Attendance: 94, Previous_Marks: 85, Assignment_Score: 90, Final_Score: 88 },
  { Student_ID: 15, Student: "Oviya", Study_Hours: 4, Attendance: 74, Previous_Marks: 60, Assignment_Score: 66, Final_Score: 63 },
  { Student_ID: 16, Student: "Pranav", Study_Hours: 12, Attendance: 99, Previous_Marks: 95, Assignment_Score: 98, Final_Score: 97 },
  { Student_ID: 17, Student: "Ramya", Study_Hours: 5, Attendance: 78, Previous_Marks: 68, Assignment_Score: 71, Final_Score: 70 },
  { Student_ID: 18, Student: "Suresh", Study_Hours: 3, Attendance: 64, Previous_Marks: 52, Assignment_Score: 58, Final_Score: 54 },
  { Student_ID: 19, Student: "Tharun", Study_Hours: 9, Attendance: 91, Previous_Marks: 86, Assignment_Score: 89, Final_Score: 89 },
  { Student_ID: 20, Student: "Uma", Study_Hours: 6, Attendance: 83, Previous_Marks: 73, Assignment_Score: 77, Final_Score: 76 },
];

export const smallStudentTable = studentPerformance.slice(0, 4).map((r) => ({
  Student: r.Student,
  Study_Hours: r.Study_Hours,
  Attendance: r.Attendance,
  Score: r.Final_Score,
}));

/** Deliberately dirty dataset used in the Data Cleaning Challenge. */
export interface DirtyRow {
  Student: string;
  Hours: number | null;
  Score: number | null;
  Joined: string;
}

export const dirtyDataset: DirtyRow[] = [
  { Student: "Arun", Hours: 5, Score: 75, Joined: "2024-01-15" },
  { Student: "bala", Hours: null, Score: 82, Joined: "15/02/2024" },
  { Student: "CHARAN", Hours: 6, Score: 999, Joined: "2024-03-01" },
  { Student: "Arun", Hours: 5, Score: 75, Joined: "2024-01-15" },
  { Student: " divya ", Hours: 9, Score: null, Joined: "March 4, 2024" },
  { Student: "Elakiya", Hours: 3, Score: 58, Joined: "2024-02-20" },
];

export const apiSampleJson = {
  student: "Arun",
  attendance: 85,
  score: 78,
};

export const sampleCsv = [
  "Student_ID,Student,Study_Hours,Attendance,Previous_Marks,Assignment_Score,Final_Score",
  ...studentPerformance.map((r) =>
    [
      r.Student_ID,
      r.Student,
      r.Study_Hours,
      r.Attendance,
      r.Previous_Marks,
      r.Assignment_Score,
      r.Final_Score,
    ].join(","),
  ),
].join("\n");

export const pyStudentDataFrame = `import pandas as pd

data = {
    "Student": ["Arun", "Bala", "Charan", "Divya"],
    "Study_Hours": [4, 7, 5, 9],
    "Attendance": [80, 92, 88, 96],
    "Score": [65, 84, 72, 91],
}

df = pd.DataFrame(data)
`;
