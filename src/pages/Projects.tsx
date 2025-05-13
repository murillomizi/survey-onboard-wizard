
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn, UserPlus, Folder, PlusCircle, Search, Filter, Download, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/ui/login-dialog";
import { supabase } from "@/integrations/supabase/client";

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

// Project type definition
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  templates: number;
  campaigns: number;
}

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialDialogTab, setInitialDialogTab] = useState<"login" | "register">("login");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchProjects();
    }
  }, [user, navigate]);

  // Fetch projects from database
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // This would be replaced with an actual Supabase query
      // For now, using mock data
      const mockProjects = [
        {
          id: "1",
          name: "B2B Tech Outreach",
          description: "Campaign for SaaS products targeting CTOs",
          createdAt: "2025-04-28T10:30:00",
          lastUpdated: "2025-05-12T14:45:00",
          status: "active",
          templates: 3,
          campaigns: 2
        },
        {
          id: "2",
          name: "Healthcare Providers",
          description: "Specialized messaging for medical professionals",
          createdAt: "2025-05-01T09:15:00",
          lastUpdated: "2025-05-10T11:20:00",
          status: "draft",
          templates: 2,
          campaigns: 0
        },
        {
          id: "3",
          name: "Financial Services",
          description: "Outreach for banking and investment sectors",
          createdAt: "2025-04-15T16:45:00",
          lastUpdated: "2025-05-08T17:30:00",
          status: "active",
          templates: 5,
          campaigns: 3
        }
      ] as Project[];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenLoginDialog = () => {
    setInitialDialogTab("login");
    setShowLoginDialog(true);
  };
  
  const handleOpenRegisterDialog = () => {
    setInitialDialogTab("register");
    setShowLoginDialog(true);
  };

  const createNewProject = () => {
    toast.success("Creating new project...");
    // This would navigate to a project creation page or open a modal
    navigate("/outbound");
  };

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus ? project.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
        {user ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" className="font-medium" asChild>
              <Link to="/projects">Projects</Link>
            </Button>
          </div>
        ) : (
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
        )}
      </nav>

      {/* Hero section - Similar to landing page */}
      <motion.section className="px-4 md:px-8 py-10 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <div className="max-w-4xl mx-auto">
          <motion.h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight" variants={fadeIn} custom={1}>
            Your Projects
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-minimal-gray-600 mb-8" variants={fadeIn} custom={2}>
            Manage your personalized outreach campaigns and templates
          </motion.p>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section 
        className="px-4 md:px-8 py-8 bg-minimal-gray-50" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        custom={3}
      >
        <div className="max-w-7xl mx-auto">
          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-minimal-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setFilterStatus(filterStatus ? null : 'active')}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {filterStatus && (
                  <Badge className="absolute -top-2 -right-2 bg-minimal-black">
                    {filterStatus}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              onClick={createNewProject}
              className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 px-4 w-full md:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
          
          {/* Projects grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-minimal-black"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
                        <p className="text-sm text-minimal-gray-500 mt-1">
                          Created: {formatDate(project.createdAt)}
                        </p>
                      </div>
                      <Badge className={`
                        ${project.status === 'active' ? 'bg-green-500' : ''}
                        ${project.status === 'draft' ? 'bg-amber-500' : ''}
                        ${project.status === 'archived' ? 'bg-minimal-gray-400' : ''}
                      `}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-minimal-gray-600 line-clamp-2">{project.description}</p>
                    
                    <div className="flex gap-4 mt-4">
                      <div>
                        <p className="text-xs text-minimal-gray-500">Templates</p>
                        <p className="font-medium">{project.templates}</p>
                      </div>
                      <div>
                        <p className="text-xs text-minimal-gray-500">Campaigns</p>
                        <p className="font-medium">{project.campaigns}</p>
                      </div>
                      <div>
                        <p className="text-xs text-minimal-gray-500">Last Updated</p>
                        <p className="font-medium">{formatDate(project.lastUpdated)}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 mt-auto">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/outbound?project=${project.id}`)}
                      >
                        Open
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-minimal-white rounded-lg border border-minimal-gray-200">
              <Folder className="h-16 w-16 mx-auto text-minimal-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p className="text-minimal-gray-500 mb-6">
                {searchTerm || filterStatus ? 
                  "Try adjusting your search or filters" : 
                  "Create your first project to get started"
                }
              </p>
              {!searchTerm && !filterStatus && (
                <Button 
                  className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
                  onClick={createNewProject}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* Simple footer */}
      <footer className="px-4 md:px-8 py-6 border-t border-minimal-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="sm" />
          </div>
          <p className="text-sm text-minimal-gray-500">
            © {new Date().getFullYear()} Mizi AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
