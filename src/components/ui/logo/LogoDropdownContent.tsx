
import React from "react";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import UserProfile from "./UserProfile";
import UsageStats from "./UsageStats";
import ProjectActions from "./ProjectActions";

interface LogoDropdownContentProps {
  isOutboundPage?: boolean;
  user: User | null;
  align?: "start" | "end" | "center";
}

const LogoDropdownContent: React.FC<LogoDropdownContentProps> = ({
  isOutboundPage = false,
  user,
  align = "start"
}) => {
  const navigate = useNavigate();
  
  const handleDashboardClick = () => {
    navigate("/simple");
  };

  return (
    <DropdownMenuContent 
      align={align} 
      className={`w-72 p-0 ${isOutboundPage ? "bg-minimal-gray-800 border-minimal-gray-700" : "bg-white border-minimal-gray-200"}`}
    >
      {user && (
        <>
          <UserProfile user={user} isOutboundPage={isOutboundPage} />
          <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
        </>
      )}
      
      {/* Dashboard Button */}
      <div className="p-2">
        <DropdownMenuItem 
          className={`px-3 py-2.5 rounded-md ${isOutboundPage ? "hover:bg-minimal-gray-700 text-minimal-white" : "hover:bg-minimal-gray-100 text-minimal-gray-900"}`}
          onClick={handleDashboardClick}
        >
          <div className="flex items-center gap-2">
            <Database size={16} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
            <span>Dashboard</span>
          </div>
        </DropdownMenuItem>
      </div>
      
      <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
      
      {/* Usage Limits */}
      <UsageStats isOutboundPage={isOutboundPage} />
      
      <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
      
      {/* Project Actions */}
      <ProjectActions isOutboundPage={isOutboundPage} />
    </DropdownMenuContent>
  );
};

export default LogoDropdownContent;
