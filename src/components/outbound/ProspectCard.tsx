
import React from "react";
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
      {/* Vazio intencionalmente para remover os controles como solicitado */}
    </div>
  );
};

export default ProspectCard;
