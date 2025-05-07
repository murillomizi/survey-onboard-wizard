
import React, { useRef, useEffect } from "react";
import { Message } from "./types";
import ChatMessage from "../ChatMessage";
import ChatOptions from "../ChatOptions";
import SliderInput from "./SliderInput";
import CSVFileUpload from "./CSVFileUpload";

interface ChatContainerProps {
  messages: Message[];
  isWaitingForResponse: boolean;
  showOptions: {
    options: { value: string; label: string }[];
    step: number;
  } | null;
  showSlider: boolean;
  sliderValue: number;
  currentStep: number;
  onOptionSelect: (value: string) => void;
  onSliderChange: (val: number[]) => void;
  onSliderComplete: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatContainer = ({
  messages,
  isWaitingForResponse,
  showOptions,
  showSlider,
  sliderValue,
  currentStep,
  onOptionSelect,
  onSliderChange,
  onSliderComplete,
  onFileChange
}: ChatContainerProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-hide max-w-[600px] mx-auto w-full">
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
          />
        </div>
      )}
      
      {showSlider && (
        <SliderInput
          value={sliderValue}
          onChange={onSliderChange}
          onComplete={onSliderComplete}
        />
      )}
      
      {currentStep === 7 && (
        <CSVFileUpload onFileSelect={onFileChange} />
      )}
      
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatContainer;
