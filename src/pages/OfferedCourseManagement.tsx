import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const offeredCourseSchema = z.object({
  academicFaculty: z.string().min(1, "Academic faculty is required"),
  academicDepartment: z.string().min(1, "Academic department is required"),
  semesterRegistration: z.string().min(1, "Semester registration is required"),
  course: z.string().min(1, "Course is required"),
  faculty: z.string().min(1, "Faculty is required"),
  section: z.number().min(1, "Section must be at least 1"),
  maxCapacity: z.number().min(1, "Max capacity must be at least 1"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

const updateOfferedCourseSchema = z.object({
  faculty: z.string().min(1, "Faculty is required"),
  maxCapacity: z.number().min(1, "Max capacity must be at least 1"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type OfferedCourseForm = z.infer<typeof offeredCourseSchema>;
type UpdateOfferedCourseForm = z.infer<typeof updateOfferedCourseSchema>;

const OfferedCourseManagement = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [updateSelectedDays, setUpdateSelectedDays] = useState<string[]>([]);

  const createForm = useForm<OfferedCourseForm>({
    resolver: zodResolver(offeredCourseSchema),
    defaultValues: {
      academicFaculty: "",
      academicDepartment: "",
      semesterRegistration: "",
      course: "",
      faculty: "",
      section: 1,
      maxCapacity: 30,
      startTime: "",
      endTime: "",
    },
  });

  const updateForm = useForm<UpdateOfferedCourseForm>({
    resolver: zodResolver(updateOfferedCourseSchema),
    defaultValues: {
      faculty: "",
      maxCapacity: 30,
      startTime: "",
      endTime: "",
    },
  });

  // Mock data - in real app this would come from API
  const academicFaculties = [
    { id: "6885b3d4077f52593af44462", name: "Faculty of Engineering" },
    { id: "6885b3d4077f52593af44463", name: "Faculty of Science" },
  ];

  const academicDepartments = [
    { id: "68884f4d7ee0deafb525d8d6", name: "Computer Science & Engineering" },
    { id: "68884f4d7ee0deafb525d8d7", name: "Electrical Engineering" },
  ];

  const semesterRegistrations = [
    { id: "68884e627ee0deafb525d8ba", name: "Fall 2024 Registration" },
    { id: "68884e627ee0deafb525d8bb", name: "Spring 2025 Registration" },
  ];

  const courses = [
    { id: "6887bc1a22dd289d738d3b71", name: "DOM Manipulation", code: "JS108" },
    {
      id: "6887bc1a22dd289d738d3b72",
      name: "React Fundamentals",
      code: "JS201",
    },
  ];

  const faculties = [
    { id: "68879935ea55c05fd06d7541", name: "Dr. Smith" },
    { id: "656dce37133c4a8a53eb5f09", name: "Prof. Johnson" },
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayChange = (
    day: string,
    checked: boolean,
    isUpdate: boolean = false
  ) => {
    if (isUpdate) {
      setUpdateSelectedDays((prev) =>
        checked ? [...prev, day] : prev.filter((d) => d !== day)
      );
    } else {
      setSelectedDays((prev) =>
        checked ? [...prev, day] : prev.filter((d) => d !== day)
      );
    }
  };

  const onCreateSubmit = async (data: OfferedCourseForm) => {
    if (selectedDays.length === 0) {
      toast({
        title: "Missing Days",
        description: "Please select at least one day",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      offeredCourse: {
        ...data,
        days: selectedDays,
      },
    };

    try {
      console.log(
        "Create offered course payload:",
        JSON.stringify(payload, null, 2)
      );
      toast({
        title: "Offered Course Created",
        description: "Course has been successfully offered",
      });
      createForm.reset();
      setSelectedDays([]);
    } catch (error) {
      toast({
        title: "Failed to create offered course",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const onUpdateSubmit = async (data: UpdateOfferedCourseForm) => {
    if (updateSelectedDays.length === 0) {
      toast({
        title: "Missing Days",
        description: "Please select at least one day",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      updateOfferedCourse: {
        ...data,
        days: updateSelectedDays,
      },
    };

    try {
      console.log(
        "Update offered course payload:",
        JSON.stringify(payload, null, 2)
      );
      toast({
        title: "Offered Course Updated",
        description: "Course details have been updated successfully",
      });
      updateForm.reset();
      setUpdateSelectedDays([]);
    } catch (error) {
      toast({
        title: "Failed to update offered course",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Offered Course Management</h1>
          <p className="text-muted-foreground">
            Create and manage offered courses
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList>
            <TabsTrigger value="create">Create Offered Course</TabsTrigger>
            <TabsTrigger value="update">Update Offered Course</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Create New Offered Course
                </CardTitle>
                <CardDescription>
                  Set up a new course offering for students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...createForm}>
                  <form
                    onSubmit={createForm.handleSubmit(onCreateSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="academicFaculty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Faculty</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {academicFaculties.map((faculty) => (
                                  <SelectItem
                                    key={faculty.id}
                                    value={faculty.id}
                                  >
                                    {faculty.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="academicDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Department</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {academicDepartments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
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
                        control={createForm.control}
                        name="course"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.code} - {course.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="faculty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faculty</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {faculties.map((faculty) => (
                                  <SelectItem
                                    key={faculty.id}
                                    value={faculty.id}
                                  >
                                    {faculty.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 1"
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
                        control={createForm.control}
                        name="maxCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Capacity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 30"
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
                        control={createForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Days of Week</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`create-${day}`}
                              checked={selectedDays.includes(day)}
                              onCheckedChange={(checked) =>
                                handleDayChange(day, checked as boolean, false)
                              }
                            />
                            <label
                              htmlFor={`create-${day}`}
                              className="text-sm font-medium"
                            >
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Offered Course
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Update Offered Course
                </CardTitle>
                <CardDescription>
                  Modify existing course offering details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...updateForm}>
                  <form
                    onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={updateForm.control}
                        name="faculty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faculty</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {faculties.map((faculty) => (
                                  <SelectItem
                                    key={faculty.id}
                                    value={faculty.id}
                                  >
                                    {faculty.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={updateForm.control}
                        name="maxCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Capacity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 100"
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
                        control={updateForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={updateForm.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Days of Week</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`update-${day}`}
                              checked={updateSelectedDays.includes(day)}
                              onCheckedChange={(checked) =>
                                handleDayChange(day, checked as boolean, true)
                              }
                            />
                            <label
                              htmlFor={`update-${day}`}
                              className="text-sm font-medium"
                            >
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Offered Course
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OfferedCourseManagement;
