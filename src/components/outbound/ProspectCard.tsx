
import React from "react";
import { User, Briefcase, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="mx-4 mt-4 bg-white shadow-md border border-minimal-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User size={18} className="text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold">{currentProspect.firstName} {currentProspect.lastName}</h3>
            </div>
            
            <div className="flex items-center mb-2">
              <Briefcase size={16} className="text-blue-500 mr-2" />
              <p className="text-sm text-minimal-gray-600">{currentProspect.jobTitle}</p>
            </div>
            
            <div className="flex items-center">
              <Building2 size={16} className="text-green-500 mr-2" />
              <p className="text-sm text-minimal-gray-600">{currentProspect.company}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onPreviousProspect} 
              variant="outline" 
              size="sm" 
              className="p-2 h-9 w-9"
              disabled={totalProspects <= 1}
            >
              <ArrowLeft size={16} />
            </Button>
            <span className="flex items-center px-2 text-sm text-minimal-gray-600">
              {totalProspects > 0 ? `${currentProspectIndex + 1} / ${totalProspects}` : "0 / 0"}
            </span>
            <Button 
              onClick={onNextProspect} 
              variant="outline" 
              size="sm" 
              className="p-2 h-9 w-9"
              disabled={totalProspects <= 1}
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProspectCard;
