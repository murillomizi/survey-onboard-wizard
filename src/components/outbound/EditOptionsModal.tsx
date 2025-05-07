
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { surveySteps } from "../survey/SurveySteps";
import { ChatOptions } from "../ChatOptions";

interface EditOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (field: string, value: any) => void;
  currentSettings: {
    canal: string;
    funnelStage: string;
    websiteUrl: string;
    tamanho: number;
    tomVoz: string;
    gatilhos: string;
  };
}

const EditOptionsModal: React.FC<EditOptionsModalProps> = ({
  open,
  onOpenChange,
  onSettingsChange,
  currentSettings
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [localSettings, setLocalSettings] = useState(currentSettings);
  
  // Filtrar os passos para remover perguntas sobre email e CSV
  const filteredSteps = surveySteps.filter(
    step => step.field !== "userEmail" && step.field !== "csvFile" && step.field !== "summary"
  );
  
  const currentStepData = filteredSteps[currentStep];

  useEffect(() => {
    // Resetar para o primeiro passo quando o modal é aberto
    if (open) {
      setCurrentStep(0);
      setLocalSettings(currentSettings);
    }
  }, [open, currentSettings]);

  const handleOptionSelect = (value: string) => {
    if (currentStepData && currentStepData.field) {
      setLocalSettings(prev => ({
        ...prev,
        [currentStepData.field]: value
      }));
      
      // Passa para a próxima pergunta
      if (currentStep < filteredSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Última pergunta, salva as configurações
        handleSaveSettings();
      }
    }
  };

  const handleSliderChange = (value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      tamanho: value
    }));
  };

  const handleTextChange = (value: string) => {
    if (currentStepData && currentStepData.field) {
      setLocalSettings(prev => ({
        ...prev,
        [currentStepData.field]: value
      }));
    }
  };

  const handleSaveSettings = () => {
    // Aplica todas as configurações modificadas
    Object.entries(localSettings).forEach(([key, value]) => {
      onSettingsChange(key, value);
    });
    onOpenChange(false);
  };

  const handleNextStep = () => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveSettings();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-minimal-gray-800 text-minimal-white border-minimal-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-minimal-white">
            Editar configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">{currentStepData?.question}</h3>
            
            {currentStepData?.options ? (
              <ChatOptions 
                options={currentStepData.options} 
                onSelect={handleOptionSelect} 
                selectedValue={localSettings[currentStepData.field as keyof typeof localSettings] as string}
              />
            ) : currentStepData?.inputType === "slider" ? (
              <div className="px-4">
                <input 
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={localSettings.tamanho}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  {localSettings.tamanho} caracteres
                </div>
              </div>
            ) : currentStepData?.inputType === "text" ? (
              <input
                type="text"
                value={localSettings.websiteUrl || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full p-2 rounded bg-minimal-gray-700 border border-minimal-gray-600"
                placeholder="Digite aqui..."
              />
            ) : null}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="border-minimal-gray-600 hover:bg-minimal-gray-700"
            >
              Anterior
            </Button>
            
            <Button 
              onClick={handleNextStep}
              className="bg-minimal-purple hover:bg-minimal-purple/90"
            >
              {currentStep === filteredSteps.length - 1 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOptionsModal;
