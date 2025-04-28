
import React, { useRef } from "react";
import ChatMessage from "../ChatMessage";
import ChatOptions from "../ChatOptions";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Message } from "@/hooks/useChatMessages";

interface SurveyContentProps {
  messages: Message[];
  isWaitingForResponse: boolean;
  showOptions: {
    options: { value: string; label: string }[];
    step: number;
    isComplete?: boolean;
  } | null;
  showSlider: boolean;
  sliderValue: number;
  onOptionSelect: (value: string) => void;
  onSliderChange: (values: number[]) => void;
  onSliderComplete: () => void;
  isComplete?: boolean;
}

const SurveyContent: React.FC<SurveyContentProps> = ({
  messages,
  isWaitingForResponse,
  showOptions,
  showSlider,
  sliderValue,
  onOptionSelect,
  onSliderChange,
  onSliderComplete,
  isComplete = false
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-hide max-w-[600px] mx-auto w-full">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          type={message.type}
        />
      ))}
      
      {isWaitingForResponse && (
        <ChatMessage content="" type="bot" isTyping={true} />
      )}
      
      {showOptions && (
        <div className="mb-4">
          <ChatOptions
            options={showOptions.options}
            onSelect={onOptionSelect}
            isComplete={isComplete || (showOptions.isComplete || false)}
          />
        </div>
      )}
      
      {showSlider && !isComplete && (
        <div className="mb-4 p-4 border border-gray-200 bg-white rounded-xl shadow-sm">
          <div className="mb-2">
            <span className="text-gray-800">{sliderValue} caracteres</span>
          </div>
          <Slider
            defaultValue={[350]}
            max={1000}
            min={100}
            step={10}
            value={[sliderValue]}
            onValueChange={onSliderChange}
            className="mb-2"
          />
          <p className="text-gray-500 text-sm mt-1 italic">
            Recomendado: 350-500 caracteres para maior impacto
          </p>
          <Button 
            onClick={onSliderComplete}
            className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200"
          >
            Confirmar
          </Button>
        </div>
      )}
      
      <div ref={chatEndRef} />
    </div>
  );
};

export default SurveyContent;
