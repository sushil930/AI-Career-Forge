import { BellIcon, Search, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function TopNav() {
  const { user, logout } = useAuth();
  const [hasNotifications] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Format initials from email or name
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(name => name[0]).join('').toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Format user display name or email
  const getDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <header className="border-b border-gray-200 bg-white h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <SidebarTrigger className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100" />
        <div className="relative w-full max-w-[180px] sm:max-w-[240px] md:max-w-[260px] hidden sm:block">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full text-sm pl-7 sm:pl-9 py-1.5 sm:py-2 rounded-lg border-gray-200 focus:border-blue-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden md:block">
          <Button variant="outline" size="sm" className="gap-2 text-gray-700 border-gray-200">
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </Button>
        </div>
        


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-4 rounded-full hover:bg-gray-100">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-gray-200">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs sm:text-sm">{getInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium text-sm text-gray-700">{getDisplayName()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center cursor-pointer text-sm">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center cursor-pointer text-sm">
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center cursor-pointer text-red-600 focus:text-red-600 text-sm" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
