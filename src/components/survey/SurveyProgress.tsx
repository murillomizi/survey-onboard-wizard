
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

const SurveyProgress = ({ currentStep, totalSteps, onBack }: SurveyProgressProps) => {
  const progressPercentage = Math.min(((currentStep + 1) / totalSteps) * 100, 100);

  return (
    <div className="p-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Voltar para a pergunta anterior"
            >
              <ArrowLeft size={16} className="text-minimal-black" />
            </Button>
          )}
          <div className="text-sm font-medium text-minimal-black">
            Passo {currentStep + 1} de {totalSteps}
          </div>
        </div>
        <div className="text-xs text-minimal-gray-500">
          {Math.round(progressPercentage)}% concluído
        </div>
      </div>
      <Progress value={progressPercentage} className="h-1.5 bg-minimal-gray-100" />
    </div>
  );
};

export default SurveyProgress;
