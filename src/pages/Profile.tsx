import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  useChangePasswordMutation,
  useGetMeQuery,
} from "@/components/Redux/service/AuthApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Book,
  Edit,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [ChangePassword] = useChangePasswordMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data } = useGetMeQuery();
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await ChangePassword(passwords); // এখানে তোমার পাসওয়ার্ড চেঞ্জ করার লজিক বসাও
      if (res?.data?.success) {
        toast({
          title: "Password changed",
          description: "You are logged in with your new password.",
        });
        navigate("/login");
        setLoading(false);
      } else {
        toast({
          title: "Failed to change password",
          description: res?.error?.data?.message || "Something went wrong",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Failed to change password",
        description: "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  const user = data?.data;
  console.log(data.data);
  // Mock user role - in real app this would come from auth context
  const userRole:
    | "admin"
    | "faculty"
    | "student"
    | "lab_in_charge"
    | "class_representative" = "student";

  const userProfile = {
    // Personal Information (Editable by user)
    personal: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@university.edu",
      phone: "+1 (555) 123-4567",
      address: "123 University Ave, College Town, ST 12345",
      dateOfBirth: "1998-05-15",
      profilePicture: "",
      emergencyContact: {
        name: "Jane Smith",
        relationship: "Mother",
        phone: "+1 (555) 987-6543",
      },
    },

    // Academic Information (Read-only, editable by admin only)
    academic: {
      studentId: "ST2024001",
      department: "Computer Science",
      program: "Bachelor of Science",
      year: "3rd Year",
      semester: "Fall 2024",
      advisor: "Dr. Smith",
      gpa: 3.85,
      enrollmentDate: "2022-08-15",
      expectedGraduation: "2026-05-15",
      status: "Active",
    },

    // Course Information
    courses: [
      {
        code: "CS101",
        name: "Computer Science Fundamentals",
        credits: 3,
        grade: "A",
        semester: "Fall 2024",
      },
      {
        code: "MATH201",
        name: "Advanced Mathematics",
        credits: 4,
        grade: "A-",
        semester: "Fall 2024",
      },
      {
        code: "PHY301",
        name: "Quantum Physics",
        credits: 3,
        grade: "B+",
        semester: "Fall 2024",
      },
    ],

    // Activities and Achievements
    activities: {
      clubs: ["Computer Science Club", "Math Society"],
      achievements: [
        "Dean's List Fall 2023",
        "Programming Contest Winner 2024",
      ],
      projects: ["Student Portal Development", "AI Research Assistant"],
    },
  };

  const canEditAcademic = userRole === "admin";

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...userProfile.personal });
  };

  const handleSave = () => {
    // Save changes logic here
    setIsEditing(false);
    console.log("Saving profile changes:", editedProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "faculty":
        return "Faculty Member";
      case "student":
        return "Student";
      case "lab_in_charge":
        return "Lab In-Charge";
      case "class_representative":
        return "Class Representative";
      default:
        return "User";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal and academic information
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user?.profileImg} />
                  {/* <AvatarFallback className="text-lg">
                    {getInitials(user?.name?.firstName, user?.name?.lastName)}
                  </AvatarFallback> */}
                </Avatar>
                <CardTitle>{user?.fullName}</CardTitle>
                <CardDescription className="space-y-1">
                  <Badge variant="secondary">
                    {getRoleDisplayName(user?.user?.role)}
                  </Badge>

                  <p className="text-sm">ID: {user?.user?.id}</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.contactNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{user?.presentAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.academicDepartment?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Enrolled Courses
                  </span>
                  <span className="font-medium">
                    {userProfile.courses.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={user?.user?.isDeleted ? "destructive" : "default"}
                  >
                    {user?.user?.isDeleted ? "Inactive" : "Active"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="activities">Change Password</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={
                            isEditing
                              ? editedProfile.firstName || user?.name?.firstName
                              : user?.name?.firstName
                          }
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={
                            isEditing
                              ? editedProfile.lastName || user?.name?.lastName
                              : user?.name?.lastName
                          }
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={
                            isEditing
                              ? editedProfile.email || user?.email
                              : user?.email
                          }
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={
                            isEditing
                              ? editedProfile.contactNo || user?.contactNo
                              : user?.contactNo
                          }
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={
                            isEditing
                              ? editedProfile.presentAddress ||
                                user?.presentAddress
                              : user?.presentAddress
                          }
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={
                            isEditing
                              ? editedProfile.dateOfBirth || user?.dateOfBirth
                              : user?.dateOfBirth
                          }
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {user?.user?.role == "student" && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Emergency Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="emergencyName">Contact Name</Label>
                            <Input
                              id="fatherName"
                              value={user?.guardian?.fatherName}
                              disabled={!isEditing}
                            />
                          </div>

                          <div>
                            <Label htmlFor="emergencyPhone">Phone</Label>
                            <Input
                              id="emergencyPhone"
                              value={user?.guardian?.fatherContactNo}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>
                      Academic details{" "}
                      {canEditAcademic ? "(editable by admin)" : "(read-only)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={user?.user?.id}
                          disabled={!canEditAcademic}
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Academic Faculty</Label>
                        <Input
                          id="year"
                          value={user?.academicFaculty?.name}
                          disabled={!canEditAcademic}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={user?.academicDepartment?.name}
                          disabled={!canEditAcademic}
                        />
                      </div>
                      {user?.user?.role == "student" ? (
                        <div>
                          <Label htmlFor="program">Program</Label>
                          <Input
                            id="program"
                            value={"Bachelor of Science"}
                            disabled={!canEditAcademic}
                          />
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="program">Program</Label>
                          <Input
                            id="program"
                            value={"Faculty Member"}
                            disabled={!canEditAcademic}
                          />
                        </div>
                      )}

                      {/* <div>
                        <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                        <Input
                          id="enrollmentDate"
                          type="date"
                          value={userProfile.academic.enrollmentDate}
                          disabled={!canEditAcademic}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedGraduation">
                          Expected Graduation
                        </Label>
                        <Input
                          id="expectedGraduation"
                          type="date"
                          value={userProfile.academic.expectedGraduation}
                          disabled={!canEditAcademic}
                        />
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Courses</CardTitle>
                    <CardDescription>
                      Your enrolled courses and grades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userProfile.courses.map((course, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{course.code}</Badge>
                              <span className="font-medium">{course.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {course.credits} Credits • {course.semester}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-medium ${getGradeColor(
                                course.grade
                              )}`}
                            >
                              {course.grade}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <div className="grid gap-4">
                  <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div className="relative">
                      <Label htmlFor="oldPassword">Old Password</Label>
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={oldPasswordVisible ? "text" : "password"}
                        value={passwords.oldPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="absolute right-3 top-[38px] cursor-pointer"
                        onClick={() =>
                          setOldPasswordVisible(!oldPasswordVisible)
                        }
                      >
                        {oldPasswordVisible ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </span>
                    </div>

                    <div className="relative">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={newPasswordVisible ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="absolute right-3 top-[38px] cursor-pointer"
                        onClick={() =>
                          setNewPasswordVisible(!newPasswordVisible)
                        }
                      >
                        {newPasswordVisible ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </span>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
