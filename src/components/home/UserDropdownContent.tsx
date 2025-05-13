
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Database, UserRound } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface UserDropdownContentProps {
  user: User | null;
}

const UserDropdownContent: React.FC<UserDropdownContentProps> = ({ user }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  const handleNavigateToOutbound = () => {
    navigate("/outbound");
  };

  const handleNavigateToDashboard = () => {
    navigate("/simple");
  };

  return (
    <DropdownMenuContent align="end" className="w-72 p-0">
      {/* User Profile Section */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-2">
            <UserRound size={16} className="text-minimal-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-minimal-gray-900">
              {user.email}
            </span>
            <span className="text-xs text-minimal-gray-500">
              Último acesso: {new Date(user.last_sign_in_at || "").toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <DropdownMenuSeparator className="bg-minimal-gray-200" />
            
      {/* Project Button */}
      <div className="p-2">
        <DropdownMenuItem 
          className="px-3 py-2.5 rounded-md hover:bg-minimal-gray-100 text-minimal-gray-900"
          onClick={handleNavigateToOutbound}
        >
          <div className="flex items-center gap-2">
            <span>mizi-project-1</span>
          </div>
        </DropdownMenuItem>
      </div>
      
      {/* Dashboard Button */}
      <div className="p-2">
        <DropdownMenuItem 
          className="px-3 py-2.5 rounded-md hover:bg-minimal-gray-100 text-minimal-gray-900"
          onClick={handleNavigateToDashboard}
        >
          <div className="flex items-center gap-2">
            <Database size={16} className="text-minimal-black" />
            <span>Dashboard</span>
          </div>
        </DropdownMenuItem>
      </div>
      
      <DropdownMenuSeparator className="bg-minimal-gray-200" />
      
      {/* Usage Limits */}
      <div className="p-3 border-minimal-gray-200 text-minimal-gray-700">
        <h4 className="text-xs font-medium mb-2 text-minimal-gray-700">Usage Limits</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>Prospects used:</span>
            <span className="font-medium">48 / 100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '48%' }}></div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>API Requests:</span>
            <span className="font-medium">324 / 1000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '32.4%' }}></div>
          </div>
        </div>
      </div>
      
      <DropdownMenuSeparator className="bg-minimal-gray-200" />
      
      {/* Logout Button */}
      <div className="p-2">
        <DropdownMenuItem 
          className="px-3 py-2 rounded-md text-sm hover:bg-minimal-gray-100 text-red-500"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} className="text-red-500" />
            <span>Sair</span>
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  );
};

export default UserDropdownContent;
