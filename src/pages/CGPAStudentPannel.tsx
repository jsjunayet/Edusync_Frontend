import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  getLocalStorage,
  getuserStorage,
} from "@/components/LocalStorage/LocalStorage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface StudentMark {
  studentId: string;
  studentName: string;
  semester: string;
  courseCode: string;
  courseName: string;
  credits: number;
  classTest1: number;
  classTest2: number;
  attendance: number;
  assessment: number;
  finalExam: number;
  totalMarks: number;
  gradePoint: number;
  letterGrade: string;
}

interface SemesterSummary {
  semester: string;
  courses: StudentMark[];
  totalCredits: number;
  totalGradePoints: number;
  gpa: number;
}

const CGPAStudentPanel = () => {
  // Get current user from auth state or localStorage
  const currentUser = getuserStorage("user");
  const currentUserId =
    currentUser?.studentId || currentUser?.id || "2025010001";

  const [selectedStudent, setSelectedStudent] = useState<string>(currentUserId);
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  // Mock students data
  const students = [
    { id: "2025010001", name: "Monjurul Hasan Asif" },
    { id: "2025010002", name: "Fatima Khan" },
    { id: "2025010003", name: "Muhammad Ali" },
    { id: "2025010004", name: "Aisha Ahmed" },
    { id: "2025010005", name: "Omar Hassan" },
    { id: "2025010006", name: "Zainab Ali" },
    { id: "2025010007", name: "Hassan Muhammad" },
    { id: "2025010008", name: "Khadija Omar" },
  ];

  useEffect(() => {
    const savedMarks = getLocalStorage("cgpa_student_marks");
    if (savedMarks) {
      try {
        setStudentMarks(JSON.parse(savedMarks));
      } catch (error) {
        console.error("Error parsing saved marks:", error);
        setStudentMarks([]);
      }
    }
  }, []);

  // Filter marks for selected student
  const studentData = studentMarks.filter(
    (mark) => mark.studentId === selectedStudent
  );

  // Academic semester mapping
  const academicSemesters = ["Autumn 2025", "Summer 2023", "Fall 2025"];

  // Calculate semester-wise summaries
  const semesterSummaries: SemesterSummary[] = [];
  academicSemesters.forEach((semesterName) => {
    const semesterCourses = studentData.filter(
      (mark) => mark.semester === semesterName
    );
    if (semesterCourses.length > 0) {
      const totalCredits = semesterCourses.reduce(
        (sum, course) => sum + course.credits,
        0
      );
      const totalGradePoints = semesterCourses.reduce(
        (sum, course) => sum + course.gradePoint * course.credits,
        0
      );
      const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      semesterSummaries.push({
        semester: semesterName,
        courses: semesterCourses,
        totalCredits,
        totalGradePoints,
        gpa,
      });
    }
  });

  // Calculate overall CGPA
  const totalCreditsAll = semesterSummaries.reduce(
    (sum, sem) => sum + sem.totalCredits,
    0
  );
  const totalGradePointsAll = semesterSummaries.reduce(
    (sum, sem) => sum + sem.totalGradePoints,
    0
  );
  const cgpa = totalCreditsAll > 0 ? totalGradePointsAll / totalCreditsAll : 0;

  // Get selected student name
  const selectedStudentName =
    students.find((s) => s.id === selectedStudent)?.name || "";

  // Filter data based on selected semester
  const displayData =
    selectedSemester === "all"
      ? semesterSummaries
      : semesterSummaries.filter((sem) => sem.semester === selectedSemester);

  // PDF Download function
  const downloadPDF = () => {
    const doc = new jsPDF();
    const selectedStudentName =
      students.find((s) => s.id === selectedStudent)?.name || "";

    // Header
    doc.setFontSize(20);
    doc.text("CGPA Report", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text(`Student: ${selectedStudentName} (${selectedStudent})`, 20, 40);
    doc.text(`Overall CGPA: ${cgpa.toFixed(2)}`, 20, 50);
    doc.text(`Total Credits: ${totalCreditsAll}`, 20, 60);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 70);

    let yPosition = 90;

    // Semester-wise details
    displayData.forEach((semesterData) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text(`${semesterData.semester}`, 20, yPosition);
      doc.setFontSize(12);
      doc.text(
        `GPA: ${semesterData.gpa.toFixed(2)} | Credits: ${
          semesterData.totalCredits
        }`,
        20,
        yPosition + 10
      );

      // Course table
      const tableData = semesterData.courses.map((course) => [
        course.courseCode,
        course.courseName,
        course.credits.toString(),
        course.totalMarks.toString(),
        course.letterGrade,
        course.gradePoint.toFixed(2),
      ]);

      autoTable(doc, {
        head: [
          [
            "Course Code",
            "Course Name",
            "Credits",
            "Total Marks",
            "Grade",
            "GPA",
          ],
        ],
        body: tableData,
        startY: yPosition + 20,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    });

    doc.save(
      `CGPA_Report_${selectedStudent}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const getGradeClass = (grade: string) => {
    if (grade === "F") return "bg-red-100 text-red-800";
    if (["A+", "A"].includes(grade)) return "bg-green-100 text-green-800";
    if (["A-", "B+", "B"].includes(grade)) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getCGPAClass = (cgpa: number) => {
    if (cgpa >= 3.75) return "text-green-600";
    if (cgpa >= 3.25) return "text-blue-600";
    if (cgpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Student CGPA Dashboard</h1>
          <Button onClick={downloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Student Selection and CGPA Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getCGPAClass(cgpa)}`}>
                  {cgpa.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Total Credits: {totalCreditsAll}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Semesters: {semesterSummaries.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge
                  variant="outline"
                  className={`text-lg py-2 px-4 ${
                    cgpa >= 3.75
                      ? "border-green-500 text-green-700"
                      : cgpa >= 3.25
                      ? "border-blue-500 text-blue-700"
                      : cgpa >= 2.5
                      ? "border-yellow-500 text-yellow-700"
                      : "border-red-500 text-red-700"
                  }`}
                >
                  {cgpa >= 3.75
                    ? "First Class"
                    : cgpa >= 3.25
                    ? "Second Class Upper"
                    : cgpa >= 2.5
                    ? "Second Class Lower"
                    : cgpa >= 2.0
                    ? "Third Class"
                    : "Fail"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {academicSemesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Semester-wise Results */}
        <div className="space-y-6">
          {displayData.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No marks found for {selectedStudentName}. Please contact
                  faculty to add your marks.
                </p>
              </CardContent>
            </Card>
          ) : (
            displayData.map((semesterData) => (
              <Card key={semesterData.semester}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{semesterData.semester}</CardTitle>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Semester GPA
                      </div>
                      <div
                        className={`text-2xl font-bold ${getCGPAClass(
                          semesterData.gpa
                        )}`}
                      >
                        {semesterData.gpa.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Credits: {semesterData.totalCredits}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>CT1</TableHead>
                        <TableHead>CT2</TableHead>
                        <TableHead>Best CT</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Final</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>GPA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterData.courses.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {course.courseCode}
                          </TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.classTest1}</TableCell>
                          <TableCell>{course.classTest2}</TableCell>
                          <TableCell className="font-medium">
                            {Math.max(course.classTest1, course.classTest2)}
                          </TableCell>
                          <TableCell>{course.attendance}</TableCell>
                          <TableCell>{course.assessment}</TableCell>
                          <TableCell>{course.finalExam}</TableCell>
                          <TableCell className="font-medium">
                            {course.totalMarks}/100
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getGradeClass(course.letterGrade)}
                            >
                              {course.letterGrade}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {course.gradePoint.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* CGPA Progress Summary */}
        {semesterSummaries.length > 0 && selectedSemester === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>CGPA Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Courses Completed</TableHead>
                    <TableHead>Semester Credits</TableHead>
                    <TableHead>Semester GPA</TableHead>
                    <TableHead>Cumulative Credits</TableHead>
                    <TableHead>Cumulative CGPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterSummaries.map((semData, index) => {
                    const cumulativeCredits = semesterSummaries
                      .slice(0, index + 1)
                      .reduce((sum, sem) => sum + sem.totalCredits, 0);
                    const cumulativeGradePoints = semesterSummaries
                      .slice(0, index + 1)
                      .reduce((sum, sem) => sum + sem.totalGradePoints, 0);
                    const cumulativeCGPA =
                      cumulativeCredits > 0
                        ? cumulativeGradePoints / cumulativeCredits
                        : 0;

                    return (
                      <TableRow key={semData.semester}>
                        <TableCell className="font-medium">
                          {semData.semester}
                        </TableCell>
                        <TableCell>{semData.courses.length}</TableCell>
                        <TableCell>{semData.totalCredits}</TableCell>
                        <TableCell className={getCGPAClass(semData.gpa)}>
                          {semData.gpa.toFixed(2)}
                        </TableCell>
                        <TableCell>{cumulativeCredits}</TableCell>
                        <TableCell
                          className={`font-bold ${getCGPAClass(
                            cumulativeCGPA
                          )}`}
                        >
                          {cumulativeCGPA.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CGPAStudentPanel;
