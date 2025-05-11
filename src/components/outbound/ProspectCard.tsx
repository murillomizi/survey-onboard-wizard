
import React from "react";
import { User, Briefcase, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prospect } from "@/types/outbound";

interface ProspectCardProps {
  currentProspect: Prospect;
  currentProspectIndex: number;
  totalProspects: number;
  onPreviousProspect: () => void;
  onNextProspect: () => void;
}

const ProspectCard: React.FC<ProspectCardProps> = ({
  currentProspect,
  currentProspectIndex,
  totalProspects,
  onPreviousProspect,
  onNextProspect
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <User size={18} className="text-black mr-2" />
          <h3 className="text-lg font-bold text-black">{currentProspect.firstName} {currentProspect.lastName}</h3>
        </div>
        
        <div className="flex items-center mb-1">
          <Briefcase size={16} className="text-gray-600 mr-2" />
          <p className="text-sm text-gray-600">{currentProspect.jobTitle}</p>
        </div>
        
        <div className="flex items-center">
          <Building2 size={16} className="text-gray-600 mr-2" />
          <p className="text-sm text-gray-600">{currentProspect.company}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onPreviousProspect} 
          variant="outline" 
          size="sm" 
          className="p-2 h-9 w-9 border-gray-300 text-black hover:bg-gray-100"
          disabled={totalProspects <= 1}
        >
          <ArrowLeft size={16} />
        </Button>
        <span className="flex items-center px-2 text-sm text-gray-600">
          {totalProspects > 0 ? `${currentProspectIndex + 1} / ${totalProspects}` : "0 / 0"}
        </span>
        <Button 
          onClick={onNextProspect} 
          variant="outline" 
          size="sm" 
          className="p-2 h-9 w-9 border-gray-300 text-black hover:bg-gray-100"
          disabled={totalProspects <= 1}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ProspectCard;
