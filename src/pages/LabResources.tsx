import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TestTube, Search, Plus, Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

const LabResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");
  
  // Mock user role - in real app this would come from auth context
  const userRole: "admin" | "faculty" | "student" | "lab_in_charge" | "class_representative" = "student";

  const equipment = [
    {
      id: 1,
      name: "Oscilloscope Model XYZ-100",
      lab: "Physics Lab",
      category: "Measurement",
      status: "available",
      totalQuantity: 5,
      availableQuantity: 3,
      location: "Shelf A-1",
      lastMaintenance: "2024-01-10"
    },
    {
      id: 2,
      name: "Microscope Digital Pro",
      lab: "Biology Lab",
      category: "Optical",
      status: "available",
      totalQuantity: 8,
      availableQuantity: 6,
      location: "Cabinet B-2",
      lastMaintenance: "2024-01-08"
    },
    {
      id: 3,
      name: "Centrifuge Machine",
      lab: "Chemistry Lab",
      category: "Processing",
      status: "maintenance",
      totalQuantity: 2,
      availableQuantity: 0,
      location: "Table C-3",
      lastMaintenance: "2024-01-05"
    },
    {
      id: 4,
      name: "3D Printer Ultimaker S3",
      lab: "CS Lab 1",
      category: "Fabrication",
      status: "available",
      totalQuantity: 2,
      availableQuantity: 1,
      location: "Corner D-1",
      lastMaintenance: "2024-01-12"
    },
    {
      id: 5,
      name: "Spectrometer UV-Vis",
      lab: "Chemistry Lab",
      category: "Analysis",
      status: "borrowed",
      totalQuantity: 1,
      availableQuantity: 0,
      location: "Fume Hood E-1",
      lastMaintenance: "2024-01-06"
    }
  ];

  const requests = [
    {
      id: 1,
      equipmentName: "Oscilloscope Model XYZ-100",
      requestedBy: "John Smith",
      requestDate: "2024-01-15",
      requestedFor: "2024-01-18",
      duration: "3 hours",
      purpose: "Circuit analysis experiment",
      status: "pending",
      priority: "medium"
    },
    {
      id: 2,
      equipmentName: "3D Printer Ultimaker S3",
      requestedBy: "Sarah Johnson",
      requestDate: "2024-01-14",
      requestedFor: "2024-01-20",
      duration: "2 days",
      purpose: "Prototype development project",
      status: "approved",
      priority: "high"
    },
    {
      id: 3,
      equipmentName: "Microscope Digital Pro",
      requestedBy: "Mike Davis",
      requestDate: "2024-01-13",
      requestedFor: "2024-01-16",
      duration: "4 hours",
      purpose: "Cell structure study",
      status: "rejected",
      priority: "low"
    }
  ];

  const labs = [
    { value: "all", label: "All Labs" },
    { value: "Physics Lab", label: "Physics Lab" },
    { value: "Chemistry Lab", label: "Chemistry Lab" },
    { value: "Biology Lab", label: "Biology Lab" },
    { value: "CS Lab 1", label: "CS Lab 1" },
    { value: "CS Lab 2", label: "CS Lab 2" }
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLab = selectedLab === "all" || item.lab === selectedLab;
    return matchesSearch && matchesLab;
  });

  const canManageRequests = userRole === "lab_in_charge" || userRole === "admin";
  const canRequestEquipment = userRole === "student" || userRole === "class_representative" || userRole === "faculty";

  const getStatusColor = (status: string) => {
    switch(status) {
      case "available": return "text-green-600";
      case "borrowed": return "text-orange-600";
      case "maintenance": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "available": return "default";
      case "borrowed": return "secondary";
      case "maintenance": return "destructive";
      default: return "outline";
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "rejected": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRequestStatusIcon = (status: string) => {
    switch(status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lab Resource Management</h1>
            <p className="text-muted-foreground">Manage and request laboratory equipment</p>
          </div>
          {canRequestEquipment && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Request Equipment
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {labs.map(lab => (
              <option key={lab.value} value={lab.value}>
                {lab.label}
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipment">Equipment Inventory</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            {canManageRequests && <TabsTrigger value="manage">Manage Requests</TabsTrigger>}
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            <div className="grid gap-4">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="h-5 w-5" />
                          {item.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span>{item.lab}</span>
                          <Badge variant="outline">{item.category}</Badge>
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadge(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Available:</span>
                        <p className={`font-medium ${getStatusColor(item.status)}`}>
                          {item.availableQuantity}/{item.totalQuantity}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">{item.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Maintenance:</span>
                        <p className="font-medium">{item.lastMaintenance}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className={`font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canRequestEquipment && item.status === "available" && (
                        <Button variant="outline" size="sm">Request Equipment</Button>
                      )}
                      <Button variant="ghost" size="sm">View Details</Button>
                      {canManageRequests && (
                        <>
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Maintenance Log</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Equipment Requests</CardTitle>
                <CardDescription>Track your equipment reservation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Requested For</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.filter(req => req.requestedBy === "John Smith").map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.equipmentName}</TableCell>
                        <TableCell>{request.requestedFor}</TableCell>
                        <TableCell>{request.duration}</TableCell>
                        <TableCell>{request.purpose}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRequestStatusIcon(request.status)}
                            <span className={getRequestStatusColor(request.status)}>
                              {request.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            {request.status === "pending" && (
                              <Button variant="destructive" size="sm">Cancel</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {canManageRequests && (
            <TabsContent value="manage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Review and approve equipment requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.filter(req => req.status === "pending").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.equipmentName}</TableCell>
                          <TableCell>{request.requestedBy}</TableCell>
                          <TableCell>{request.requestedFor}</TableCell>
                          <TableCell>{request.duration}</TableCell>
                          <TableCell>
                            <Badge variant={request.priority === "high" ? "destructive" : "secondary"}>
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="default" size="sm">Approve</Button>
                              <Button variant="destructive" size="sm">Reject</Button>
                              <Button variant="outline" size="sm">Details</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Management</CardTitle>
                  <CardDescription>Add and manage lab equipment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-20 flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6" />
                      Add Equipment
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <TestTube className="h-6 w-6" />
                      Bulk Import
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      Maintenance Schedule
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

export default LabResources;