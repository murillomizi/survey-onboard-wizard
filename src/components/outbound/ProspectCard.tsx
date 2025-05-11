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
  return;
};
export default ProspectCard;