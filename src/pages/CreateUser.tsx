import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useGetAcademicDepartmentQuery } from "@/components/Redux/service/AcademicDepartmentApi";
import { useGetAcademicFacultyQuery } from "@/components/Redux/service/AcademicFacultyApi";
import { useGetAcademicSemesterQuery } from "@/components/Redux/service/AcademicSemester";
import { usePostRegisterMutation } from "@/components/Redux/service/AuthApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UserRole = "admin" | "faculty" | "student";

interface CreateUserForm {
  role: UserRole;
  password: string;
  profileImage?: FileList;

  // Admin fields
  "admin.designation"?: string;
  "admin.name.firstName"?: string;
  "admin.name.middleName"?: string;
  "admin.name.lastName"?: string;
  "admin.gender"?: string;
  "admin.dateOfBirth"?: string;
  "admin.email"?: string;
  "admin.contactNo"?: string;
  "admin.emergencyContactNo"?: string;
  "admin.bloogGroup"?: string;
  "admin.presentAddress"?: string;
  "admin.permanentAddress"?: string;

  // Faculty fields
  "faculty.designation"?: string;
  "faculty.name.firstName"?: string;
  "faculty.name.middleName"?: string;
  "faculty.name.lastName"?: string;
  "faculty.gender"?: string;
  "faculty.dateOfBirth"?: string;
  "faculty.email"?: string;
  "faculty.contactNo"?: string;
  "faculty.emergencyContactNo"?: string;
  "faculty.bloogGroup"?: string;
  "faculty.presentAddress"?: string;
  "faculty.permanentAddress"?: string;
  "faculty.academicFacultyId"?: string;
  "faculty.academicDepartment"?: string;

  // Student fields
  "student.name.firstName"?: string;
  "student.name.middleName"?: string;
  "student.name.lastName"?: string;
  "student.gender"?: string;
  "student.dateOfBirth"?: string;
  "student.email"?: string;
  "student.contactNo"?: string;
  "student.emergencyContactNo"?: string;
  "student.bloogGroup"?: string;
  "student.presentAddress"?: string;
  "student.permanentAddress"?: string;
  "student.academicFacultyId"?: string;
  "student.academicDepartment"?: string;
  "student.admissionSemester"?: string;
  "student.guardian.fatherName"?: string;
  "student.guardian.motherName"?: string;
  "student.guardian.fatherOccupation"?: string;
  "student.guardian.motherOccupation"?: string;
  "student.guardian.fatherContactNo"?: string;
  "student.guardian.motherContactNo"?: string;
  "student.localGuardian.name"?: string;
  "student.localGuardian.occupation"?: string;
  "student.localGuardian.contactNo"?: string;
  "student.localGuardian.address"?: string;
  "student.localGuardian.relation"?: string;
  "student.graduationStatus"?: string;
}

const CreateUser = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { data: Academic } = useGetAcademicDepartmentQuery();
  const { data } = useGetAcademicFacultyQuery();
  const { data: semester } = useGetAcademicSemesterQuery();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [postRegister] = usePostRegisterMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>();

  const onSubmit = async (formDataValues: CreateUserForm) => {
    const formData = new FormData();
    setIsLoading(true);
    // Extract role
    const role = formDataValues.role;

    // Add the image file (if exists)
    if (formDataValues.profileImage?.[0]) {
      formData.append("file", formDataValues.profileImage[0]);
    }

    // Create payload with only the selected role
    const payload: any = {
      password: formDataValues.password,
      role: formDataValues.role,
    };

    if (role === "admin") {
      payload.admin = formDataValues.admin;
    } else if (role === "faculty") {
      payload.faculty = formDataValues.faculty;
    } else if (role === "student") {
      payload.student = formDataValues.student;
    }

    // Append `data` as a stringified JSON
    formData.append("data", JSON.stringify(payload));

    // ✅ Debug: log formData entries
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await postRegister({ formData, role }).unwrap();
      console.log(res);
      toast({ title: "User created successfully!" });
      setIsLoading(false);
      reset();
    } catch (error) {
      toast({ title: "Failed to create user", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const renderPersonalInfo = (prefix: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`${prefix}.name.firstName`}>First Name *</Label>
          <Input
            id={`${prefix}.name.firstName`}
            {...register(`${prefix}.name.firstName` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}.name.middleName`}>Middle Name</Label>
          <Input
            id={`${prefix}.name.middleName`}
            {...register(`${prefix}.name.middleName` as keyof CreateUserForm)}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}.name.lastName`}>Last Name *</Label>
          <Input
            id={`${prefix}.name.lastName`}
            {...register(`${prefix}.name.lastName` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}.gender`}>Gender *</Label>
          <Select
            onValueChange={(value) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`${prefix}.gender` as any, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${prefix}.dateOfBirth`}>Date of Birth *</Label>
          <Input
            id={`${prefix}.dateOfBirth`}
            type="date"
            {...register(`${prefix}.dateOfBirth` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}.email`}>Email *</Label>
          <Input
            id={`${prefix}.email`}
            type="email"
            {...register(`${prefix}.email` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}.contactNo`}>Contact Number *</Label>
          <Input
            id={`${prefix}.contactNo`}
            {...register(`${prefix}.contactNo` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}.emergencyContactNo`}>
            Emergency Contact *
          </Label>
          <Input
            id={`${prefix}.emergencyContactNo`}
            {...register(
              `${prefix}.emergencyContactNo` as keyof CreateUserForm,
              { required: true }
            )}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}.bloogGroup`}>Blood Group *</Label>
          <Select
            onValueChange={(value) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(`${prefix}.bloogGroup` as any, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}.presentAddress`}>Present Address *</Label>
          <Textarea
            id={`${prefix}.presentAddress`}
            {...register(`${prefix}.presentAddress` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}.permanentAddress`}>
            Permanent Address *
          </Label>
          <Textarea
            id={`${prefix}.permanentAddress`}
            {...register(`${prefix}.permanentAddress` as keyof CreateUserForm, {
              required: true,
            })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create User</h1>
          <p className="text-muted-foreground">
            Add a new user to the EduSync system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Registration Form</CardTitle>
            <CardDescription>
              Fill in the details below to create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Account Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      onValueChange={(value: UserRole) => {
                        setSelectedRole(value);
                        setValue("role", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  {...register("profileImage")}
                />
              </div>

              {/* Role-specific fields */}
              {selectedRole === "admin" && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="admin.designation">Designation *</Label>
                    <Input
                      id="admin.designation"
                      {...register("admin.designation", { required: true })}
                    />
                  </div>
                  {renderPersonalInfo("admin")}
                </div>
              )}

              {selectedRole === "faculty" && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="faculty.designation">Designation *</Label>
                    <Input
                      id="faculty.designation"
                      {...register("faculty.designation", { required: true })}
                    />
                  </div>
                  {renderPersonalInfo("faculty")}

                  {/* Academic Info for Faculty */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="faculty.academicFacultyId">
                          Academic Faculty *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setValue("faculty.academicFacultyId" as any, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.data?.map((item) => (
                              <SelectItem key={item._id} value={`${item._id}`}>
                                {`${item.name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="faculty.academicDepartment">
                          Department *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              "faculty.academicDepartment" as any,
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {Academic?.data?.map((item) => (
                              <SelectItem key={item._id} value={`${item._id}`}>
                                {`${item.name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === "student" && (
                <div className="space-y-6">
                  {renderPersonalInfo("student")}

                  {/* Academic Info for Student */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="student.academicFacultyId">
                          Academic Faculty *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setValue("student.academicFacultyId" as any, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.data?.map((item) => (
                              <SelectItem key={item._id} value={`${item._id}`}>
                                {`${item.name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="student.academicDepartment">
                          Department *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              "student.academicDepartment" as any,
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {Academic?.data?.map((item) => (
                              <SelectItem key={item._id} value={`${item._id}`}>
                                {`${item.name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="student.admissionSemester">
                          Semester *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setValue("student.admissionSemester" as any, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semester?.data?.map((item) => (
                              <SelectItem key={item._id} value={`${item._id}`}>
                                {`${item.name} ${item.year}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="student.guardian.fatherName">
                          Father's Name *
                        </Label>
                        <Input
                          id="student.guardian.fatherName"
                          {...register("student.guardian.fatherName", {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.guardian.motherName">
                          Mother's Name *
                        </Label>
                        <Input
                          id="student.guardian.motherName"
                          {...register("student.guardian.motherName", {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.guardian.fatherOccupation">
                          Father's Occupation
                        </Label>
                        <Input
                          id="student.guardian.fatherOccupation"
                          {...register("student.guardian.fatherOccupation")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.guardian.motherOccupation">
                          Mother's Occupation
                        </Label>
                        <Input
                          id="student.guardian.motherOccupation"
                          {...register("student.guardian.motherOccupation")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.guardian.fatherContactNo">
                          Father's Contact
                        </Label>
                        <Input
                          id="student.guardian.fatherContactNo"
                          {...register("student.guardian.fatherContactNo")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.guardian.motherContactNo">
                          Mother's Contact
                        </Label>
                        <Input
                          id="student.guardian.motherContactNo"
                          {...register("student.guardian.motherContactNo")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Local Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Local Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="student.localGuardian.name">
                          Local Guardian Name
                        </Label>
                        <Input
                          id="student.localGuardian.name"
                          {...register("student.localGuardian.name")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.localGuardian.occupation">
                          Occupation
                        </Label>
                        <Input
                          id="student.localGuardian.occupation"
                          {...register("student.localGuardian.occupation")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.localGuardian.contactNo">
                          Contact Number
                        </Label>
                        <Input
                          id="student.localGuardian.contactNo"
                          {...register("student.localGuardian.contactNo")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="student.localGuardian.relation">
                          Relation
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              "student.localGuardian.relation" as any,
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uncle">Uncle</SelectItem>
                            <SelectItem value="aunt">Aunt</SelectItem>
                            <SelectItem value="cousin">Cousin</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="student.localGuardian.address">
                        Address
                      </Label>
                      <Textarea
                        id="student.localGuardian.address"
                        {...register("student.localGuardian.address")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {selectedRole && (
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : `Create ${selectedRole}`}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
