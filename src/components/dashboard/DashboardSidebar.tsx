
import { Link, useLocation } from "react-router-dom";
import { FileText, Home, BookOpen, BarChart, Upload, List, HelpCircle, PlusCircle } from "lucide-react";
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

export function DashboardSidebar() {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Analyze Resume", path: "/dashboard/analyze", icon: Upload },
    { title: "Resume Builder", path: "/dashboard/builder", icon: FileText },
    { title: "Job Match", path: "/dashboard/job-match", icon: BarChart },
    { title: "Cover Letter", path: "/dashboard/cover-letter", icon: PlusCircle },
    { title: "My Resumes", path: "/dashboard/my-resumes", icon: List },
    { title: "Help & Tips", path: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <Link to="/" className="flex items-center p-2">
          <span className="ml-2 text-xl font-bold gradient-text">AI Resume Pro</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-4">
        <div className="px-3 py-2">
          <div className="text-xs text-muted-foreground">
            © 2025 AI Resume Pro
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
