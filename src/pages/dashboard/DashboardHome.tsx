import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  BarChart, 
  FileEdit, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  LineChart,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

// Define interfaces for our data structures
interface StatData {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface ActivityData {
  title: string;
  description: string;
  date: string;
  icon: JSX.Element;
}

interface TaskData {
  title: string;
  description: string;
  dueDate: string;
}

interface ResumeStrengthData {
  keywords: number;
  experience: number;
  skills: number;
  readability: number;
}

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [recentActivitiesData, setRecentActivitiesData] = useState<ActivityData[]>([]);
  const [upcomingTasksData, setUpcomingTasksData] = useState<TaskData[]>([]);
  const [resumeStrength, setResumeStrength] = useState<ResumeStrengthData | null>(null);

  // Current date greeting
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      // Placeholder data, replace with actual API calls
      setStatsData([
        { 
          title: "Resume Score", 
          value: "0", 
          trend: "",
          description: "Overall resume quality",
          icon: <LineChart className="h-5 w-5 text-blue-500" />, 
          color: "from-blue-500 to-indigo-600"
        },
        { 
          title: "Job Match Rate", 
          value: "0", 
          trend: "",
          description: "Match to job postings",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, 
          color: "from-emerald-500 to-teal-600" 
        },
        { 
          title: "Resumes Created", 
          value: "0", 
          description: "Total active resumes",
          icon: <FileText className="h-5 w-5 text-violet-500" />, 
          color: "from-violet-500 to-purple-600" 
        },
        { 
          title: "Cover Letters", 
          value: "0", 
          description: "Generated cover letters",
          icon: <FileEdit className="h-5 w-5 text-amber-500" />, 
          color: "from-amber-500 to-orange-600" 
        },
      ]);
      setRecentActivitiesData([]); // Initially empty
      setUpcomingTasksData([]); // Initially empty
      setResumeStrength({ keywords: 0, experience: 0, skills: 0, readability: 0 });
      setIsLoading(false);
    }, 1500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  // Quick actions (considered static configuration, not mock data to be removed)
  const quickActions = [
    { 
      title: "Analyze Resume", 
      description: "Get instant feedback on your current resume", 
      icon: <Upload className="h-5 w-5" />,
      link: "/dashboard/analyze",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    { 
      title: "Build New Resume", 
      description: "Create a customized resume with AI assistance", 
      icon: <FileText className="h-5 w-5" />,
      link: "/dashboard/builder",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200" 
    },
    { 
      title: "Match to Job", 
      description: "Compare your resume to a specific job posting", 
      icon: <BarChart className="h-5 w-5" />,
      link: "/dashboard/job-match",
      color: "bg-violet-50 text-violet-700 border-violet-200" 
    },
    { 
      title: "Generate Cover Letter", 
      description: "Create a tailored cover letter for your application", 
      icon: <FileEdit className="h-5 w-5" />,
      link: "/dashboard/cover-letter",
      color: "bg-amber-50 text-amber-700 border-amber-200" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{greeting}</h2>
          <p className="text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="mr-2 h-4 w-4" /> Upload New Resume
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-md">
              <div className={`h-1 w-full bg-gray-200 animate-pulse`}></div>
              <CardContent className="pt-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsData.map((stat, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-md">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}{stat.title.includes("Score") || stat.title.includes("Rate") ? "%" : ""}</h3>
                      {stat.trend && (
                        <span className={`ml-2 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-gray-500'}`}>
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Main content area - two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quick actions and Recent activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions (Remains as static UI configuration) */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              <CardDescription>Start your resume optimization process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index} 
                    to={action.link}
                    className={`group flex items-center p-4 rounded-lg border ${action.color} transition-all hover:shadow-md`}
                  >
                    <div className="mr-4 p-2 rounded-full bg-white shadow-sm">{action.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                    <ArrowUpRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
              <CardDescription>Your resume-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivitiesData.length > 0 ? (
                <div className="space-y-4">
                  {recentActivitiesData.map((activity, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 rounded-full bg-gray-100 mr-3">{activity.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" /> {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Activity</h3>
                  <p className="mt-1 text-sm text-gray-500">Your latest actions will appear here.</p>
                </div>
              )}
            </CardContent>
            {recentActivitiesData.length > 0 && !isLoading && (
              <CardFooter className="border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All Activity
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Right column - Resume analytics and upcoming tasks */}
        <div className="space-y-6">
          {/* Resume Score Visualization */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900">Resume Strength</CardTitle>
              <CardDescription>Areas of improvement</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || !resumeStrength ? (
                <div className="space-y-3 py-4 animate-pulse">
                  {Array(4).fill(0).map((_, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[ 
                    { label: "Keywords", value: resumeStrength.keywords },
                    { label: "Experience", value: resumeStrength.experience },
                    { label: "Skills", value: resumeStrength.skills },
                    { label: "Readability", value: resumeStrength.readability }
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {!isLoading && resumeStrength && (
              <CardFooter className="border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View Detailed Analysis
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Upcoming Tasks */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Tasks</CardTitle>
              <CardDescription>Items on your to-do list</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {Array(2).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingTasksData.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTasksData.map((task, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 rounded-full bg-amber-50 text-amber-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <p className="text-xs text-amber-600 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" /> Due: {task.dueDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Upcoming Tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Your to-do list is clear.</p>
                </div>
              )}
            </CardContent>
            {upcomingTasksData.length > 0 && !isLoading && (
              <CardFooter className="border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All Tasks
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Tip of the day (static, so it remains) */}
          <Card className="border border-blue-100 shadow-sm bg-blue-50">
            <CardContent className="p-5">
              <div className="flex">
                <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-3 flex-shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Resume Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Including quantifiable achievements can increase your resume's effectiveness by up to 40%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
