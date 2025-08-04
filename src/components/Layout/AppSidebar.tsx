import {
  BookOpen,
  Calendar,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Library,
  MessageSquare,
  NotebookPen,
  RefreshCw,
  School,
  TestTube,
  User,
  Users,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetMeQuery } from "../Redux/service/AuthApi";

type Role =
  | "admin"
  | "faculty"
  | "student"
  | "lab_in_charge"
  | "class_representative";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: Role[]; // Roles who can see this item
}

interface MenuGroup {
  title: string;
  roles: Role[]; // Roles who can see this group
  items: MenuItem[];
}

// Define all groups and items, assigning roles properly
const menuGroups: MenuGroup[] = [
  {
    title: "Dashboard",
    roles: ["admin"],
    items: [
      {
        title: "Dashboard Home",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Academic",
    roles: ["admin"],
    items: [
      {
        title: "Academic Faculty",
        url: "/academic-faculty",
        icon: School,
        roles: ["admin"],
      },
      {
        title: "Academic Department",
        url: "/academic-department",
        icon: Library,
        roles: ["admin"],
      },
      {
        title: "Academic Semester",
        url: "/academic-semester",
        icon: CalendarDays,
        roles: ["admin"],
      },
      {
        title: "Course Management",
        url: "/course-management",
        icon: BookOpen,
        roles: ["admin"],
      },
      {
        title: "Course Creation",
        url: "/course-creation",
        icon: NotebookPen,
        roles: ["admin"],
      },
      {
        title: "Faculty Assignment",
        url: "/faculty-assignment",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Semester Registration",
        url: "/semester-registration",
        icon: CalendarPlus,
        roles: ["admin"],
      },
      {
        title: "Semester Status Update",
        url: "/semester-status-update",
        icon: RefreshCw,
        roles: ["admin"],
      },
      {
        title: "Offered Course Management",
        url: "/offered-course-management",
        icon: Layers3,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "User Management",
    roles: ["admin"],
    items: [
      {
        title: "Create User",
        url: "/user/create",
        icon: Users,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Courses",
    roles: ["admin", "faculty", "student", "class_representative"],
    items: [
      {
        title: "Courses",
        url: "/courses",
        icon: BookOpen,
        roles: ["admin", "faculty", "student", "class_representative"],
      },
      {
        title: "Assign Marks",
        url: "/cgpa-faculty",
        icon: GraduationCap,
        roles: ["faculty"],
      },
      {
        title: "Student Result",
        url: "/cgpa-student",
        icon: GraduationCap,
        roles: ["admin", "faculty", "student", "class_representative"],
      },
    ],
  },
  {
    title: "Routine & Attendance",
    roles: [
      "admin",
      "faculty",
      "student",
      "lab_in_charge",
      "class_representative",
    ],
    items: [
      {
        title: "Class Routine",
        url: "/routine",
        icon: Calendar,
        roles: [
          "admin",
          "faculty",
          "student",
          "lab_in_charge",
          "class_representative",
        ],
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: ClipboardList,
        roles: ["faculty", "student", "class_representative"],
      },
    ],
  },
  {
    title: "Communication",
    roles: [
      "admin",
      "faculty",
      "student",
      "lab_in_charge",
      "class_representative",
    ],
    items: [
      {
        title: "Notice Board",
        url: "/notices",
        icon: MessageSquare,
        roles: [
          "admin",
          "faculty",
          "student",
          "lab_in_charge",
          "class_representative",
        ],
      },
      {
        title: "Discussions",
        url: "/discussions",
        icon: MessageSquare,
        roles: ["faculty", "student", "lab_in_charge", "class_representative"],
      },
      {
        title: "Notice Creation",
        url: "/notices",
        icon: MessageSquare,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Others",
    roles: [
      "admin",
      "faculty",
      "student",
      "lab_in_charge",
      "class_representative",
    ],
    items: [
      {
        title: "Profile",
        url: "/profile",
        icon: User,
        roles: [
          "admin",
          "faculty",
          "student",
          "lab_in_charge",
          "class_representative",
        ],
      },
      {
        title: "CGPA Calculator",
        url: "/cgpa-calculator",
        icon: User,
        roles: [
          "admin",
          "faculty",
          "student",
          "lab_in_charge",
          "class_representative",
        ],
      },
      {
        title: "Lab Resources",
        url: "/lab-resources",
        icon: TestTube,
        roles: ["lab_in_charge", "class_representative"],
      },
      {
        title: "Lecture Sharing",
        url: "/lectures",
        icon: NotebookPen,
        roles: ["faculty"],
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { data } = useGetMeQuery();

  const userRole: Role = data?.data?.user?.role || "student"; // Default to student if no role
  const collapsed = state === "collapsed";

  // Filter groups by user role
  const filteredGroups = menuGroups
    .filter((group) => group.roles.includes(userRole))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0); // Remove groups without visible items

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary font-medium" : "hover:bg-muted";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-primary text-xl border-b py-4 mb-4 font-semibold">
              {!collapsed && group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
