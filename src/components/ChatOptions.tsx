
import React from "react";
import { Button } from "@/components/ui/button";

interface ChatOptionProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

const ChatOptions = ({ options, onSelect }: ChatOptionProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => (
        <Button
          key={option.value}
          className="bg-survey-card hover:bg-survey-card/80 text-survey-text border border-gray-700"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default ChatOptions;
