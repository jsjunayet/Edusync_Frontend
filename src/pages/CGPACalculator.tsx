import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  courseName: string;
  creditHours: number;
  grade: string;
  gradePoint: number;
}

const gradeMapping = {
  "A+": 4.0,
  A: 3.75,
  "A-": 3.5,
  "B+": 3.25,
  B: 3.0,
  "B-": 2.75,
  "C+": 2.5,
  C: 2.25,
  "C-": 2.0,
  "D+": 1.75,
  D: 1.5,
  F: 0.0,
};

const CGPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");
  const [creditHours, setCreditHours] = useState<number>(3);
  const [selectedGrade, setSelectedGrade] = useState("");
  const { toast } = useToast();

  const addCourse = () => {
    if (!courseName || !selectedGrade) {
      toast({
        title: "Validation Error",
        description: "Please fill in all course details",
        variant: "destructive",
      });
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      courseName,
      creditHours,
      grade: selectedGrade,
      gradePoint: gradeMapping[selectedGrade as keyof typeof gradeMapping],
    };

    setCourses([...courses, newCourse]);
    setCourseName("");
    setCreditHours(3);
    setSelectedGrade("");

    toast({
      title: "Course Added",
      description: `${courseName} has been added to your calculation`,
    });
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    toast({
      title: "Course Removed",
      description: "Course has been removed from calculation",
    });
  };

  const calculateCGPA = () => {
    if (courses.length === 0) return 0;

    const totalQualityPoints = courses.reduce((sum, course) => {
      return sum + course.gradePoint * course.creditHours;
    }, 0);

    const totalCreditHours = courses.reduce((sum, course) => {
      return sum + course.creditHours;
    }, 0);

    return totalCreditHours > 0
      ? (totalQualityPoints / totalCreditHours).toFixed(2)
      : "0.00";
  };

  const getGradeClass = (cgpa: string) => {
    const numericCGPA = parseFloat(cgpa);
    if (numericCGPA >= 3.75) return "First Class";
    if (numericCGPA >= 3.5) return "Second Class (Upper)";
    if (numericCGPA >= 3.0) return "Second Class (Lower)";
    if (numericCGPA >= 2.5) return "Third Class";
    return "Pass/Fail";
  };

  const resetCalculator = () => {
    setCourses([]);
    setCourseName("");
    setCreditHours(3);
    setSelectedGrade("");
    toast({
      title: "Calculator Reset",
      description: "All courses have been cleared",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            CGPA Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your Cumulative Grade Point Average with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-primary">Add Course</CardTitle>
              <CardDescription>
                Enter course details to calculate your CGPA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Mathematics I"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input
                  id="creditHours"
                  type="number"
                  min="1"
                  max="6"
                  value={creditHours}
                  onChange={(e) => setCreditHours(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(gradeMapping).map(([grade, point]) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({point})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={addCourse} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Courses List and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* CGPA Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {calculateCGPA()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current CGPA
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-xl font-semibold text-secondary-foreground">
                      {courses.reduce(
                        (sum, course) => sum + course.creditHours,
                        0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Credit Hours
                    </div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-lg font-medium text-accent-foreground">
                      {getGradeClass(calculateCGPA().toString())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Classification
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  Added Courses ({courses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No courses added yet. Add courses to calculate your CGPA.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credit Hours</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Grade Point</TableHead>
                        <TableHead>Quality Points</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.courseName}
                          </TableCell>
                          <TableCell>{course.creditHours}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                              {course.grade}
                            </span>
                          </TableCell>
                          <TableCell>{course.gradePoint}</TableCell>
                          <TableCell>
                            {(course.gradePoint * course.creditHours).toFixed(
                              2
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCourse(course.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grade Scale Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Grade Scale Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(gradeMapping).map(([grade, point]) => (
                <div
                  key={grade}
                  className="text-center p-3 bg-muted rounded-lg"
                >
                  <div className="font-bold text-primary">{grade}</div>
                  <div className="text-sm text-muted-foreground">{point}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CGPACalculator;
