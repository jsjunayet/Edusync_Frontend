import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useGetMeQuery } from "@/components/Redux/service/AuthApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Plus, Search, User } from "lucide-react";
import { useState } from "react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock user role - in real app this would come from auth context
  const { data } = useGetMeQuery();
  const userRole = data?.data?.user?.role;

  const courses = [
    {
      id: "CS101",
      name: "Computer Science Fundamentals",
      instructor: "Dr. Smith",
      credits: 3,
      semester: "Fall 2024",
      schedule: "Mon, Wed, Fri 9:00 AM",
      room: "A-201",
      enrolled: 45,
      capacity: 50,
    },
    {
      id: "MATH201",
      name: "Advanced Mathematics",
      instructor: "Prof. Johnson",
      credits: 4,
      semester: "Fall 2024",
      schedule: "Tue, Thu 11:00 AM",
      room: "B-105",
      enrolled: 38,
      capacity: 40,
    },
    {
      id: "PHY301",
      name: "Quantum Physics",
      instructor: "Dr. Wilson",
      credits: 3,
      semester: "Fall 2024",
      schedule: "Mon, Wed 2:00 PM",
      room: "C-301",
      enrolled: 25,
      capacity: 30,
    },
  ];

  const attendanceData = [
    {
      courseId: "CS101",
      courseName: "Computer Science Fundamentals",
      attended: 28,
      total: 30,
      percentage: 93.3,
    },
    {
      courseId: "MATH201",
      courseName: "Advanced Mathematics",
      attended: 25,
      total: 28,
      percentage: 89.3,
    },
    {
      courseId: "PHY301",
      courseName: "Quantum Physics",
      attended: 22,
      total: 25,
      percentage: 88.0,
    },
  ];

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageCourses = userRole === "admin" || userRole === "faculty";

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Courses & Attendance</h1>
            <p className="text-muted-foreground">
              Manage courses and track attendance records
            </p>
          </div>
          {canManageCourses && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="attendance">My Attendance</TabsTrigger>
            {canManageCourses && (
              <TabsTrigger value="manage">Manage</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {course.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {course.instructor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.schedule}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{course.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Credits:</span>
                        <p className="font-medium">{course.credits}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Semester:</span>
                        <p className="font-medium">{course.semester}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Room:</span>
                        <p className="font-medium">{course.room}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Enrollment:
                        </span>
                        <p className="font-medium">
                          {course.enrolled}/{course.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {userRole === "student" && (
                        <Button variant="outline" size="sm">
                          View Materials
                        </Button>
                      )}
                      {canManageCourses && (
                        <>
                          <Button variant="outline" size="sm">
                            Edit Course
                          </Button>
                          <Button variant="outline" size="sm">
                            Manage Attendance
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Your semester-wise attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Attended</TableHead>
                      <TableHead>Total Classes</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((record) => (
                      <TableRow key={record.courseId}>
                        <TableCell>
                          <Badge variant="outline">{record.courseId}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.courseName}
                        </TableCell>
                        <TableCell>{record.attended}</TableCell>
                        <TableCell>{record.total}</TableCell>
                        <TableCell
                          className={getAttendanceColor(record.percentage)}
                        >
                          {record.percentage.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.percentage >= 75
                                ? "default"
                                : "destructive"
                            }
                          >
                            {record.percentage >= 75 ? "Good" : "Low"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {canManageCourses && (
            <TabsContent value="manage" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>
                      Add, edit, and manage course information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-20 flex flex-col items-center gap-2">
                        <Plus className="h-6 w-6" />
                        Add New Course
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                      >
                        <BookOpen className="h-6 w-6" />
                        Bulk Import
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                      >
                        <User className="h-6 w-6" />
                        Manage Enrollments
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {courses.length}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Courses
                        </p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {courses.reduce(
                            (sum, course) => sum + course.enrolled,
                            0
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Enrollments
                        </p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">
                          {(
                            (courses.reduce(
                              (sum, course) => sum + course.enrolled,
                              0
                            ) /
                              courses.reduce(
                                (sum, course) => sum + course.capacity,
                                0
                              )) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Capacity Utilization
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
