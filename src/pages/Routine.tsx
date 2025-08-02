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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Plus, Users } from "lucide-react";
import { useState } from "react";

const Routine = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Mock user role - in real app this would come from auth context
  const { data } = useGetMeQuery();
  const userRole = data?.data?.user?.role;
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const classrooms = ["A-201", "A-202", "B-101", "B-102", "C-301"];
  const labs = ["CS Lab 1", "CS Lab 2", "Physics Lab", "Chemistry Lab"];

  const schedule = {
    "A-201": {
      "9:00 AM": { course: "CS101", teacher: "Dr. Smith", status: "active" },
      "11:00 AM": {
        course: "MATH201",
        teacher: "Prof. Johnson",
        status: "active",
      },
      "2:00 PM": { course: "Available", status: "vacant" },
    },
    "A-202": {
      "10:00 AM": { course: "ENG101", teacher: "Dr. Brown", status: "active" },
      "1:00 PM": { course: "Available", status: "vacant" },
    },
    "CS Lab 1": {
      "9:00 AM": { course: "CS Lab", teacher: "Dr. Wilson", status: "active" },
      "2:00 PM": { course: "Available", status: "vacant" },
    },
  };

  const canModifySchedule = userRole === "admin" || userRole === "faculty";
  const canRequestReservation = userRole === "class_representative";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500";
      case "vacant":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Class Routine</h1>
            <p className="text-muted-foreground">
              Interactive real-time schedule management
            </p>
          </div>
          {canModifySchedule && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Routing
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="classrooms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="classrooms" className="space-y-4">
            <div className="grid gap-4">
              {classrooms.map((room) => (
                <Card key={room}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {room}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {timeSlots.map((time) => {
                        const classInfo = schedule[room]?.[time];
                        return (
                          <div key={time} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {time}
                              </span>
                              <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(
                                  classInfo?.status || "vacant"
                                )}`}
                              ></div>
                            </div>
                            {classInfo && classInfo.status === "active" ? (
                              <div>
                                <Badge
                                  variant="secondary"
                                  className="text-xs mb-1"
                                >
                                  {classInfo.course}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {classInfo.teacher}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <span className="text-xs text-green-600">
                                  Available
                                </span>
                                {canRequestReservation && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-1 text-xs"
                                  >
                                    Booking
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-4">
            <div className="grid gap-4">
              {labs.map((lab) => (
                <Card key={lab}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {lab}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {timeSlots.map((time) => {
                        const classInfo = schedule[lab]?.[time];
                        return (
                          <div key={time} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {time}
                              </span>
                              <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(
                                  classInfo?.status || "vacant"
                                )}`}
                              ></div>
                            </div>
                            {classInfo && classInfo.status === "active" ? (
                              <div>
                                <Badge
                                  variant="secondary"
                                  className="text-xs mb-1"
                                >
                                  {classInfo.course}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {classInfo.teacher}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <span className="text-xs text-green-600">
                                  Available
                                </span>
                                {canRequestReservation && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-1 text-xs"
                                  >
                                    Request
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule View</CardTitle>
                <CardDescription>
                  Calendar-style overview of all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>
                    Calendar view will be implemented with a proper calendar
                    component
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Routine;
