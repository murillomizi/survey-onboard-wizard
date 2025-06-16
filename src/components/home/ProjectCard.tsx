import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/outbound/${project.id}`)}
    >
      <Card 
        className="border border-minimal-gray-100 hover:border-minimal-gray-200 hover:shadow-md transition-all duration-300 bg-white overflow-hidden cursor-pointer group"
      >
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg text-minimal-gray-800 mb-3 truncate">{`mizi-project-${project.id}`}</h3>
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
