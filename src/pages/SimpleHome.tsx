
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Send, Search, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/ui/login-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// Mock projects data - in a real app this would come from Supabase
const mockProjects = [
  {
    id: 1,
    name: "Cold Email Campaign",
    createdAt: "2024-05-10",
    updatedAt: "2024-05-11",
  },
  {
    id: 2,
    name: "LinkedIn Outreach",
    createdAt: "2024-05-09",
    updatedAt: "2024-05-09",
  },
  {
    id: 3,
    name: "Sales Follow-up",
    createdAt: "2024-05-08",
    updatedAt: "2024-05-10",
  }
];

const SimpleHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialDialogTab, setInitialDialogTab] = useState<"login" | "register">("login");
  const [chatMessage, setChatMessage] = useState("");
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtered projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check for existing session
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleOpenLoginDialog = () => {
    setInitialDialogTab("login");
    setShowLoginDialog(true);
    console.log("Opening login dialog");
  };
  
  const handleOpenRegisterDialog = () => {
    setInitialDialogTab("register");
    setShowLoginDialog(true);
    console.log("Opening register dialog with register tab");
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      toast.success("Message sent! This is a demo - in a real app, this would be processed by an LLM.");
      setChatMessage("");
      handleOpenRegisterDialog(); // Optional: Open register dialog after sending message
    }
  };
  
  const handleCreateProject = () => {
    // In a real app, this would create a new project
    handleOpenRegisterDialog(); // Prompt login/signup for unauthenticated users
    toast.info("Please sign up to create a project");
  };

  return (
    <div className="bg-minimal-white min-h-screen w-full text-minimal-black font-sans">
      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        initialTab={initialDialogTab}
      />
      
      {/* Navigation - Simplificado */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-minimal-gray-300 hover:bg-minimal-gray-100"
            onClick={handleOpenLoginDialog}
          >
            <LogIn className="h-3.5 w-3.5 mr-1.5" />
            <span>Login</span> 
          </Button>
          <Button 
            size="sm" 
            className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
            onClick={handleOpenRegisterDialog}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            <span>Sign Up</span>
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <motion.section className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" variants={fadeIn} custom={1}>
            AI that actually personalize your approach.
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-minimal-gray-600 mb-12 max-w-2xl mx-auto" variants={fadeIn} custom={2}>
            Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
          </motion.p>
          <motion.div variants={fadeIn} custom={3} className="max-w-xl mx-auto">
            {/* Chat Input replacing the Button */}
            <div className="relative bg-minimal-black rounded-full shadow-lg p-1">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask Mizi to create a campaign..."
                className="w-full bg-minimal-black text-minimal-white border-0 pr-12 py-6 h-auto text-base focus:ring-0 focus:outline-none placeholder:text-minimal-gray-400 rounded-full"
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  onClick={handleSendChatMessage}
                  disabled={!chatMessage.trim()}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-transparent hover:bg-minimal-gray-800 text-minimal-white"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Storage Section */}
      <motion.section 
        className="px-4 md:px-8 py-16 bg-minimal-gray-50 rounded-t-3xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={4}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Projects</h2>
              <p className="text-minimal-gray-600">Create and manage your personalized campaigns</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-minimal-gray-400" size={18} />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 border-minimal-gray-300 focus:border-minimal-gray-500 w-full sm:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
                onClick={handleCreateProject}
              >
                <Plus size={18} className="mr-1" />
                New Project
              </Button>
            </div>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="border border-minimal-gray-200 hover:border-minimal-gray-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-minimal-gray-100 rounded-full p-2">
                        <Folder size={20} className="text-minimal-gray-600" />
                      </div>
                      <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                    </div>
                    <p className="text-sm text-minimal-gray-500">
                      Last updated: {project.updatedAt}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-minimal-gray-200 bg-minimal-gray-50 px-6 py-3">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs text-minimal-gray-500">Created {project.createdAt}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleOpenLoginDialog}
                        className="text-xs border-minimal-gray-300 hover:bg-minimal-gray-100"
                      >
                        View
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-minimal-gray-300">
              <div className="bg-minimal-gray-100 rounded-full p-4 mb-4">
                <Folder size={32} className="text-minimal-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-minimal-gray-500 text-center mb-6 max-w-md">
                {searchQuery ? 'No projects match your search query.' : 'You haven\'t created any projects yet.'}
              </p>
              <Button 
                onClick={handleCreateProject}
                className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
              >
                <Plus size={18} className="mr-1" />
                Create First Project
              </Button>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default SimpleHome;
