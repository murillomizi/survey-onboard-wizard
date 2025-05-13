
import React, { useState, useEffect } from "react";
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
  
  // Check for existing session
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
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
    // In a real app, this would create a new project
    handleOpenRegisterDialog(); // Prompt login/signup for unauthenticated users
    toast.info("Please sign up to create a project");
  };

  const handleViewProject = () => {
    handleOpenLoginDialog();
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
      />

      {/* Hero section */}
      <HeroSection onSendMessage={handleSendChatMessage} />

      {/* Projects Storage Section */}
      <ProjectsSection 
        projects={projects}
        onCreateProject={handleCreateProject}
        onViewProject={handleViewProject}
      />
    </div>
  );
};

export default SimpleHome;
