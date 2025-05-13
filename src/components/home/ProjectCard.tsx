
import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onViewProject: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewProject }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="border border-minimal-gray-100 hover:border-minimal-gray-200 hover:shadow-md transition-all duration-300 bg-white overflow-hidden cursor-pointer group"
        onClick={onViewProject}
      >
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg text-minimal-gray-800 mb-3 truncate">{project.name}</h3>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-minimal-gray-500">Updated {project.updatedAt}</span>
            <ArrowRight size={18} className="text-minimal-gray-300 group-hover:text-minimal-gray-600 transition-colors duration-300" />
          </div>
          <div className="text-xs text-minimal-gray-400 mt-1">Created {project.createdAt}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
