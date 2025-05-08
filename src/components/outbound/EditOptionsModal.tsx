
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { surveySteps } from "../survey/SurveySteps";
import ChatOptions from "../ChatOptions";

interface EditOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditOptionsModal: React.FC<EditOptionsModalProps> = ({ isOpen, onClose }) => {
  // Get relevant steps from survey, excluding email and CSV
  const relevantSteps = surveySteps.filter(
    step => step.field !== "userEmail" && step.field !== "csvData"
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    canal: "email",
    estagio: "topo",
    websiteUrl: "",
    tamanho: "350",
    linguagem: "formal",
    gatilho: "urgencia"
  });
  
  const handleNextStep = () => {
    if (currentStep < relevantSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save settings and close modal
      onClose();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleOptionSelect = (value: string) => {
    const currentField = relevantSteps[currentStep].field as keyof typeof selectedOptions;
    setSelectedOptions(prev => ({ ...prev, [currentField]: value }));
    
    // Auto advance to next question
    setTimeout(() => handleNextStep(), 300);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentField = relevantSteps[currentStep].field as keyof typeof selectedOptions;
    setSelectedOptions(prev => ({ ...prev, [currentField]: e.target.value }));
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNextStep();
  };
  
  const currentQuestion = relevantSteps[currentStep];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4 text-center">
            Editar configurações do modelo
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {relevantSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1 flex-1 mx-0.5 rounded-full ${
                  index <= currentStep ? "bg-purple-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{currentQuestion?.question}</h3>
            
            {/* Different input types based on question */}
            {currentQuestion?.options ? (
              <ChatOptions
                options={currentQuestion.options}
                onSelect={handleOptionSelect}
              />
            ) : currentQuestion?.field === "websiteUrl" ? (
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={selectedOptions.websiteUrl}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <Button type="submit" className="w-full">Continuar</Button>
              </form>
            ) : currentQuestion?.field === "tamanho" ? (
              <div className="space-y-4">
                <RadioGroup 
                  defaultValue={selectedOptions.tamanho}
                  onValueChange={(value) => handleOptionSelect(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="150" id="short" />
                    <Label htmlFor="short">Curto (~150 caracteres)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="350" id="medium" />
                    <Label htmlFor="medium">Médio (~350 caracteres)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="600" id="long" />
                    <Label htmlFor="long">Longo (~600 caracteres)</Label>
                  </div>
                </RadioGroup>
              </div>
            ) : null}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            
            {!currentQuestion?.options && currentQuestion?.field !== "tamanho" && (
              <Button onClick={handleNextStep}>
                {currentStep === relevantSteps.length - 1 ? "Concluir" : "Próximo"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOptionsModal;
