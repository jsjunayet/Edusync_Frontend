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
import { Calendar, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const semesterRegistrationSchema = z.object({
  academicSemester: z.string().min(1, "Academic semester is required"),
  status: z.enum(["UPCOMING", "ONGOING", "ENDED"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  minCredit: z.number().min(1, "Minimum credit must be at least 1"),
  maxCredit: z.number().min(1, "Maximum credit must be at least 1"),
});

type SemesterRegistrationForm = z.infer<typeof semesterRegistrationSchema>;

const SemesterRegistration = () => {
  const form = useForm<SemesterRegistrationForm>({
    resolver: zodResolver(semesterRegistrationSchema),
    defaultValues: {
      academicSemester: "",
      status: "UPCOMING",
      startDate: "",
      endDate: "",
      minCredit: 6,
      maxCredit: 16,
    },
  });

  // Mock academic semesters - in real app this would come from API
  const academicSemesters = [
    { id: "68879977ea55c05fd06d7545", name: "Fall 2024", code: "2024-01" },
    { id: "68879977ea55c05fd06d7546", name: "Spring 2025", code: "2025-02" },
    { id: "68879977ea55c05fd06d7547", name: "Summer 2025", code: "2025-03" },
  ];

  const onSubmit = async (data: SemesterRegistrationForm) => {
    const payload = {
      semesterRegistration: {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      },
    };

    try {
      console.log(
        "Semester registration payload:",
        JSON.stringify(payload, null, 2)
      );
      toast({
        title: "Semester Registration Created",
        description: `Registration period set for ${data.status.toLowerCase()} semester`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to create semester registration",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Semester Registration</h1>
          <p className="text-muted-foreground">
            Set up semester registration periods and credit limits
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Registration Details
            </CardTitle>
            <CardDescription>
              Configure semester registration settings
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
                    name="academicSemester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Semester</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select academic semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {academicSemesters.map((semester) => (
                              <SelectItem key={semester.id} value={semester.id}>
                                {semester.name} ({semester.code})
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UPCOMING">Upcoming</SelectItem>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="ENDED">Ended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minCredit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Credits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 6"
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
                    name="maxCredit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Credits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 16"
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

                <Button type="submit" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Create Semester Registration
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SemesterRegistration;
