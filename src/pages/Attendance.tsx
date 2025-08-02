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
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Mock user role - in real app this would come from auth context
  const { data } = useGetMeQuery();
  const userRole = data?.data?.user?.role;
  const attendanceRecords = [
    {
      id: 1,
      studentId: "ST2024001",
      studentName: "John Smith",
      course: "CS101",
      courseName: "Computer Science Fundamentals",
      date: "2024-01-15",
      time: "9:00 AM",
      status: "present",
      marked_by: "Dr. Smith",
      remarks: "",
    },
    {
      id: 2,
      studentId: "ST2024002",
      studentName: "Sarah Johnson",
      course: "CS101",
      courseName: "Computer Science Fundamentals",
      date: "2024-01-15",
      time: "9:00 AM",
      status: "absent",
      marked_by: "Dr. Smith",
      remarks: "Medical leave",
    },
    {
      id: 3,
      studentId: "ST2024003",
      studentName: "Mike Davis",
      course: "CS101",
      courseName: "Computer Science Fundamentals",
      date: "2024-01-15",
      time: "9:00 AM",
      status: "late",
      marked_by: "Dr. Smith",
      remarks: "Arrived 15 minutes late",
    },
    {
      id: 4,
      studentId: "ST2024001",
      studentName: "John Smith",
      course: "MATH201",
      courseName: "Advanced Mathematics",
      date: "2024-01-14",
      time: "11:00 AM",
      status: "present",
      marked_by: "Prof. Johnson",
      remarks: "",
    },
  ];

  const myAttendance = [
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

  const courses = [
    { value: "all", label: "All Courses" },
    { value: "CS101", label: "CS101 - Computer Science Fundamentals" },
    { value: "MATH201", label: "MATH201 - Advanced Mathematics" },
    { value: "PHY301", label: "PHY301 - Quantum Physics" },
  ];

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || record.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const canManageAttendance = userRole === "faculty" || userRole === "admin";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600";
      case "absent":
        return "text-red-600";
      case "late":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return "default";
    if (percentage >= 75) return "secondary";
    return "destructive";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">
              {canManageAttendance
                ? "Track and manage student attendance records"
                : "View your attendance records and statistics"}
            </p>
          </div>
          {canManageAttendance && (
            <Button className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Mark Attendance
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {courses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          />
        </div>

        <Tabs
          defaultValue={canManageAttendance ? "manage" : "view"}
          className="space-y-4"
        >
          <TabsList>
            {!canManageAttendance && (
              <TabsTrigger value="view">My Attendance</TabsTrigger>
            )}
            {canManageAttendance && (
              <>
                <TabsTrigger value="manage">Manage Attendance</TabsTrigger>
                <TabsTrigger value="records">Attendance Records</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </>
            )}
          </TabsList>

          {!canManageAttendance && (
            <TabsContent value="view" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Attendance Summary</CardTitle>
                    <CardDescription>
                      Your attendance records for current semester
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
                        {myAttendance.map((record) => (
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
                                variant={getAttendanceBadge(record.percentage)}
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

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Attendance</CardTitle>
                    <CardDescription>
                      Your latest attendance records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {attendanceRecords
                        .filter((record) => record.studentName === "John Smith")
                        .slice(0, 5)
                        .map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{record.course}</Badge>
                                <span className="font-medium">
                                  {record.courseName}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {record.date} • {record.time}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <span
                                className={`font-medium ${getStatusColor(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {canManageAttendance && (
            <>
              <TabsContent value="manage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                    <CardDescription>
                      Mark attendance for today's classes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            Date: {selectedDate}
                          </span>
                        </div>
                        <select className="px-3 py-2 border rounded-lg bg-background">
                          <option>CS101 - 9:00 AM</option>
                          <option>MATH201 - 11:00 AM</option>
                          <option>PHY301 - 2:00 PM</option>
                        </select>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.slice(0, 5).map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  {record.studentId}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {record.studentName}
                              </TableCell>
                              <TableCell>
                                <select
                                  defaultValue={record.status}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="late">Late</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="Add remarks..."
                                  defaultValue={record.remarks}
                                  className="text-sm"
                                />
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  Update
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="flex gap-2">
                        <Button>Save All</Button>
                        <Button variant="outline">Mark All Present</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Records</CardTitle>
                    <CardDescription>
                      View and modify attendance records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marked By</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {record.studentName}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {record.studentId}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="outline">{record.course}</Badge>
                                <div className="text-xs text-muted-foreground">
                                  {record.courseName}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.time}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(record.status)}
                                <span className={getStatusColor(record.status)}>
                                  {record.status}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="text-sm">
                                  {record.marked_by}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Statistics</CardTitle>
                      <CardDescription>
                        Overview of attendance for all courses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            87.5%
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Overall Attendance
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">
                            142
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Total Classes
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-success">
                            124
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Classes Attended
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Generate Reports</CardTitle>
                      <CardDescription>
                        Export attendance reports for different periods
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center gap-2"
                        >
                          <Calendar className="h-6 w-6" />
                          Daily Report
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center gap-2"
                        >
                          <Calendar className="h-6 w-6" />
                          Weekly Report
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center gap-2"
                        >
                          <Calendar className="h-6 w-6" />
                          Monthly Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
