
import React from "react";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    <Card className="border border-minimal-gray-200 hover:border-minimal-gray-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            onClick={onViewProject}
            className="text-xs border-minimal-gray-300 hover:bg-minimal-gray-100"
          >
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
