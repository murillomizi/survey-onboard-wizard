
import React from "react";
import { Edit, Copy, LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface ProjectActionsProps {
  isOutboundPage?: boolean;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ 
  isOutboundPage = false 
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/"); // Redirecting to the home page
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="p-2 space-y-1">
      <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700" : "hover:bg-minimal-gray-100"}`}>
        <div className="flex items-center gap-2">
          <Edit size={16} className={isOutboundPage ? "text-minimal-gray-400" : "text-minimal-gray-500"} />
          <span className={isOutboundPage ? "text-minimal-gray-300" : "text-minimal-gray-700"}>Rename Project</span>
        </div>
      </DropdownMenuItem>
      
      <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700" : "hover:bg-minimal-gray-100"}`}>
        <div className="flex items-center gap-2">
          <Copy size={16} className={isOutboundPage ? "text-minimal-gray-400" : "text-minimal-gray-500"} />
          <span className={isOutboundPage ? "text-minimal-gray-300" : "text-minimal-gray-700"}>Duplicate Project</span>
        </div>
      </DropdownMenuItem>
      
      <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700" : "hover:bg-minimal-gray-100"}`}>
        <div className="flex items-center gap-2">
          <span className={isOutboundPage ? "text-minimal-gray-300" : "text-minimal-gray-700"}>Create New Project</span>
        </div>
      </DropdownMenuItem>
      
      {user && (
        <DropdownMenuItem 
          className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700 text-red-500" : "hover:bg-minimal-gray-100 text-red-500"}`}
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} className="text-red-500" />
            <span>Sair</span>
          </div>
        </DropdownMenuItem>
      )}
    </div>
  );
};

export default ProjectActions;
