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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";

interface SemesterRegistration {
  id: string;
  name: string;
  currentStatus: "UPCOMING" | "ONGOING" | "ENDED";
  startDate: string;
  endDate: string;
}

const SemesterStatusUpdate = () => {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [newStatus, setNewStatus] = useState<"UPCOMING" | "ONGOING" | "ENDED">(
    "UPCOMING"
  );

  // Mock data - in real app this would come from API
  const semesterRegistrations: SemesterRegistration[] = [
    {
      id: "sem1",
      name: "Fall 2024 Registration",
      currentStatus: "ONGOING",
      startDate: "2024-01-10",
      endDate: "2024-04-24",
    },
    {
      id: "sem2",
      name: "Spring 2025 Registration",
      currentStatus: "UPCOMING",
      startDate: "2025-01-10",
      endDate: "2025-04-24",
    },
    {
      id: "sem3",
      name: "Summer 2024 Registration",
      currentStatus: "ENDED",
      startDate: "2024-05-10",
      endDate: "2024-08-24",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ONGOING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "ENDED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedSemesterData = semesterRegistrations.find(
    (s) => s.id === selectedSemester
  );

  const onSubmit = async () => {
    if (!selectedSemester) {
      toast({
        title: "No Semester Selected",
        description: "Please select a semester to update",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSemesterData) return;

    if (selectedSemesterData.currentStatus === newStatus) {
      toast({
        title: "No Change Required",
        description: "The selected status is the same as current status",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      updateSemesterStatus: {
        status: newStatus,
      },
    };

    try {
      console.log(
        "Update semester status payload:",
        JSON.stringify(payload, null, 2)
      );
      toast({
        title: "Semester Status Updated",
        description: `Status changed from ${selectedSemesterData.currentStatus} to ${newStatus}`,
      });

      // Update local state to reflect the change
      selectedSemesterData.currentStatus = newStatus;
      setSelectedSemester("");
      setNewStatus("UPCOMING");
    } catch (error) {
      toast({
        title: "Failed to update semester status",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Semester Status Update</h1>
          <p className="text-muted-foreground">
            Update the status of semester registrations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Update Status
              </CardTitle>
              <CardDescription>
                Change the status of a semester registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Semester Registration</Label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose semester registration" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterRegistrations.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{semester.name}</span>
                          <Badge
                            className={`ml-2 ${getStatusColor(
                              semester.currentStatus
                            )}`}
                          >
                            {semester.currentStatus}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSemesterData && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Status:</span>
                    <Badge
                      className={getStatusColor(
                        selectedSemesterData.currentStatus
                      )}
                    >
                      {selectedSemesterData.currentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Start Date:</span>
                    <span>
                      {new Date(
                        selectedSemesterData.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>End Date:</span>
                    <span>
                      {new Date(
                        selectedSemesterData.endDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>New Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: "UPCOMING" | "ONGOING" | "ENDED") =>
                    setNewStatus(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="ENDED">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={onSubmit}
                className="w-full"
                disabled={
                  !selectedSemester ||
                  selectedSemesterData?.currentStatus === newStatus
                }
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                All Semester Registrations
              </CardTitle>
              <CardDescription>
                Overview of all semester registration statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {semesterRegistrations.map((semester) => (
                  <div
                    key={semester.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{semester.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(semester.startDate).toLocaleDateString()} -{" "}
                        {new Date(semester.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(semester.currentStatus)}>
                      {semester.currentStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Status Transition Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor("UPCOMING")}>UPCOMING</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registration is scheduled but not yet active. Students cannot
                  enroll yet.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor("ONGOING")}>ONGOING</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registration is active. Students can enroll in courses during
                  this period.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor("ENDED")}>ENDED</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registration period has ended. No more enrollments are
                  allowed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SemesterStatusUpdate;
