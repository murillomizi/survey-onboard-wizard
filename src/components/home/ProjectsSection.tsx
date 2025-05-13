
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCard from "./ProjectCard";
import { fadeIn } from "./animations";

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onCreateProject: () => void;
  onViewProject: () => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onCreateProject,
  onViewProject,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
              onClick={onCreateProject}
            >
              <Plus size={18} className="mr-1" />
              New Project
            </Button>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewProject={onViewProject} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-minimal-gray-300">
            <div className="bg-minimal-gray-100 rounded-full p-4 mb-4">
              <Folder size={32} className="text-minimal-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-minimal-gray-500 text-center mb-6 max-w-md">
              {searchQuery
                ? "No projects match your search query."
                : "You haven't created any projects yet."}
            </p>
            <Button
              onClick={onCreateProject}
              className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
            >
              <Plus size={18} className="mr-1" />
              Create First Project
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
