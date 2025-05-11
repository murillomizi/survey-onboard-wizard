
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
      <div className="flex items-center">
        <span className="flex items-center px-2 text-sm text-gray-600">
          {totalProspects > 0 ? `${currentProspectIndex + 1} / ${totalProspects}` : "0 / 0"}
        </span>
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
    </div>
  );
};

export default ProspectCard;
