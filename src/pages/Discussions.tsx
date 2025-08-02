import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useGetMeQuery } from "@/components/Redux/service/AuthApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  MessageCircle,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  ThumbsUp,
  User,
} from "lucide-react";
import { useState } from "react";

const Discussions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Mock user role - in real app this would come from auth context
  const { data } = useGetMeQuery();
  const userRole = data?.data?.user?.role; // admin | faculty | student | lab_in_charge | class_representative

  const discussions = [
    {
      id: 1,
      title: "CS101 - Variables and Data Types Discussion",
      course: "CS101",
      courseName: "Computer Science Fundamentals",
      author: "Dr. Smith",
      createdAt: "2024-01-15T10:00:00",
      lastActivity: "2024-01-15T14:30:00",
      replies: 23,
      likes: 15,
      isActive: true,
      tags: ["variables", "data-types", "fundamentals"],
    },
    {
      id: 2,
      title: "MATH201 - Integration by Parts Problems",
      course: "MATH201",
      courseName: "Advanced Mathematics",
      author: "Prof. Johnson",
      createdAt: "2024-01-14T15:20:00",
      lastActivity: "2024-01-15T12:15:00",
      replies: 18,
      likes: 12,
      isActive: true,
      tags: ["integration", "calculus", "problem-solving"],
    },
    {
      id: 3,
      title: "PHY301 - Quantum Mechanics Lab Results",
      course: "PHY301",
      courseName: "Quantum Physics",
      author: "Sarah Wilson",
      createdAt: "2024-01-13T09:45:00",
      lastActivity: "2024-01-14T16:20:00",
      replies: 31,
      likes: 28,
      isActive: false,
      tags: ["quantum", "lab-results", "experiments"],
    },
  ];

  const messages = [
    {
      id: 1,
      discussionId: 1,
      author: "John Smith",
      role: "student",
      content:
        "Can someone explain the difference between int and float data types with examples?",
      timestamp: "2024-01-15T10:30:00",
      likes: 5,
      replies: 3,
      attachments: [],
      isReply: false,
      parentId: null,
    },
    {
      id: 2,
      discussionId: 1,
      author: "Dr. Smith",
      role: "faculty",
      content:
        "Great question! An int stores whole numbers like 5, -3, 0, while float stores decimal numbers like 3.14, -2.5. Here's a simple example...",
      timestamp: "2024-01-15T11:00:00",
      likes: 12,
      replies: 1,
      attachments: ["code_example.py"],
      isReply: true,
      parentId: 1,
    },
    {
      id: 3,
      discussionId: 1,
      author: "Mike Davis",
      role: "student",
      content:
        "Thanks for the explanation! This really helps with my assignment.",
      timestamp: "2024-01-15T14:30:00",
      likes: 3,
      replies: 0,
      attachments: [],
      isReply: true,
      parentId: 2,
    },
  ];

  const filteredDiscussions = discussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "faculty":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "class_representative":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Discussion Panel</h1>
            <p className="text-muted-foreground">
              Topic-based discussions linked to scheduled classes
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start Discussion
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Discussion List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {discussion.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{discussion.course}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {discussion.courseName}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {discussion.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {discussion.isActive && (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {discussion.author}
                      </span>
                      <span>
                        Last activity {formatTimeAgo(discussion.lastActivity)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {discussion.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {discussion.likes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Discussion */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  CS101 - Variables and Data Types
                </CardTitle>
                <CardDescription>Computer Science Fundamentals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isReply ? "ml-6" : ""}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {getInitials(message.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.author}
                          </span>
                          <Badge
                            className={`text-xs ${getRoleColor(message.role)}`}
                          >
                            {message.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {message.content}
                        </p>
                        {message.attachments.length > 0 && (
                          <div className="flex gap-1">
                            {message.attachments.map((file, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                <Paperclip className="h-2 w-2 mr-1" />
                                {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <ThumbsUp className="h-3 w-3" />
                            {message.likes}
                          </button>
                          <button className="text-muted-foreground hover:text-primary">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discussion Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Discussions
                  </span>
                  <span className="font-medium">{discussions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Active Discussions
                  </span>
                  <span className="font-medium">
                    {discussions.filter((d) => d.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Your Contributions
                  </span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Replies</span>
                  <span className="font-medium">
                    {discussions.reduce((sum, d) => sum + d.replies, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Discussions;
