import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalStudents: 1247,
    totalCourses: 45,
    attendance: 89,
    upcomingClasses: 8,
  };

  const recentNotices = [
    {
      id: 1,
      title: "Semester Exam Schedule Released",
      time: "2 hours ago",
      type: "exam",
    },
    {
      id: 2,
      title: "Library Hours Extended",
      time: "5 hours ago",
      type: "general",
    },
    {
      id: 3,
      title: "New Course Registration Open",
      time: "1 day ago",
      type: "registration",
    },
  ];

  const upcomingClasses = [
    {
      course: "CS101",
      name: "Computer Science Fundamentals",
      time: "9:00 AM",
      room: "A-201",
    },
    {
      course: "MATH201",
      name: "Advanced Mathematics",
      time: "11:00 AM",
      room: "B-105",
    },
    {
      course: "PHY301",
      name: "Quantum Physics",
      time: "2:00 PM",
      room: "C-301",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Good Morning, John!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at EduSync today
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Academic Year 2024-25
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.totalStudents}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {stats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Active this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                faculty member
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {stats.attendance}
              </div>
              Active this semester
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Classes
              </CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {stats.upcomingClasses}
              </div>
              <p className="text-xs text-muted-foreground">Today's schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notices
              </CardTitle>
              <CardDescription>
                Latest announcements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notice.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {notice.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        notice.type === "exam" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {notice.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Classes
              </CardTitle>
              <CardDescription>
                Your scheduled classes for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{classItem.course}</Badge>
                        <span className="font-medium text-sm">
                          {classItem.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>🕒 {classItem.time}</span>
                        <span>📍 {classItem.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
