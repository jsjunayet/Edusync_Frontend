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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  prefix: z.string().min(1, "Prefix is required"),
  code: z.number().min(1, "Code is required"),
  credits: z.number().min(1, "Credits must be at least 1"),
});

type CourseForm = z.infer<typeof courseSchema>;

interface PreRequisiteCourse {
  course: string;
  isDeleted: boolean;
}

const CourseCreation = () => {
  const [preRequisites, setPreRequisites] = useState<PreRequisiteCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      prefix: "",
      code: 0,
      credits: 3,
    },
  });

  // Mock available courses - in real app this would come from API
  const availableCourses = [
    {
      id: "65b5ff53d6ffdd9bfc058320",
      name: "Introduction to Programming",
      code: "CS101",
    },
    { id: "65b5ffc2d6ffdd9bfc058326", name: "Data Structures", code: "CS102" },
    { id: "65b5ffc2d6ffdd9bfc058327", name: "Algorithms", code: "CS201" },
  ];

  const addPreRequisite = () => {
    if (
      selectedCourse &&
      !preRequisites.find((p) => p.course === selectedCourse)
    ) {
      setPreRequisites([
        ...preRequisites,
        { course: selectedCourse, isDeleted: false },
      ]);
      setSelectedCourse("");
    }
  };

  const removePreRequisite = (courseId: string) => {
    setPreRequisites(preRequisites.filter((p) => p.course !== courseId));
  };

  const onSubmit = async (data: CourseForm) => {
    const payload = {
      course: {
        ...data,
        preRequisiteCourses: preRequisites,
      },
    };

    try {
      console.log("Course creation payload:", JSON.stringify(payload, null, 2));
      // Here you would make the API call
      toast({
        title: "Course Created Successfully",
        description: `${data.prefix}${data.code} - ${data.title}`,
      });
      form.reset();
      setPreRequisites([]);
    } catch (error) {
      toast({
        title: "Failed to create course",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getCourseName = (courseId: string) => {
    const course = availableCourses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.name}` : courseId;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Creation</h1>
          <p className="text-muted-foreground">
            Create a new course with prerequisites
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              New Course Details
            </CardTitle>
            <CardDescription>
              Fill in the course information and prerequisites
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., DOM Manipulation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., JS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Code</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 108"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 3"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Prerequisites</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCourse}
                      onValueChange={setSelectedCourse}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a prerequisite course" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={addPreRequisite}
                      disabled={!selectedCourse}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {preRequisites.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Prerequisites:</Label>
                      <div className="flex flex-wrap gap-2">
                        {preRequisites.map((prereq) => (
                          <Badge
                            key={prereq.course}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {getCourseName(prereq.course)}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removePreRequisite(prereq.course)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Create Course
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CourseCreation;
