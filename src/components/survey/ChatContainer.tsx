
import React, { useRef, useEffect } from "react";
import { Message } from "./types";
import ChatMessage from "../ChatMessage";
import ChatOptions from "../ChatOptions";
import SliderInput from "./SliderInput";
import CSVFileUpload from "./CSVFileUpload";
import { motion } from "framer-motion";

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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-hide max-w-[600px] mx-auto w-full"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
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
    </motion.div>
  );
};

export default ChatContainer;
