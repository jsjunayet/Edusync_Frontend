import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage students, faculty, and admin accounts with role-based access control."
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Handle course enrollment, attendance tracking, and academic records."
    },
    {
      icon: Calendar,
      title: "Class Scheduling",
      description: "Organize class routines, room reservations, and academic calendar."
    },
    {
      icon: GraduationCap,
      title: "Academic Resources",
      description: "Share lectures, manage lab resources, and facilitate discussions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary mb-6">EduSync</h1>
          <p className="text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete Education Management System for Modern Academic Institutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-4"
            >
              Access Portal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-4"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of educational institutions using EduSync to streamline their academic operations.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg px-8 py-4"
          >
            Login to Your Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 EduSync. Built for modern education management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
