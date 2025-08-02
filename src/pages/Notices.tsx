import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search, Plus, Calendar, User, Filter } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

const Notices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Mock user role - in real app this would come from auth context
  const userRole: "admin" | "faculty" | "student" | "lab_in_charge" | "class_representative" = "student";

  const notices = [
    {
      id: 1,
      title: "Semester Exam Schedule Released",
      content: "The final examination schedule for Fall 2024 semester has been published. Students are advised to check their exam dates and prepare accordingly.",
      author: "Academic Office",
      date: "2024-01-15",
      time: "2 hours ago",
      category: "exam",
      priority: "high",
      targetRole: "all",
      department: "all"
    },
    {
      id: 2,
      title: "Library Hours Extended During Exam Period",
      content: "The university library will remain open 24/7 during the examination period from January 20-30. Students can access all facilities including study rooms and computer labs.",
      author: "Library Administration",
      date: "2024-01-14",
      time: "5 hours ago",
      category: "general",
      priority: "medium",
      targetRole: "all",
      department: "all"
    },
    {
      id: 3,
      title: "CS Department: New Course Registration Open",
      content: "Registration for advanced elective courses in Computer Science department is now open. Last date for registration is January 25, 2024.",
      author: "CS Department",
      date: "2024-01-13",
      time: "1 day ago",
      category: "registration",
      priority: "medium",
      targetRole: "student",
      department: "CS"
    },
    {
      id: 4,
      title: "Faculty Meeting - Curriculum Review",
      content: "All faculty members are requested to attend the curriculum review meeting scheduled for January 18, 2024, at 10:00 AM in Conference Room A.",
      author: "Dean's Office",
      date: "2024-01-12",
      time: "2 days ago",
      category: "meeting",
      priority: "high",
      targetRole: "faculty",
      department: "all"
    },
    {
      id: 5,
      title: "Lab Equipment Maintenance Notice",
      content: "CS Lab 1 will be closed for equipment maintenance on January 16-17, 2024. Classes scheduled during this period will be moved to CS Lab 2.",
      author: "Lab In-Charge",
      date: "2024-01-11",
      time: "3 days ago",
      category: "maintenance",
      priority: "medium",
      targetRole: "all",
      department: "CS"
    }
  ];

  const categories = [
    { value: "all", label: "All Notices" },
    { value: "exam", label: "Exams" },
    { value: "general", label: "General" },
    { value: "registration", label: "Registration" },
    { value: "meeting", label: "Meetings" },
    { value: "maintenance", label: "Maintenance" }
  ];

  const roleBasedNotices = notices.filter(notice => 
    notice.targetRole === "all" || notice.targetRole === userRole
  );

  const filteredNotices = roleBasedNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const canCreateNotices = userRole === "admin" || userRole === "faculty" || userRole === "lab_in_charge";

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "exam": return "bg-red-100 text-red-800";
      case "general": return "bg-blue-100 text-blue-800";
      case "registration": return "bg-green-100 text-green-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      case "maintenance": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notice Board</h1>
            <p className="text-muted-foreground">Stay updated with latest announcements and notices</p>
          </div>
          {canCreateNotices && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post Notice
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="department">Department</TabsTrigger>
            {(userRole === "admin" || userRole === "faculty") && (
              <TabsTrigger value="faculty">Faculty Only</TabsTrigger>
            )}
            {userRole === "admin" && (
              <TabsTrigger value="admin">Admin Only</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          <Badge variant={getPriorityColor(notice.priority)} className="text-xs">
                            {notice.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {notice.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {notice.time}
                          </span>
                          <Badge className={`text-xs ${getCategoryColor(notice.category)}`}>
                            {notice.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{notice.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Read More</Button>
                        <Button variant="ghost" size="sm">Share</Button>
                      </div>
                      {canCreateNotices && notice.author === "Your Name" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              {filteredNotices.filter(notice => notice.category === "general").map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      {notice.title}
                    </CardTitle>
                    <CardDescription>{notice.author} • {notice.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{notice.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="department" className="space-y-4">
            <div className="space-y-4">
              {filteredNotices.filter(notice => notice.department !== "all").map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      {notice.title}
                    </CardTitle>
                    <CardDescription>
                      {notice.department} Department • {notice.author} • {notice.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{notice.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {(userRole === "admin" || userRole === "faculty") && (
            <TabsContent value="faculty" className="space-y-4">
              <div className="space-y-4">
                {filteredNotices.filter(notice => notice.targetRole === "faculty").map((notice) => (
                  <Card key={notice.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        {notice.title}
                      </CardTitle>
                      <CardDescription>{notice.author} • {notice.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{notice.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {userRole === "admin" && (
            <TabsContent value="admin" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notice Management</CardTitle>
                  <CardDescription>Create and manage system-wide notices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6" />
                      Create System Notice
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Bell className="h-6 w-6" />
                      Emergency Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notices;