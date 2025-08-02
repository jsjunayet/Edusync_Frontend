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
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  RefreshCw,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseManagementHub = () => {
  const navigate = useNavigate();

  const managementItems = [
    {
      title: "Course Creation",
      description:
        "Create new courses with prerequisites and detailed information",
      icon: BookOpen,
      route: "/course-creation",
      status: "Active",
      color: "bg-blue-500",
      features: [
        "Course Title & Code",
        "Prerequisites Management",
        "Credit Assignment",
      ],
    },
    {
      title: "Faculty Assignment",
      description: "Assign faculty members to courses for teaching",
      icon: UserPlus,
      route: "/faculty-assignment",
      status: "Active",
      color: "bg-green-500",
      features: [
        "Multi-Faculty Selection",
        "Course Assignment",
        "Role Management",
      ],
    },
    {
      title: "Semester Registration",
      description: "Set up semester registration periods and credit limits",
      icon: Calendar,
      route: "/semester-registration",
      status: "Active",
      color: "bg-purple-500",
      features: [
        "Registration Periods",
        "Credit Limits",
        "Academic Semester Linking",
      ],
    },
    {
      title: "Semester Status Update",
      description: "Update the status of semester registrations",
      icon: RefreshCw,
      route: "/semester-status-update",
      status: "Active",
      color: "bg-orange-500",
      features: ["Status Transitions", "Bulk Updates", "Timeline Management"],
    },
    {
      title: "Offered Course Management",
      description: "Create and manage course offerings with schedules",
      icon: Settings,
      route: "/offered-course-management",
      status: "Active",
      color: "bg-red-500",
      features: [
        "Schedule Management",
        "Capacity Control",
        "Faculty Assignment",
      ],
    },
    {
      title: "Student Enrollment",
      description: "Enroll students in courses with assessment tracking",
      icon: Users,
      route: "/student-enrollment",
      status: "Active",
      color: "bg-indigo-500",
      features: ["Course Enrollment", "Assessment Marks", "Progress Tracking"],
    },
  ];

  const jsonFormats = [
    {
      title: "Course Creation",
      format: {
        course: {
          title: "DOM Manipulation",
          prefix: "JS",
          code: 108,
          credits: 3,
          preRequisiteCourses: [
            { course: "65b5ff53d6ffdd9bfc058320", isDeleted: false },
          ],
        },
      },
    },
    {
      title: "Faculty Assignment",
      format: {
        assignFacultyToCourse: {
          faculties: ["65b08432cb87974826d0b7a7", "65b0844ccb87974826d0b7af"],
        },
      },
    },
    {
      title: "Semester Registration",
      format: {
        semesterRegistration: {
          academicSemester: "68879977ea55c05fd06d7545",
          status: "UPCOMING",
          startDate: "2025-01-10T04:00:01Z",
          endDate: "2025-04-24T17:59:59Z",
          minCredit: 6,
          maxCredit: 16,
        },
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Course Management Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete course management system with JSON API integration. Manage
            courses, faculty assignments, registrations, and student
            enrollments.
          </p>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-muted-foreground">
              All systems operational and ready for backend integration
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {managementItems.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${item.color} bg-opacity-10`}>
                    <item.icon
                      className={`h-6 w-6 text-${item.color.split("-")[1]}-500`}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => navigate(item.route)}
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  variant="outline"
                >
                  Open Module
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              JSON API Format Examples
            </CardTitle>
            <CardDescription>
              Sample JSON formats that each module accepts from the backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jsonFormats.map((example, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-sm">{example.title}</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(example.format, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Complete API Integration
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    All modules are designed to work with your backend JSON
                    format. Each form submission logs the exact payload
                    structure to the console for easy backend integration.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
};

export default CourseManagementHub;
