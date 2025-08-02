import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotebookPen, Search, Plus, Download, Eye, Calendar, User, FileText, Video, Image } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

const Lectures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  
  // Mock user role - in real app this would come from auth context
  const userRole = "faculty"; // admin | faculty | student | lab_in_charge | class_representative

  const lectures = [
    {
      id: 1,
      title: "Introduction to Variables and Data Types",
      course: "CS101",
      courseName: "Computer Science Fundamentals",
      topic: "Variables and Data Types",
      uploadedBy: "Dr. Smith",
      uploadDate: "2024-01-15",
      scheduleDate: "2024-01-16",
      type: "video",
      duration: "45 minutes",
      fileSize: "125 MB",
      description: "This lecture covers the fundamentals of variables and different data types in programming.",
      downloads: 48,
      views: 152,
      materials: ["slides.pdf", "code_examples.py", "assignment.docx"]
    },
    {
      id: 2,
      title: "Advanced Integration Techniques",
      course: "MATH201",
      courseName: "Advanced Mathematics", 
      topic: "Integration by Parts",
      uploadedBy: "Prof. Johnson",
      uploadDate: "2024-01-14",
      scheduleDate: "2024-01-15",
      type: "pdf",
      duration: "60 minutes",
      fileSize: "8.5 MB",
      description: "Comprehensive guide to integration by parts with step-by-step examples and practice problems.",
      downloads: 35,
      views: 89,
      materials: ["lecture_notes.pdf", "practice_problems.pdf", "solutions.pdf"]
    },
    {
      id: 3,
      title: "Quantum Mechanics Lab Procedures",
      course: "PHY301",
      courseName: "Quantum Physics",
      topic: "Quantum Experiments",
      uploadedBy: "Dr. Wilson",
      uploadDate: "2024-01-13",
      scheduleDate: "2024-01-14",
      type: "video",
      duration: "90 minutes",
      fileSize: "285 MB",
      description: "Detailed demonstration of quantum mechanics laboratory procedures and safety protocols.",
      downloads: 22,
      views: 67,
      materials: ["lab_manual.pdf", "safety_guide.pdf", "equipment_list.xlsx"]
    },
    {
      id: 4,
      title: "Database Design Principles",
      course: "CS201",
      courseName: "Database Systems",
      topic: "Normalization",
      uploadedBy: "Dr. Smith",
      uploadDate: "2024-01-12",
      scheduleDate: "2024-01-13",
      type: "presentation",
      duration: "55 minutes",
      fileSize: "12.3 MB",
      description: "Understanding database normalization forms and their practical applications.",
      downloads: 41,
      views: 98,
      materials: ["slides.pptx", "examples.sql", "exercise.docx"]
    }
  ];

  const courses = [
    { value: "all", label: "All Courses" },
    { value: "CS101", label: "CS101 - Computer Science Fundamentals" },
    { value: "MATH201", label: "MATH201 - Advanced Mathematics" },
    { value: "PHY301", label: "PHY301 - Quantum Physics" },
    { value: "CS201", label: "CS201 - Database Systems" }
  ];

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || lecture.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const canUploadLectures = userRole === "faculty" || userRole === "admin";

  const getFileTypeIcon = (type: string) => {
    switch(type) {
      case "video": return <Video className="h-5 w-5 text-blue-600" />;
      case "pdf": return <FileText className="h-5 w-5 text-red-600" />;
      case "presentation": return <Image className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    switch(type) {
      case "video": return "bg-blue-100 text-blue-800";
      case "pdf": return "bg-red-100 text-red-800";
      case "presentation": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lecture Sharing</h1>
            <p className="text-muted-foreground">
              {canUploadLectures 
                ? "Upload and manage class lectures by scheduled topics"
                : "Access uploaded lectures anytime by schedule"
              }
            </p>
          </div>
          {canUploadLectures && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Lecture
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search lectures, topics..." 
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
            {courses.map(course => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Lectures</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            {canUploadLectures && <TabsTrigger value="manage">Manage</TabsTrigger>}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredLectures.map((lecture) => (
                <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {getFileTypeIcon(lecture.type)}
                          {lecture.title}
                        </CardTitle>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{lecture.course}</Badge>
                          <span className="text-sm text-muted-foreground">{lecture.courseName}</span>
                          <Badge className={`text-xs ${getFileTypeBadge(lecture.type)}`}>
                            {lecture.type}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {lecture.uploadedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Scheduled: {lecture.scheduleDate}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {lecture.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <p className="font-medium">{lecture.duration}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">File Size:</span>
                          <p className="font-medium">{formatFileSize(lecture.fileSize)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Downloads:</span>
                          <p className="font-medium">{lecture.downloads}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Views:</span>
                          <p className="font-medium">{lecture.views}</p>
                        </div>
                      </div>

                      {lecture.materials.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Additional Materials:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {lecture.materials.map((material, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">Add to Favorites</Button>
                        {canUploadLectures && lecture.uploadedBy === "Dr. Smith" && (
                          <>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4">
              {filteredLectures.slice(0, 3).map((lecture) => (
                <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getFileTypeIcon(lecture.type)}
                      {lecture.title}
                    </CardTitle>
                    <CardDescription>{lecture.uploadedBy} • {lecture.uploadDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Lectures</CardTitle>
                <CardDescription>Your bookmarked lectures for quick access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-muted-foreground">
                  <NotebookPen className="h-12 w-12 mx-auto mb-4" />
                  <p>No favorite lectures yet</p>
                  <p className="text-sm">Add lectures to favorites for quick access</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canUploadLectures && (
            <TabsContent value="manage" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Lecture</CardTitle>
                    <CardDescription>Upload class lectures by scheduled topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-20 flex flex-col items-center gap-2">
                        <Plus className="h-6 w-6" />
                        Upload Video
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Upload PDF
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                        <Image className="h-6 w-6" />
                        Upload Presentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Lectures</CardTitle>
                    <CardDescription>Lectures you have uploaded</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {lectures.filter(l => l.uploadedBy === "Dr. Smith").length}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Lectures</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {lectures.filter(l => l.uploadedBy === "Dr. Smith").reduce((sum, l) => sum + l.views, 0)}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">
                          {lectures.filter(l => l.uploadedBy === "Dr. Smith").reduce((sum, l) => sum + l.downloads, 0)}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Downloads</p>
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

export default Lectures;