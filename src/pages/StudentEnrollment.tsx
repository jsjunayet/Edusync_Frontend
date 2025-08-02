import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const studentEnrollSchema = z.object({
  semesterRegistration: z.string().min(1, "Semester registration is required"),
  offeredCourse: z.string().min(1, "Offered course is required"),
  student: z.string().min(1, "Student is required"),
  classTest1: z
    .number()
    .min(0)
    .max(20, "Class Test 1 marks should be between 0-20"),
  midTerm: z.number().min(0).max(50, "Mid Term marks should be between 0-50"),
  classTest2: z
    .number()
    .min(0)
    .max(20, "Class Test 2 marks should be between 0-20"),
  finalTerm: z
    .number()
    .min(0)
    .max(60, "Final Term marks should be between 0-60"),
});

type StudentEnrollForm = z.infer<typeof studentEnrollSchema>;

const StudentEnrollment = () => {
  const form = useForm<StudentEnrollForm>({
    resolver: zodResolver(studentEnrollSchema),
    defaultValues: {
      semesterRegistration: "",
      offeredCourse: "",
      student: "",
      classTest1: 0,
      midTerm: 0,
      classTest2: 0,
      finalTerm: 0,
    },
  });

  // Mock data - in real app this would come from API
  const semesterRegistrations = [
    { id: "65b6185f13c0a33cdf61589a", name: "Fall 2024 Registration" },
    { id: "65b6185f13c0a33cdf61589b", name: "Spring 2025 Registration" },
  ];

  const offeredCourses = [
    {
      id: "65b66f2a8cbfc00b54ba4ee2",
      name: "JS108 - DOM Manipulation",
      section: "A",
      capacity: "25/30",
    },
    {
      id: "65b66f2a8cbfc00b54ba4ee3",
      name: "JS201 - React Fundamentals",
      section: "B",
      capacity: "18/25",
    },
  ];

  const students = [
    {
      id: "65b016db47c500c09d0bed2f",
      name: "John Doe",
      studentId: "CSE2021001",
    },
    {
      id: "65b016db47c500c09d0bed30",
      name: "Jane Smith",
      studentId: "CSE2021002",
    },
    {
      id: "65b016db47c500c09d0bed31",
      name: "Mike Johnson",
      studentId: "CSE2021003",
    },
  ];

  const onSubmit = async (data: StudentEnrollForm) => {
    const payload = {
      studentEnroll: {
        semesterRegistration: data.semesterRegistration,
        offeredCourse: data.offeredCourse,
        student: data.student,
        courseMarks: {
          classTest1: data.classTest1,
          midTerm: data.midTerm,
          classTest2: data.classTest2,
          finalTerm: data.finalTerm,
        },
      },
    };

    try {
      console.log(
        "Student enrollment payload:",
        JSON.stringify(payload, null, 2)
      );

      const selectedStudent = students.find((s) => s.id === data.student);
      const selectedCourse = offeredCourses.find(
        (c) => c.id === data.offeredCourse
      );

      toast({
        title: "Student Enrolled Successfully",
        description: `${selectedStudent?.name} enrolled in ${selectedCourse?.name}`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to enroll student",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const totalMarks =
    form.watch("classTest1") +
    form.watch("midTerm") +
    form.watch("classTest2") +
    form.watch("finalTerm");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Students Mark</h1>
          <p className="text-muted-foreground">
            students in offered courses with assessment marks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Enroll Student in Course
            </CardTitle>
            <CardDescription>
              Select student, course, and set initial assessment marks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semesterRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester Registration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester registration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {semesterRegistrations.map((sem) => (
                              <SelectItem key={sem.id} value={sem.id}>
                                {sem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="offeredCourse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offered Course</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select offered course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {offeredCourses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name} - Section {course.section} (
                                {course.capacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="student"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Student</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.studentId})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">
                      Course Assessment Marks
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="classTest1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Test 1 (Max: 20)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0-20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              max={20}
                              min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="midTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mid Term (Max: 50)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0-50"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              max={50}
                              min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classTest2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Test 2 (Max: 20)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0-20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              max={20}
                              min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="finalTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Final Term (Max: 60)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0-60"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                              max={60}
                              min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Marks:</span>
                      <span className="text-lg font-bold text-primary">
                        {totalMarks}/150
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(totalMarks / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll Student in Course
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentEnrollment;
