
import React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentType } from "@/types/outbound";

interface EmailFollowUp {
  subject: string;
  body: string;
}

interface FollowUps {
  email: EmailFollowUp[];
  linkedin: string[];
}

interface FollowUpSelectorProps {
  contentType: ContentType;
  followUps: FollowUps;
  activeFollowUpIndex: number | null;
  onSelectFollowUp: (index: number | null) => void;
  onDeleteFollowUp: (index: number) => void;
  onAddFollowUp: () => void;
}

const FollowUpSelector: React.FC<FollowUpSelectorProps> = ({
  contentType,
  followUps,
  activeFollowUpIndex,
  onSelectFollowUp,
  onDeleteFollowUp,
  onAddFollowUp
}) => {
  return (
    <div className="bg-minimal-gray-50 border-b border-minimal-gray-200 p-2 flex items-center justify-between">
      <div className="flex items-center gap-1 overflow-x-auto">
        <Button 
          variant={activeFollowUpIndex === null ? "default" : "ghost"}
          size="sm" 
          className={`text-xs ${activeFollowUpIndex === null ? "bg-minimal-black text-white" : ""}`}
          onClick={() => onSelectFollowUp(null)}
        >
          Mensagem inicial
        </Button>
        
        {contentType === "email" && followUps.email.map((_, index) => (
          <div key={`email-followup-${index}`} className="flex items-center">
            <Button
              variant={activeFollowUpIndex === index ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${activeFollowUpIndex === index ? "bg-minimal-black text-white" : ""}`}
              onClick={() => onSelectFollowUp(index)}
            >
              Follow-up #{index + 1}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6 ml-1 hover:bg-red-100"
              onClick={() => onDeleteFollowUp(index)}
            >
              <X size={14} className="text-red-500" />
            </Button>
          </div>
        ))}
        
        {contentType === "linkedin" && followUps.linkedin.map((_, index) => (
          <div key={`linkedin-followup-${index}`} className="flex items-center">
            <Button
              variant={activeFollowUpIndex === index ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${activeFollowUpIndex === index ? "bg-minimal-black text-white" : ""}`}
              onClick={() => onSelectFollowUp(index)}
            >
              Follow-up #{index + 1}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6 ml-1 hover:bg-red-100"
              onClick={() => onDeleteFollowUp(index)}
            >
              <X size={14} className="text-red-500" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs flex items-center gap-1"
        onClick={onAddFollowUp}
      >
        <Plus size={14} />
        Follow-up
      </Button>
    </div>
  );
};

export default FollowUpSelector;
