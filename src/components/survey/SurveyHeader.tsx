
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface SurveyHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({ 
  currentStep, 
  totalSteps, 
  onBack 
}) => {
  const progressPercentage = Math.min(((currentStep + 1) / totalSteps) * 100, 100);

  return (
    <div className="p-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {currentStep > 0 && onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Voltar para a pergunta anterior"
            >
              <ArrowLeft size={16} className="text-gray-500" />
            </Button>
          )}
          <div className="text-sm font-medium text-gray-600">
            Passo {currentStep + 1} de {totalSteps}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {Math.round(progressPercentage)}% concluído
        </div>
      </div>
      <Progress value={progressPercentage} className="h-1.5 bg-gray-100" />
    </div>
  );
};

export default SurveyHeader;
