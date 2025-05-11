import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Home, 
  BookOpen, 
  BarChart, 
  Upload, 
  List, 
  HelpCircle, 
  FileEdit, 
  ChevronRight, 
  Briefcase
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar() {
  const location = useLocation();

  const menuItems = [
    { 
      title: "Dashboard", 
      path: "/dashboard", 
      icon: Home,
      count: 0
    },
    { 
      title: "Resume Analysis", 
      path: "/dashboard/analyze", 
      icon: Upload,
      count: 0 
    },
    { 
      title: "Resume Builder", 
      path: "/dashboard/builder", 
      icon: FileText,
      count: 0 
    },
    { 
      title: "Job Match", 
      path: "/dashboard/job-match", 
      icon: BarChart,
      count: 0 
    },
    { 
      title: "Cover Letters", 
      path: "/dashboard/cover-letter", 
      icon: FileEdit,
      count: 2,
      isNew: true 
    },
    { 
      title: "My Documents", 
      path: "/dashboard/my-resumes", 
      icon: List,
      count: 0 
    },
    { 
      title: "Job Search", 
      path: "/dashboard/jobs", 
      icon: Briefcase,
      isNew: true,
      count: 3
    },
    { 
      title: "Help & Tips", 
      path: "/dashboard/help", 
      icon: HelpCircle,
      count: 0 
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarRail className="bg-gray-50 border-r border-gray-200" />
      
      <SidebarHeader className="border-b border-gray-200 pb-4 h-16 flex items-center">
        <Link to="/" className="flex items-center p-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white mr-2">
            <FileText size={18} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Resume Pro</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    className={`group ${isActive(item.path) 
                      ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Link to={item.path} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`} size={20} />
                        <span className="ml-3 mr-2">{item.title}</span>
                        {item.isNew && (
                          <Badge className="text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-200">New</Badge>
                        )}
                      </div>
                      
                      {item.count > 0 && (
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-transparent">
                            {item.count}
                          </Badge>
                          <ChevronRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-8 px-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <BookOpen size={16} className="mr-2" />
              Pro Tips
            </h4>
            <p className="text-sm text-blue-700">
              Tailoring your resume to each job increases your chances by 60%
            </p>
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Premium Plan</span> - Active
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
