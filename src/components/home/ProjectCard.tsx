
import React from "react";
import { Folder, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card 
      className="border border-minimal-gray-100 hover:border-minimal-gray-200 hover:shadow-sm transition-all duration-300 bg-white overflow-hidden cursor-pointer"
      onClick={onViewProject}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-minimal-gray-50 rounded-full p-2">
            <Folder size={20} className="text-minimal-gray-500" />
          </div>
          <h3 className="font-semibold text-lg text-minimal-gray-800 truncate">{project.name}</h3>
        </div>
        
        <div className="flex justify-between items-center text-sm text-minimal-gray-500">
          <span>Updated {project.updatedAt}</span>
          <span className="text-xs">Created {project.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
