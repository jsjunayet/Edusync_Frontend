import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./components/Redux/store";
import AcademicDepartment from "./pages/AcademicDepartment";
import AcademicFaculty from "./pages/AcademicFaculty";
import AcademicSemester from "./pages/AcademicSemester";
import Attendance from "./pages/Attendance";
import CGPACalculator from "./pages/CGPACalculator";
import CGPAFacultyPanel from "./pages/CGPAFacultyPanel";
import CGPAStudentPanel from "./pages/CGPAStudentPannel";
import ChangePassword from "./pages/ChangePassword";
import CourseCreation from "./pages/CourseCreation";
import CourseManagementHub from "./pages/CourseManagementHub";
import Courses from "./pages/Courses";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Discussions from "./pages/Discussions";
import FacultyAssignment from "./pages/FacultyAssignment";
import Index from "./pages/Index";
import LabResources from "./pages/LabResources";
import Lectures from "./pages/Lectures";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Notices from "./pages/Notices";
import OfferedCourseManagement from "./pages/OfferedCourseManagement";
import Profile from "./pages/Profile";
import Routine from "./pages/Routine";
import SemesterRegistration from "./pages/SemesterRegistration";
import SemesterStatusUpdate from "./pages/SemesterStatusUpdate";
import StudentEnrollment from "./pages/StudentEnrollment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/lab-resources" element={<LabResources />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/academic-faculty" element={<AcademicFaculty />} />
            <Route
              path="/academic-Department"
              element={<AcademicDepartment />}
            />
            <Route path="/academic-semester" element={<AcademicSemester />} />
            <Route
              path="/course-management"
              element={<CourseManagementHub />}
            />
            <Route path="/course-creation" element={<CourseCreation />} />
            <Route path="/faculty-assignment" element={<FacultyAssignment />} />
            <Route
              path="/semester-registration"
              element={<SemesterRegistration />}
            />
            <Route
              path="/semester-status-update"
              element={<SemesterStatusUpdate />}
            />
            <Route
              path="/offered-course-management"
              element={<OfferedCourseManagement />}
            />
            <Route path="/cgpa-calculator" element={<CGPACalculator />} />
            <Route path="/cgpa-faculty" element={<CGPAFacultyPanel />} />
            <Route path="/cgpa-student" element={<CGPAStudentPanel />} />
            <Route path="/student-enrollment" element={<StudentEnrollment />} />
            <Route path="/user/create" element={<CreateUser />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
