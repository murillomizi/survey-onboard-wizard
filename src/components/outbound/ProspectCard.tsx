import React from "react";
import { User, Briefcase, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prospect } from "@/types/outbound";

interface ProspectCardProps {
  currentProspect: {
    id: string;
    nome?: string;
    first_name?: string;
    cargo?: string;
    copy?: string;
    // ... outros campos
  };
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
  if (!currentProspect) return null;
  const nome = currentProspect.nome || currentProspect.first_name || "(Sem nome)";
  const cargo = currentProspect.cargo || "(Sem cargo)";
  const copy = currentProspect.copy || "(Sem copy gerado)";
  return (
    <Card className="mx-4 mb-4 bg-white shadow-sm border border-minimal-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User size={18} className="text-black mr-2" />
              <h3 className="text-lg font-semibold">{nome}</h3>
            </div>
            <div className="flex items-center mb-2">
              <Briefcase size={16} className="text-black mr-2" />
              <p className="text-sm text-minimal-gray-600">{cargo}</p>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-bold mr-2">Copy:</span>
              <p className="text-sm text-minimal-gray-800 whitespace-pre-line">{copy}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onPreviousProspect} 
              variant="outline" 
              size="sm" 
              className="p-2 h-9 w-9 bg-minimal-white border-minimal-gray-200"
              disabled={totalProspects <= 1}
            >
              <ArrowLeft size={16} className="text-black" />
            </Button>
            <span className="flex items-center px-2 text-sm text-minimal-gray-600">
              {totalProspects > 0 ? `${currentProspectIndex + 1} / ${totalProspects}` : "0 / 0"}
            </span>
            <Button 
              onClick={onNextProspect} 
              variant="outline" 
              size="sm" 
              className="p-2 h-9 w-9 bg-minimal-white border-minimal-gray-200"
              disabled={totalProspects <= 1}
            >
              <ArrowRight size={16} className="text-black" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProspectCard;
