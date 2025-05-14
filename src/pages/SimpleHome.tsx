import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LoginDialog } from "@/components/ui/login-dialog";
import Navigation from "@/components/home/Navigation";
import HeroSection from "@/components/home/HeroSection";
import ProjectsSection from "@/components/home/ProjectsSection";

// Mock projects data - in a real app this would come from Supabase
const mockProjects = [
  {
    id: 1,
    name: "mizi-project-1",
    createdAt: "2024-05-10",
    updatedAt: "2024-05-11",
  },
  {
    id: 2,
    name: "mizi-project-2",
    createdAt: "2024-05-09",
    updatedAt: "2024-05-09",
  },
  {
    id: 3,
    name: "mizi-project-3",
    createdAt: "2024-05-08",
    updatedAt: "2024-05-10",
  }
];

const SimpleHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialDialogTab, setInitialDialogTab] = useState<"login" | "register">("login");
  const [projects, setProjects] = useState(mockProjects);
  
  const handleOpenLoginDialog = () => {
    setInitialDialogTab("login");
    setShowLoginDialog(true);
  };
  
  const handleOpenRegisterDialog = () => {
    setInitialDialogTab("register");
    setShowLoginDialog(true);
  };

  const handleSendChatMessage = () => {
    handleOpenRegisterDialog(); // Open register dialog after sending message
  };
  
  const handleCreateProject = () => {
    if (user) {
      toast.success("Projeto criado com sucesso!");
    } else {
      handleOpenRegisterDialog(); // Prompt login/signup for unauthenticated users
      toast.info("Please sign up to create a project");
    }
  };

  const handleViewProject = () => {
    if (user) {
      navigate("/outbound");
    } else {
      handleOpenLoginDialog();
    }
  };

  return (
    <div className="bg-minimal-white min-h-screen w-full text-minimal-black font-sans">
      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        initialTab={initialDialogTab}
      />
      
      {/* Navigation */}
      <Navigation 
        onOpenLogin={handleOpenLoginDialog} 
        onOpenRegister={handleOpenRegisterDialog} 
        user={user}
      />

      {/* Hero section */}
      <HeroSection onSendMessage={handleSendChatMessage} />

      {/* Projects Storage Section */}
      <ProjectsSection 
        projects={projects}
        onViewProject={handleViewProject}
      />
    </div>
  );
};

export default SimpleHome;
