
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Folder } from "lucide-react";
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
  onViewProject: () => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
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
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-minimal-gray-800">Your Projects</h2>
          <p className="text-minimal-gray-600 max-w-md">View and manage your personalized campaigns</p>
          
          <div className="relative w-full max-w-md mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-minimal-gray-400" size={18} />
            <Input
              placeholder="Search projects..."
              className="pl-10 border-minimal-gray-200 focus:border-minimal-gray-400 w-full rounded-full bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewProject={onViewProject} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-minimal-gray-100 shadow-sm">
            <div className="bg-minimal-gray-50 rounded-full p-4 mb-4">
              <Folder size={32} className="text-minimal-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-minimal-gray-800">No projects found</h3>
            <p className="text-minimal-gray-500 text-center mb-6 max-w-md">
              {searchQuery
                ? "No projects match your search query."
                : "You haven't created any projects yet."}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
