
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, BarChart, FileEdit } from "lucide-react";

export default function DashboardHome() {
  // Mock stats data
  const stats = [
    { 
      title: "Uploaded Resumes", 
      value: 3, 
      icon: <Upload className="h-5 w-5 text-theme-blue" />, 
      color: "bg-blue-50" 
    },
    { 
      title: "Average Score", 
      value: "82%", 
      icon: <BarChart className="h-5 w-5 text-theme-emerald" />, 
      color: "bg-green-50" 
    },
    { 
      title: "Generated Resumes", 
      value: 2, 
      icon: <FileText className="h-5 w-5 text-orange-500" />, 
      color: "bg-orange-50" 
    },
    { 
      title: "Job Matches Done", 
      value: 5, 
      icon: <BarChart className="h-5 w-5 text-purple-500" />, 
      color: "bg-purple-50" 
    },
  ];

  // Quick actions
  const quickActions = [
    { 
      title: "Upload Resume", 
      description: "Analyze your existing resume", 
      icon: <Upload className="h-8 w-8 text-white" />,
      link: "/dashboard/analyze",
      color: "bg-theme-blue"
    },
    { 
      title: "Build Resume", 
      description: "Create a new resume with AI", 
      icon: <FileText className="h-8 w-8 text-white" />,
      link: "/dashboard/builder",
      color: "bg-theme-emerald" 
    },
    { 
      title: "Match to Job Role", 
      description: "See how well your resume matches a job", 
      icon: <BarChart className="h-8 w-8 text-white" />,
      link: "/dashboard/job-match",
      color: "bg-orange-500" 
    },
    { 
      title: "Generate Cover Letter", 
      description: "Create a targeted cover letter", 
      icon: <FileEdit className="h-8 w-8 text-white" />,
      link: "/dashboard/cover-letter",
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your resume activities.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className={`${action.color} py-4 px-6`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{action.title}</CardTitle>
                  {action.icon}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button asChild className="w-full">
                  <Link to={action.link}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Recent Activity (Placeholder) */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground py-6 text-center">
              Your recent activities will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
