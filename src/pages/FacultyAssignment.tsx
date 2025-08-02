import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Users, X } from "lucide-react";
import { useState } from "react";

interface Faculty {
  id: string;
  name: string;
  department: string;
}

const FacultyAssignment = () => {
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Mock data - in real app this would come from API
  const availableFaculties: Faculty[] = [
    {
      id: "65b08432cb87974826d0b7a7",
      name: "Dr. Smith",
      department: "Computer Science",
    },
    {
      id: "65b0844ccb87974826d0b7af",
      name: "Prof. Johnson",
      department: "Computer Science",
    },
    {
      id: "65b0844ccb87974826d0b7b1",
      name: "Dr. Wilson",
      department: "Mathematics",
    },
  ];

  const availableCourses = [
    { id: "course1", name: "DOM Manipulation", code: "JS108" },
    { id: "course2", name: "React Fundamentals", code: "JS201" },
    { id: "course3", name: "Node.js Backend", code: "JS301" },
  ];

  const addFaculty = () => {
    if (selectedFaculty && !selectedFaculties.includes(selectedFaculty)) {
      setSelectedFaculties([...selectedFaculties, selectedFaculty]);
      setSelectedFaculty("");
    }
  };

  const removeFaculty = (facultyId: string) => {
    setSelectedFaculties(selectedFaculties.filter((id) => id !== facultyId));
  };

  const getFacultyName = (facultyId: string) => {
    const faculty = availableFaculties.find((f) => f.id === facultyId);
    return faculty ? faculty.name : facultyId;
  };

  const onSubmit = async () => {
    if (!selectedCourse || selectedFaculties.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a course and at least one faculty member",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      assignFacultyToCourse: {
        faculties: selectedFaculties,
      },
    };

    try {
      console.log(
        "Faculty assignment payload:",
        JSON.stringify(payload, null, 2)
      );
      toast({
        title: "Faculty Assigned Successfully",
        description: `${selectedFaculties.length} faculty members assigned to course`,
      });
      setSelectedFaculties([]);
      setSelectedCourse("");
    } catch (error) {
      toast({
        title: "Failed to assign faculty",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Faculty Assignment</h1>
          <p className="text-muted-foreground">
            Assign faculty members to courses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Assign Faculty to Course
            </CardTitle>
            <CardDescription>
              Select a course and assign faculty members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Assign Faculty</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedFaculty}
                  onValueChange={setSelectedFaculty}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select faculty member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFaculties
                      .filter(
                        (faculty) => !selectedFaculties.includes(faculty.id)
                      )
                      .map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name} - {faculty.department}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addFaculty}
                  disabled={!selectedFaculty}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              {selectedFaculties.length > 0 && (
                <div className="space-y-2">
                  <Label>Assigned Faculty:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculties.map((facultyId) => (
                      <Badge
                        key={facultyId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        {getFacultyName(facultyId)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeFaculty(facultyId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={onSubmit}
              className="w-full"
              disabled={!selectedCourse || selectedFaculties.length === 0}
            >
              Assign Faculty to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignment;
