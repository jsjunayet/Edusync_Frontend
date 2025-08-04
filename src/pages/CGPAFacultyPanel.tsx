import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/components/LocalStorage/LocalStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "@/hooks/use-toast";
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

interface Course {
  code: string;
  name: string;
  credits: number;
  semester: string;
}

const CGPAFacultyPanel = () => {
  // Academic semester mapping
  const academicSemesters = ["Autumn 2025", "Summer 2025", "Fall 2025"];

  const [selectedSemester, setSelectedSemester] =
    useState<string>("Autumn 2025");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [marks, setMarks] = useState({
    classTest1: "",
    classTest2: "",
    attendance: "",
    assessment: "",
    finalExam: "",
  });
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);

  // Mock data - in real app this would come from a database
  const courses: Course[] = [
    // Fall 2022
    {
      code: "CSE101",
      name: "Programming Fundamentals",
      credits: 3,
      semester: "Autumn 2025",
    },
    // {
    //   code: "CSE102",
    //   name: "Computer Fundamentals",
    //   credits: 3,
    //   semester: "Fall 2022",
    // },
    // { code: "MATH101", name: "Calculus I", credits: 3, semester: "Fall 2022" },
    // { code: "PHY101", name: "Physics I", credits: 3, semester: "Fall 2022" },
    // { code: "ENG101", name: "English I", credits: 3, semester: "Fall 2022" },

    // Spring 2023
    {
      code: "CSE201",
      name: "Object Oriented Programming",
      credits: 3,
      semester: "Summer 2025",
    },
    // {
    //   code: "CSE202",
    //   name: "Data Structures",
    //   credits: 3,
    //   semester: "Spring 2023",
    // },
    // {
    //   code: "MATH201",
    //   name: "Calculus II",
    //   credits: 3,
    //   semester: "Spring 2023",
    // },
    // { code: "PHY201", name: "Physics II", credits: 3, semester: "Spring 2023" },
    // { code: "ENG201", name: "English II", credits: 3, semester: "Spring 2023" },

    // Summer 2023
    // { code: "CSE301", name: "Algorithms", credits: 3, semester: "Summer 2023" },
    {
      code: "CSE302",
      name: "Database Systems",
      credits: 3,
      semester: "Fall 2025",
    },
    // {
    //   code: "CSE303",
    //   name: "Digital Logic Design",
    //   credits: 3,
    //   semester: "Summer 2023",
    // },
    // {
    //   code: "MATH301",
    //   name: "Discrete Mathematics",
    //   credits: 3,
    //   semester: "Summer 2023",
    // },
    // {
    //   code: "STAT301",
    //   name: "Statistics",
    //   credits: 3,
    //   semester: "Summer 2023",
    // },

    // Fall 2023
    // {
    //   code: "CSE401",
    //   name: "Software Engineering",
    //   credits: 3,
    //   semester: "Fall 2023",
    // },
    // {
    //   code: "CSE402",
    //   name: "Computer Networks",
    //   credits: 3,
    //   semester: "Fall 2023",
    // },
    // {
    //   code: "CSE403",
    //   name: "Operating Systems",
    //   credits: 3,
    //   semester: "Fall 2023",
    // },
    // {
    //   code: "CSE404",
    //   name: "Web Technology",
    //   credits: 3,
    //   semester: "Fall 2023",
    // },
    // {
    //   code: "MATH401",
    //   name: "Linear Algebra",
    //   credits: 3,
    //   semester: "Fall 2023",
    // },

    // Spring 2024
    // {
    //   code: "CSE501",
    //   name: "Computer Graphics",
    //   credits: 3,
    //   semester: "Spring 2024",
    // },
    // {
    //   code: "CSE502",
    //   name: "Artificial Intelligence",
    //   credits: 3,
    //   semester: "Spring 2024",
    // },
    // {
    //   code: "CSE503",
    //   name: "Human Computer Interaction",
    //   credits: 3,
    //   semester: "Spring 2024",
    // },
    // {
    //   code: "CSE504",
    //   name: "Mobile Application Development",
    //   credits: 3,
    //   semester: "Spring 2024",
    // },
    // {
    //   code: "CSE505",
    //   name: "System Analysis & Design",
    //   credits: 2,
    //   semester: "Spring 2024",
    // },

    // Summer 2024
    // {
    //   code: "CSE601",
    //   name: "Machine Learning",
    //   credits: 3,
    //   semester: "Summer 2024",
    // },
    // {
    //   code: "CSE602",
    //   name: "Data Mining",
    //   credits: 3,
    //   semester: "Summer 2024",
    // },
    // {
    //   code: "CSE603",
    //   name: "Computer Security",
    //   credits: 3,
    //   semester: "Summer 2024",
    // },
    // {
    //   code: "CSE604",
    //   name: "Project Management",
    //   credits: 3,
    //   semester: "Summer 2024",
    // },
    // { code: "CSE605", name: "Internship", credits: 2, semester: "Summer 2024" },

    // Fall 2024
    // {
    //   code: "CSE701",
    //   name: "Distributed Systems",
    //   credits: 3,
    //   semester: "Fall 2024",
    // },
    // {
    //   code: "CSE702",
    //   name: "Cloud Computing",
    //   credits: 3,
    //   semester: "Fall 2024",
    // },
    // {
    //   code: "CSE703",
    //   name: "Blockchain Technology",
    //   credits: 3,
    //   semester: "Fall 2024",
    // },
    // {
    //   code: "CSE704",
    //   name: "Capstone Project I",
    //   credits: 3,
    //   semester: "Fall 2024",
    // },
    // {
    //   code: "CSE705",
    //   name: "Professional Ethics",
    //   credits: 2,
    //   semester: "Fall 2024",
    // },

    // Spring 2025
    // {
    //   code: "CSE801",
    //   name: "Internet of Things",
    //   credits: 3,
    //   semester: "Spring 2025",
    // },
    // {
    //   code: "CSE802",
    //   name: "DevOps & Automation",
    //   credits: 3,
    //   semester: "Spring 2025",
    // },
    // {
    //   code: "CSE803",
    //   name: "Capstone Project II",
    //   credits: 4,
    //   semester: "Spring 2025",
    // },
    // {
    //   code: "CSE804",
    //   name: "Industry Seminar",
    //   credits: 2,
    //   semester: "Spring 2025",
    // },
    // {
    //   code: "CSE805",
    //   name: "Research Methodology",
    //   credits: 2,
    //   semester: "Spring 2025",
    // },
  ];

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
      }
    }
  }, []);

  const calculateGrade = (
    totalMarks: number
  ): { gradePoint: number; letterGrade: string } => {
    if (totalMarks >= 80) return { gradePoint: 4.0, letterGrade: "A+" };
    if (totalMarks >= 75) return { gradePoint: 3.75, letterGrade: "A" };
    if (totalMarks >= 70) return { gradePoint: 3.5, letterGrade: "A-" };
    if (totalMarks >= 65) return { gradePoint: 3.25, letterGrade: "B+" };
    if (totalMarks >= 60) return { gradePoint: 3.0, letterGrade: "B" };
    if (totalMarks >= 55) return { gradePoint: 2.75, letterGrade: "B-" };
    if (totalMarks >= 50) return { gradePoint: 2.5, letterGrade: "C+" };
    if (totalMarks >= 45) return { gradePoint: 2.25, letterGrade: "C" };
    if (totalMarks >= 40) return { gradePoint: 2.0, letterGrade: "D" };
    return { gradePoint: 0.0, letterGrade: "F" };
  };

  const addStudentMarks = () => {
    if (!selectedCourse || !selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a course and student",
        variant: "destructive",
      });
      return;
    }

    const classTest1 = parseFloat(marks.classTest1) || 0;
    const classTest2 = parseFloat(marks.classTest2) || 0;
    const attendance = parseFloat(marks.attendance) || 0;
    const assessment = parseFloat(marks.assessment) || 0;
    const finalExam = parseFloat(marks.finalExam) || 0;

    // Validation
    if (
      classTest1 > 20 ||
      classTest2 > 20 ||
      attendance > 5 ||
      assessment > 5 ||
      finalExam > 70
    ) {
      toast({
        title: "Error",
        description: "Marks exceed maximum allowed values",
        variant: "destructive",
      });
      return;
    }

    // Best of two class tests + other components
    const bestClassTest = Math.max(classTest1, classTest2);
    const totalMarks = bestClassTest + attendance + assessment + finalExam;

    const course = courses.find((c) => c.code === selectedCourse);
    const student = students.find((s) => s.id === selectedStudent);

    if (!course || !student) return;

    const { gradePoint, letterGrade } = calculateGrade(totalMarks);

    const newMark: StudentMark = {
      studentId: selectedStudent,
      studentName: student.name,
      semester: selectedSemester,
      courseCode: selectedCourse,
      courseName: course.name,
      credits: course.credits,
      classTest1,
      classTest2,
      attendance,
      assessment,
      finalExam,
      totalMarks,
      gradePoint,
      letterGrade,
    };

    // Remove existing entry for same student and course
    const updatedMarks = studentMarks.filter(
      (mark) =>
        !(
          mark.studentId === selectedStudent &&
          mark.courseCode === selectedCourse
        )
    );
    updatedMarks.push(newMark);

    setStudentMarks(updatedMarks);
    setLocalStorage("cgpa_student_marks", JSON.stringify(updatedMarks));

    // Reset form
    setMarks({
      classTest1: "",
      classTest2: "",
      attendance: "",
      assessment: "",
      finalExam: "",
    });

    toast({
      title: "Success",
      description: `Marks added for ${student.name} in ${course.name}`,
    });
  };

  const semesterCourses = courses.filter(
    (course) => course.semester === selectedSemester
  );
  const filteredMarks = studentMarks.filter(
    (mark) =>
      mark.semester === selectedSemester &&
      (!selectedCourse || mark.courseCode === selectedCourse)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Faculty CGPA Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Marks Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Student Marks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicSemesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterCourses.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="student">Student</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classTest1">Class Test 1 (Max: 20)</Label>
                  <Input
                    id="classTest1"
                    type="number"
                    max="20"
                    min="0"
                    value={marks.classTest1}
                    onChange={(e) =>
                      setMarks({ ...marks, classTest1: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="classTest2">Class Test 2 (Max: 20)</Label>
                  <Input
                    id="classTest2"
                    type="number"
                    max="20"
                    min="0"
                    value={marks.classTest2}
                    onChange={(e) =>
                      setMarks({ ...marks, classTest2: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="attendance">Attendance (Max: 5)</Label>
                  <Input
                    id="attendance"
                    type="number"
                    max="5"
                    min="0"
                    value={marks.attendance}
                    onChange={(e) =>
                      setMarks({ ...marks, attendance: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="assessment">Assessment (Max: 5)</Label>
                  <Input
                    id="assessment"
                    type="number"
                    max="5"
                    min="0"
                    value={marks.assessment}
                    onChange={(e) =>
                      setMarks({ ...marks, assessment: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="finalExam">Final Exam (Max: 70)</Label>
                  <Input
                    id="finalExam"
                    type="number"
                    max="70"
                    min="0"
                    value={marks.finalExam}
                    onChange={(e) =>
                      setMarks({ ...marks, finalExam: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button onClick={addStudentMarks} className="w-full">
                Save Marks
              </Button>
            </CardContent>
          </Card>

          {/* Marks Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Marks Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Class Test 1:</span>
                  <span>{marks.classTest1 || 0}/20</span>
                </div>
                <div className="flex justify-between">
                  <span>Class Test 2:</span>
                  <span>{marks.classTest2 || 0}/20</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Best Class Test:</span>
                  <span>
                    {Math.max(
                      parseFloat(marks.classTest1) || 0,
                      parseFloat(marks.classTest2) || 0
                    )}
                    /20
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance:</span>
                  <span>{marks.attendance || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Assessment:</span>
                  <span>{marks.assessment || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Exam:</span>
                  <span>{marks.finalExam || 0}/70</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      {Math.max(
                        parseFloat(marks.classTest1) || 0,
                        parseFloat(marks.classTest2) || 0
                      ) +
                        (parseFloat(marks.attendance) || 0) +
                        (parseFloat(marks.assessment) || 0) +
                        (parseFloat(marks.finalExam) || 0)}
                      /100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Marks - {selectedSemester}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
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
                {filteredMarks.map((mark, index) => (
                  <TableRow key={index}>
                    <TableCell>{mark.studentName}</TableCell>
                    <TableCell>{mark.courseCode}</TableCell>
                    <TableCell>{mark.classTest1}</TableCell>
                    <TableCell>{mark.classTest2}</TableCell>
                    <TableCell className="font-medium">
                      {Math.max(mark.classTest1, mark.classTest2)}
                    </TableCell>
                    <TableCell>{mark.attendance}</TableCell>
                    <TableCell>{mark.assessment}</TableCell>
                    <TableCell>{mark.finalExam}</TableCell>
                    <TableCell className="font-medium">
                      {mark.totalMarks}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          mark.letterGrade === "F"
                            ? "bg-red-100 text-red-800"
                            : mark.gradePoint >= 3.5
                            ? "bg-green-100 text-green-800"
                            : mark.gradePoint >= 3.0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {mark.letterGrade}
                      </span>
                    </TableCell>
                    <TableCell>{mark.gradePoint.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CGPAFacultyPanel;
