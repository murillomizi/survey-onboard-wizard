
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  currentStep: number;
  showOptions: boolean;
  showSlider: boolean;
  onSendMessage: (input: string) => void;
  onFileUpload: () => void;
  isSubmitting: boolean;
  stepsLength: number;
  handleSubmit: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentStep,
  showOptions,
  showSlider,
  onSendMessage,
  onFileUpload,
  isSubmitting,
  stepsLength,
  handleSubmit
}) => {
  const [currentInput, setCurrentInput] = useState("");

  const handleInputSubmit = () => {
    if (!currentInput.trim()) return;
    onSendMessage(currentInput);
    setCurrentInput("");
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
      <div className="flex items-center gap-2 max-w-[600px] mx-auto">
        {currentStep === 6 && (
          <Button
            type="button"
            onClick={onFileUpload}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
          >
            <Paperclip size={18} />
            Upload CSV
          </Button>
        )}
        
        {currentStep < 6 && !showOptions && !showSlider && (
          <>
            <div className="relative flex-1">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleInputSubmit()}
                placeholder="Digite sua resposta..."
                className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-full pr-12 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-all duration-200"
              />
              <Button
                onClick={handleInputSubmit}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 p-0"
              >
                <Send size={14} />
              </Button>
            </div>
          </>
        )}
        
        {currentStep === stepsLength - 1 && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
          >
            {isSubmitting ? 'Salvando...' : 'Continuar'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
